import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-sign-in',
  imports: [ReactiveFormsModule],
  templateUrl: './sign-in.html',
  styleUrl: './sign-in.css'
})
export class SignIn {
  submit:boolean | null = null;
  SignIn : FormGroup;
  constructor(private fb: FormBuilder) {
    this.SignIn = this.fb.group({
      Email : ['',[Validators.required,Validators.email]],
      Password : ['',Validators.required],
      Remember: ['']
    })
  }
    onSubmit(){
    this.submit=false
    if(this.SignIn.valid){
      console.log(this.SignIn.value as JSON)
    }else{
      this.submit=true;
    }

  }
}
