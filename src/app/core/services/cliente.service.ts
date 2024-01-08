import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Cliente } from 'src/app/shared/cliente.model';

@Injectable({
  providedIn: 'root',
})
export class ClienteService {
  constructor(private _http: HttpClient) {}

  adicionarCliente(data: Cliente): Observable<any> {
    return this._http.post('http://localhost:3000/employees', data);
  }

  atualizarCliente(id: number, data: Cliente): Observable<any> {
    return this._http.put(`http://localhost:3000/employees/${id}`, data);
  }

  obterListaCliente(): Observable<any> {
    return this._http.get('http://localhost:3000/employees');
  }

  excluirCliente(id: number): Observable<any> {
    return this._http.delete(`http://localhost:3000/employees/${id}`);
  }
}
