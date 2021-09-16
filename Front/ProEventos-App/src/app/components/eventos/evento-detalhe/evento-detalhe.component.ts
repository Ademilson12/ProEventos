import { Component, OnInit, TemplateRef } from '@angular/core';
import { AbstractControl, AbstractControlOptions, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { EventoService } from 'src/app/services/evento.service';
import { LoteService } from 'src/app/services/lote.service';

import { Evento } from 'src/app/models/Evento';
import { Lote } from 'src/app/models/Lote';

import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';



@Component({
  selector: 'app-evento-detalhe',
  templateUrl: './evento-detalhe.component.html',
  styleUrls: ['./evento-detalhe.component.scss']
})
export class EventoDetalheComponent implements OnInit {

  loteAtual = { id: 0, nome: '', indice: 0 };
  modalRef: BsModalRef;
  eventoId: number;
  evento = {} as Evento;
  form!: FormGroup;
  estadoSalvar = 'post';

  get modoEditar(): boolean{
    return this.estadoSalvar === 'put';
  }


  get lotes(): FormArray{
    return this.form.get('lotes') as FormArray;
  }

  get f(): any{
    return this.form.controls;
  }


  get bsConfig(): any{
    return {
      adaptivePosition: true,
      dateInputFormat: 'DD/MM/YYYY hh:mm a',
      containerClass: 'theme-default',
      showWeekNumbers: false
    };
  }



  constructor(private fb: FormBuilder,
    private localeService: BsLocaleService,
    private activatedRouter: ActivatedRoute,
    private eventoService: EventoService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private router: Router,
    private loteService: LoteService,
    private modalService: BsModalService)
    {
      this.localeService.use('pt-br');
    }

    public carregarEvento(): void {
      this.eventoId = +this.activatedRouter.snapshot.paramMap.get('id');

      if (this.eventoId !== null && this.eventoId !== 0 ) {
        this.spinner.show();

        this.estadoSalvar = 'put';


        this.eventoService.getEventoById(this.eventoId).subscribe(
          (evento: Evento ) => {
            this.evento = {...evento};
            this.form.patchValue(this.evento);
            //Modo mais complicado de carregar os lotes salvos, tem que criar o metodo carregarLotes comentado abaixo
            this.carregarLotes();

            //Modo fácil de retornar os lotes com apenas 3 linhas, não faz a requisição ao banco de dados.
            //this.evento.lotes.forEach(lote => { // Cada item do lotesRetorno vai ser passado para lote via callback
            //  this.lotes.push(this.criarLote(lote)); // Esse lotes vem do get lotes declarado na linha 34
            //});
          },
          (error: any) => {
            this.spinner.hide();
            this.toastr.error('Erro ao tentar carregar evento');
            console.error(error);
          },
          ).add(() => this.spinner.hide());
        }
      }

      //Metodo criado para fazer a requisição de retorno de lotes
      public carregarLotes(): void{
        this.loteService.getLotesByEventoId(this.eventoId).subscribe(
          (lotesRetorno: Lote[]) => {
            lotesRetorno.forEach(lote => { // Cada item do lotesRetorno vai ser passado para lote via callback
              this.lotes.push(this.criarLote(lote)); // Esse lotes vem do get lotes declarado na linha 34
            })
          },
          (error: any) => {
            this.toastr.error('Erro ao tentar carregar lotes', 'Erro');
            console.error(error);
          },
        ).add(() => this.spinner.hide());
      }

      ngOnInit() {
        this.carregarEvento();
        this.validation();
      }

      private validation(): void {
        this.form = this.fb.group({
          tema: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(50)]],
          local: ['', Validators.required],
          dataEvento: ['', Validators.required],
          qtdPessoas: ['', [Validators.required, Validators.max(12000)]],
          telefone: ['', Validators.required],
          email: ['', [Validators.required, Validators.email]],
          imagemURL: ['', Validators.required],
          lotes: this.fb.array([])
        });
      }

      adicionarLote(): void{
        this.lotes.push(this.criarLote({id: 0} as Lote));
      }

      criarLote(lote: Lote):FormGroup {
        return  this.fb.group({
          id: [lote.id],
          nome: [lote.nome, Validators.required],
          quantidade: [lote.quantidade, Validators.required],
          preco: [lote.preco, Validators.required],
          dataInicio: [lote.dataInicio],
          dataFim: [lote.dataFim],
        });
      }

      public mudarValorData(value: Date, indice: number, campo: string): void {
        this.lotes.value[indice][campo] = value;

      }

      public retornaTituloLote(nome: string): string {
        return nome === null || nome === '' ? 'Nome Lote' : nome;
      }

      public resetForm():void {
        this.form.reset();
      }

      public cssValidator(campoForm: FormControl | AbstractControl): any {
        return {'is-invalid': campoForm.errors && campoForm.touched}
      }

      public salvarEvento(): void{
        this.spinner.show();
        if(this.form.valid){

          //this.evento = {...this.form.value}; //spread operator, equivale ao auto mapper

          if(this.estadoSalvar === 'post'){
            this.evento = {...this.form.value};
            this.eventoService.postEvento(this.evento).subscribe(
              (eventoRetorno: Evento) => {
                this.toastr.success('Evento salvo com sucesso', 'Sucesso');
                this.router.navigate([`eventos/detalhe/${eventoRetorno.id}`]);
              },
              (error: any) => {
                console.error(error);
                this.toastr.error('Erro ao salvar evento', 'Erro')
              },
              () => this.spinner.hide(),
              );
            }
        }
    }

    public salvarLotes(): void{
      if(this.form.controls.lotes.valid){
        this.spinner.show();
        this.loteService.saveLote(this.eventoId, this.form.value.lotes).subscribe(
          () => {
            this.toastr.success('Lotes salvos com Sucesso!', 'Sucesso!');
            //this.lotes.reset();
          },
          (error: any) => {
            this.toastr.error('Erro ao tentar salvar lotes', 'Erro');
            console.error(error);
          },
        ).add(() => this.spinner.hide());
      }
    }

    public removerLote(template: TemplateRef<any>,
      indice: number): void {

      this.loteAtual.id = this.lotes.get(indice + '.id').value;
      this.loteAtual.nome = this.lotes.get(indice + '.nome').value;
      this.loteAtual.indice = indice;

      this.modalRef = this.modalService.show(template, {class: 'modal-sm' });
    }

    confirmDeleteLote(): void {
      this.modalRef.hide();
      this.spinner.show();

      this.loteService.deleteLote(this.eventoId, this.loteAtual.id)
        .subscribe(
          () => {
            this.toastr.success('Lote deletado com sucesso', 'Sucesso');
            this.lotes.removeAt(this.loteAtual.indice);
          },
          (error: any) => {
            this.toastr.error(`Erro ao tentar deletar o Lote ${this.loteAtual.id}`, 'Erro');
            console.error(error);
          }
        ).add(() => this.spinner.hide());
    }

    declineDeleteLote(): void {
      this.modalRef.hide();
    }

}
