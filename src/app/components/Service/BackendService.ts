import { HttpClient } from "@angular/common/http";
import { inject } from "@angular/core";
import { Client } from "./ClientIF";

export class BackService{
    baseUrl = "http://127.0.0.1:8080/api/v1/auth";
    http = inject(HttpClient);
    CreateClient(Client : Client){
        return this.http.post(this.baseUrl + "/register",Client)
    }
    VerifySignIn(Client:Client){
        const Url = this.baseUrl + "/authenticate";
        return this.http.post(Url,Client);
    }
}
