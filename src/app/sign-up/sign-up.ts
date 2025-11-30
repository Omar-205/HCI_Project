import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { takeUntil } from 'rxjs';

@Component({
  selector: 'app-sign-up',
  imports: [FormsModule,ReactiveFormsModule],
  templateUrl: './sign-up.html',
  styleUrl: './sign-up.css',
})
export class SignUp {
  SignUp: FormGroup;
  submit:boolean | null = null;
  passwordMatch(group: FormGroup) {
    return group.get('Password')?.value === group.get("Confirm")?.value
      ? true : false;
  }
  constructor(private fb: FormBuilder) {
    this.SignUp = this.fb.group({
      UserName: ['', [Validators.required, Validators.minLength(3),Validators.pattern("^[a-zA-Z]+$")]],
      Email: ['', [Validators.required, Validators.email]],
      TeleNumber: ['', Validators.pattern("^01[5|0|1|2][0-9]{8}$")],
      Password: ['', Validators.required],
      Confirm: ['', Validators.required],
    },);
  }

  alert(){
    console.log(this.SignUp)
  }
  onSubmit(){
    this.submit=false
    if(this.SignUp.valid && this.passwordMatch(this.SignUp)){
      console.log(this.SignUp.value as JSON)
    }else{
      this.submit=true;
    }

  }
}
