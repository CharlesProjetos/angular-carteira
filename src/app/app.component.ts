import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { CoreService } from './core/core.service';
import { ClienteService } from './core/services/cliente.service';
import { FormularioClienteComponent } from './pages/formulario-cliente/formulario-cliente.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  displayedColumns: string[] = [
    'id',
    'nome',
    'sobrenome',
    'cpf',
    'dataNascimento',
    'rendaMensal',
    'dataCadastro',
    'acao',
  ];
  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private _dialog: MatDialog,
    private _clienteService: ClienteService,
    private _coreService: CoreService
  ) {}

  ngOnInit(): void {
    this.obterListaCliente();
  }

  adicionarCliente() {
    const dialogRef = this._dialog.open(FormularioClienteComponent);
    dialogRef.afterClosed().subscribe({
      next: (val) => {
        if (val) {
          this.obterListaCliente();
        }
      },
    });
  }

  obterListaCliente() {
    this._clienteService.obterListaCliente().subscribe({
      next: (res) => {
        this.dataSource = new MatTableDataSource(res);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
      },
      error: console.log,
    });
  }

  pesquisar(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  excluirCliente(id: number) {
    this._clienteService.excluirCliente(id).subscribe({
      next: () => {
        this._coreService.openSnackBar('Cadastro excluído!', 'OK');
        this.obterListaCliente();
      },
      error: console.log,
    });
  }

  editarCliente(data: any) {
    const dialogRef = this._dialog.open(FormularioClienteComponent, {
      data,
    });

    dialogRef.afterClosed().subscribe({
      next: (val) => {
        if (val) {
          this.obterListaCliente();
        }
      },
    });
  }
}
