import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Curso } from '../interfaces/curso';
import { tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CursosService {

  constructor(private http: HttpClient) { }

  list(): Observable<Curso[]> {
    const url = `${environment.apiBaseUrl}cursos`;

    return this.http.get<Curso[]>(url)
      .pipe(
        tap((data) => console.log(data))
      );
  }

  // add(): 
}
