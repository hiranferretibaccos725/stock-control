import { Component, OnInit } from '@angular/core';
import { PrimeNGConfig } from 'primeng/api';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'stock-control';
  constructor(private primeNGConfig: PrimeNGConfig) {}

  ngOnInit(): void {
    this.primeNGConfig.ripple = true;
    this.primeNGConfig.setTranslation({
      apply: 'Aplicar',
      clear: 'Limpar',
    });
  }
}
