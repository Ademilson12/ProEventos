import { Component, OnInit } from '@angular/core';
import { AbstractControlOptions, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ValidatorField } from 'src/app/helpers/ValidatorField';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent implements OnInit {

  form!: FormGroup;

  get f(): any{
    return this.form.controls;
  }
  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    this.validation();
  }

  private validation(): void{

    const formOptions: AbstractControlOptions = {
      validators: ValidatorField.MustMatch('senha', 'confirmarSenha')
    };

    this.form = this.fb.group({
      primeiroNome: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(50)]],
      ultimoNome: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(50)]],
      email: ['', [Validators.required, Validators.email]],
      usuario: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(50)]],
      senha: ['', [Validators.required, Validators.minLength(6)]],
      confirmarSenha: ['', Validators.required]
    }, formOptions);
  }

}
