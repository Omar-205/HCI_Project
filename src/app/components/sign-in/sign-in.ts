import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { BackService } from '../Service/BackendService';
import { Client } from '../Service/ClientIF';
import { Router, RouterLink } from "@angular/router";
@Component({
  selector: 'app-sign-in',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './sign-in.html',
  styleUrl: './sign-in.css'
})
export class SignIn {
  BackendService = new BackService;
  submit:boolean | null = null;
  SignIn : FormGroup;
  constructor(private fb: FormBuilder,private router:Router) {
    this.SignIn = this.fb.group({
      email : ['',[Validators.required,Validators.email]],
      password : ['',Validators.required],

    })
  }
    onSubmit(){
    this.submit=false
    if(this.SignIn.valid){
      const Client = this.SignIn.value as Client;
      this.BackendService.VerifySignIn(Client).subscribe({
        next: (value: any)=> {
          if(value != null){
          console.log(value)
          window.alert("Successfull SignIn")
          this.router.navigate(['home'])

          localStorage.setItem("Username",`${this.SignIn.value['email']}`)
          localStorage.setItem('token',value['token'])
          }
        },
        error: (e)=>{console.log(Client);console.log(e)}
      })
    }else{
      this.submit=true;
    }

  }
}
