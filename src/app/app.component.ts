import { Component, OnInit } from '@angular/core';
import { EMPTY, Observable, Subject } from 'rxjs';
import { catchError, take } from 'rxjs/operators';
import { Curso } from './interfaces/curso';
import { CursosService } from './services/cursos.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'http-examples';
  cursos: Curso[] = [];

  cursosAsync$: Observable<Curso[]>;

  error$ = new Subject<boolean>();

  constructor(private cursosService: CursosService) {
    
  }

  ngOnInit() {
  }

  listarCursosAsync() {
    // Utilizando o async (Vide html), o unsubscribe é feito automaticamente
    this.cursosAsync$ = this.cursosService.list()
      .pipe(
        catchError(error => this.tratarErro(error))
      );
  }

  listarCursos() {
    this.cursosService.list()
      .pipe(
        take(1),
        // O take recebe quantas vezes queremos receber a resposta.
        // No caso de chamadas http onde o backend não é reativo, essa é a maneira que devemos consumir.
      
        catchError(error => {
          this.cursos = [];
          return this.tratarErro(error);
        })
      )
      .subscribe(
        data => this.cursos = data
      );
  }

  tratarErro(error: any) {
    console.log(error);
    this.error$.next(true);
    return EMPTY;
  }

}
