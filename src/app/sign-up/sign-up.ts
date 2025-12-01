import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { takeUntil } from 'rxjs';
import { Client } from '../Service/ClientIF';
import { BackService } from '../Service/BackendService';
import { Router, RouterLink } from '@angular/router';
@Component({
  selector: 'app-sign-up',
  imports: [FormsModule, ReactiveFormsModule, RouterLink],
  templateUrl: './sign-up.html',
  styleUrl: './sign-up.css',
})
export class SignUp {
  BackendService = new BackService();
  SignUp: FormGroup;
  submit:boolean | null = null;
  passwordMatch(group: FormGroup) {
    return group.get('Password')?.value === group.get("Confirm")?.value
      ? true : false;
  }
  constructor(private fb: FormBuilder,private router:Router) {
    this.SignUp = this.fb.group({
      FullName: ['', [Validators.required, Validators.minLength(3),Validators.pattern("^[a-zA-Z]+$")]],
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
      const Client = this.SignUp.value as Client;
      this.BackendService.CreateClient(Client).subscribe({
        next : value => {console.log(value)
          window.alert("Successfull SignUp");
          this.router.navigate(['/sign-in'])
        },
        error : (e) => {console.log(e)},
      });
    }else{
      this.submit=true;
    }

  }
}
