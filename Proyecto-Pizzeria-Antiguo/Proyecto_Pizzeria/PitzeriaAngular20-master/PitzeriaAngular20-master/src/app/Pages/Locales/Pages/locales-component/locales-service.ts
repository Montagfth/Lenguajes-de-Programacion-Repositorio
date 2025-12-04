import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LocalesService {

  private http = inject(HttpClient);
  private url = 'http://localhost:8080';

  getAllLocales() : Observable<any> {
    return this.http.get<any[]>(this.url);
  }




}
