import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Cliente } from 'src/app/shared/cliente.model';
import { CoreService } from '../../core/core.service';
import { ClienteService } from '../../core/services/cliente.service'; 

const CPF = require('cpf'); 
@Component({
  selector: 'app-formulario-cliente',
  templateUrl: './formulario-cliente.component.html',
  styleUrls: ['./formulario-cliente.component.scss'],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'pt-BR' }
  ]
})
export class FormularioClienteComponent implements OnInit {
  formularioCliente: FormGroup;
  cliente: Cliente = new Cliente();
  dataAtual = new Date();
  mensagemErroCPF: boolean = false;
  mensagemErroIdade: boolean = false;

  constructor(
    private _fb: FormBuilder,
    private _clienteService: ClienteService,
    private _dialogRef: MatDialogRef<FormularioClienteComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _coreService: CoreService,
  ) {
    this.formularioCliente = this._fb.group({
      nome: [this.cliente.nome, [Validators.required]],
      sobrenome: [this.cliente.sobrenome, [Validators.required]],
      cpf: [this.cliente.cpf, [Validators.required]],
      dataNascimento: [this.cliente.dataNascimento, [Validators.required]],
      rendaMensal: [this.cliente.rendaMensal, [Validators.required]],
      email: [this.cliente.email, [Validators.required]],
      dataCadastro: [{ value: this.cliente.dataCadastro, disabled: true }],
    });
  }

  ngOnInit(): void {
    this.formularioCliente.patchValue(this.data);
    if(this.data){
      this.formularioCliente.get('cpf')?.disable();
    }else{
      this.formularioCliente.get('dataCadastro')?.setValue(new Date());
    }

    this.formularioCliente.get('cpf')?.valueChanges.subscribe(cpf => {
      if(this.formularioCliente.get('cpf')?.value.length === 14){
        this.validaCPF();
      }else{
        this.formularioCliente.get('cpf')?.setErrors(null);
      }
    });

    this.formularioCliente.get('dataNascimento')?.valueChanges.subscribe(dataNascimento => {
      console.log('Mudanças no formulário:', dataNascimento);
      this.mensagemErroIdade = this.validaIdade(dataNascimento);
      this.mensagemErroIdade ? this.mensagemErroIdade : this.formularioCliente.get('dataNascimento')?.setErrors({ 'idadeInvalida': this.mensagemErroIdade });
    });
  }

  validaCPF(){
    this.mensagemErroCPF = CPF.isValid(this.formularioCliente.get('cpf')?.value);
    this.mensagemErroCPF ? this.formularioCliente.get('cpf')?.setErrors(null) :
    this.formularioCliente.get('cpf')?.setErrors({ 'cpfInvalido': !this.mensagemErroCPF });
  }

  submeterFormulario() {
    this.validaCPF();
    if (this.formularioCliente.valid) {
        this.efetivacaoCadastro();
    }
  }

  efetivacaoCadastro(){
    if (this.data) {
      this._clienteService.atualizarCliente(this.data.id, this.dados())
        .subscribe({
          next: () => {
            this._coreService.openSnackBar('Registro atualizado!');
            this._dialogRef.close(true);
          },
          error: (err: any) => {
            console.error(err);
          },
        });
    } else {
      this._clienteService.adicionarCliente(this.dados()).subscribe({
        next: () => {
          this._coreService.openSnackBar('Cliente cadastrado!');
          this._dialogRef.close(true);
        },
        error: (err: any) => {
          console.error(err);
        },
      });
    }
  }

  dados(){
    const camposDesabilitados = {
      cpf: this.formularioCliente.get('cpf')?.value,
      dataCadastro: this.formularioCliente.get('dataCadastro')?.value,
    };
    const formDataCompleto = { ...this.formularioCliente.value, ...camposDesabilitados };
    return formDataCompleto;
  }

  validaIdade(dataNascimento: Date) {
    dataNascimento = new Date(dataNascimento);
    let idade = this.dataAtual.getFullYear() - dataNascimento.getFullYear();
    const mesAtual = this.dataAtual.getMonth();
    const diaAtual = this.dataAtual.getDate();
    const mesNascimento = dataNascimento.getMonth();
    const diaNascimento = dataNascimento.getDate();
  
    if (mesAtual < mesNascimento || (mesAtual === mesNascimento && diaAtual < diaNascimento)) {
      idade--;
    }
  
    return idade > 18 && idade < 60;
  }
}