import { Component, OnInit, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Evento } from 'src/app/models/Evento';
import { EventoService } from 'src/app/services/evento.service';

@Component({
  selector: 'app-evento-lista',
  templateUrl: './evento-lista.component.html',
  styleUrls: ['./evento-lista.component.scss']
})
export class EventoListaComponent implements OnInit {

  modalRef = {} as BsModalRef;


  public eventos: Evento[] = [];
  public eventosFiltrados:any [] = [];


  public larguraImgem: number = 100; /* Property binding */
  public margemImgem: number = 2; /* Property binding */
  public exibirImagem: boolean = true;

  private filtroListado: string = '';

  public get filtroLista(): string{
    return this.filtroListado
  }

  public set filtroLista(value: string){
    this.filtroListado = value;
    this.eventosFiltrados = this.filtroLista ? this.filtrarEventos(this.filtroLista) : this.eventos;
  }

  public filtrarEventos(filtrarPor : string): Evento[] {
    filtrarPor = filtrarPor.toLocaleLowerCase();
    return this.eventos.filter(
      (evento : any) => evento.tema.toLowerCase().indexOf(filtrarPor) !== -1 ||
      evento.local.toLowerCase().indexOf(filtrarPor) !== -1
    );
  }


  constructor(
    private eventoService: EventoService,
    private modalService: BsModalService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private router: Router
    ) { }

  ngOnInit(): void {
    this.spinner.show();

    this.getEventos(); //Iniciar os eventos na tela


  }

  public alterarImagem(): void{
    this.exibirImagem = !this.exibirImagem;
  }

  /*Metodo de conexão com a api*/
  public getEventos(): void {
    this.eventoService.getEventos().subscribe({
      next: (eventos: Evento[]) => {
        this.eventos = eventos;
        this.eventosFiltrados = this.eventos;
      },
      error: (error: any) => {
        this.spinner.hide();
        this.toastr.error('Erro ao Carregar os Eventos', 'Erro!');
      },
      complete: () => this.spinner.hide()
    });
  }



    //Evento de excluir
    openModal(template: TemplateRef<any>): void {
      this.modalRef = this.modalService.show(template, {class: 'modal-sm'});
    }

    confirm(): void {
      this.toastr.success('O evento foi deletado com sucesso!', 'Deletado!');
      this.modalRef.hide();
    }

    decline(): void {
      this.modalRef.hide();
    }

    detalheEvento(id: number): void {
      this.router.navigate([`eventos/detalhe/${id}`])
    }


    /* Teste antes de conectar com o bd
    this.eventos = [
      {
        Tema: 'Angular 11',
        Local: 'São Paulo'
      },
      {
        Tema: '.Net Core',
        Local: 'São Paulo'
      },
      {
        Tema: 'Angular e suas novidades',
        Local: 'São Paulo'
      },
    ]
    */

  }


function complete(arg0: (eventos: Evento[]) => void, arg1: (error: any) => void, complete: any, arg3: () => Promise<unknown>) {
  throw new Error('Function not implemented.');
}

function next(next: any, arg1: (eventos: Evento[]) => void, error: { (...data: any[]): void; (message?: any, ...optionalParams: any[]): void; }, arg3: (error: any) => void, complete: (arg0: (eventos: Evento[]) => void, arg1: (error: any) => void, complete: any, arg3: () => Promise<unknown>) => void, arg5: (complete: any) => Promise<unknown>) {
  throw new Error('Function not implemented.');
}


