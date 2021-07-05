import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit {

  isCollapsed = true; /*Faz a barra de navegação iniciar como hamburguer */

  constructor() { }

  ngOnInit() {
  }

}
