import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-eventos',
  templateUrl: './eventos.component.html',
  styleUrls: ['./eventos.component.scss']
})
export class EventosComponent implements OnInit {

  public eventos: any = [];
  larguraImgem: number = 100; /* Property binding */
  margemImgem: number = 2; /* Property binding */
  exibirImagem: boolean = true;
  public eventosFiltrados: any = []
  private _filtroLista: string = '';

  public get filtroLista(): string{
    return this._filtroLista
  }

  public set filtroLista(value: string){
    this._filtroLista = value;
    this.eventosFiltrados = this.filtroLista ? this.filtrarEventos(this.filtroLista) : this.eventos;
  }

  filtrarEventos(filtrarPor : string): any {
    filtrarPor = filtrarPor.toLocaleLowerCase();
    return this.eventos.filter(
      (evento : any) => evento.tema.toLowerCase().indexOf(filtrarPor) !== -1 ||
      evento.local.toLowerCase().indexOf(filtrarPor) !== -1
    )
  }


  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.getEventos();
  }

  alterarImagem(){
    this.exibirImagem = !this.exibirImagem;
  }

  /*Metodo de conexão com a api*/
  public getEventos(): void {
    this.http.get('https://localhost:5001/api/eventos').subscribe(
      response => {
        this.eventos = response;
        this.eventosFiltrados = this.eventos;
      },
      error => console.log(error)
    );

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

}
