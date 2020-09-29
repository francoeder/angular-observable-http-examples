import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Curso } from '../interfaces/curso';
import { take, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CursosService {

  private readonly API = `${environment.apiBaseUrl}cursos`;

  constructor(private http: HttpClient) { }

  list(): Observable<Curso[]> {
    return this.http.get<Curso[]>(this.API)
      .pipe(
        tap((data) => console.log(data))
      );
  }

  get(id: number): Observable<Curso> {
    return this.http.get<Curso>(`${this.API}/${id}`)
      .pipe(
        take(1)
      );
  }

  create(curso: Curso) {
    return this.http.post(this.API, curso)
      .pipe(
        take(1)
      );
  }

  update(curso: Curso) {
    return this.http.put(`${this.API}/${curso.id}`, curso)
      .pipe(
        take(1)
      );
  }

  delete(id: number) {
    return this.http.delete(`${this.API}/${id}`)
      .pipe(
        take(1)
      );
  }
}
