import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EMPTY, Observable, Subject } from 'rxjs';
import { catchError, concatMap, map, take } from 'rxjs/operators';
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

  form: FormGroup;
  formSubmitted = false;

  constructor(
    private cursosService: CursosService,
    private fb: FormBuilder) {
    
  }

  ngOnInit() {
    this.inicializaFormulario();
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

  inicializaFormulario() {
    this.form = this.fb.group({
      id: [null],
      nome: ['', Validators.compose([
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(50),
      ])],
    })
  };

  salvarCurso() {
    this.formSubmitted = true
    if (this.form.valid && this.form.value.id) {
      // update
      this.cursosService.update(this.form.value)
        .subscribe(
          success => { 
            console.log('Curso editado com sucesso!');
            this.form.reset();
          },
          error => console.log('Ocorreu um erro ao tentar editar o curso...', error),
          () => console.log('Fim do fluxo de edição do curso.')
        );
      this.formSubmitted = false;
    } else {
      // create
      this.cursosService.create(this.form.value)
        .subscribe(
          success => { 
            console.log('Curso salvo com sucesso!');
            this.form.reset();
          },
          error => console.log('Ocorreu um erro ao tentar salvar o curso...', error),
          () => console.log('Fim do fluxo de salvar curso.')
        );
      this.formSubmitted = false;
    }
  }

  editarCurso(id: number) {
    this.cursosService.get(id)
      .subscribe((curso) => {
          this.form.patchValue({
            id: curso.id,
            nome: curso.nome,
          })
      });
  }

}
