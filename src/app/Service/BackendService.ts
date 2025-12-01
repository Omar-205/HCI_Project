import { HttpClient } from "@angular/common/http";
import { inject } from "@angular/core";
import { Client } from "./ClientIF"; 

export class BackService{
    baseUrl = "http://127.0.0.1:8080/Clients";
    http = inject(HttpClient);
    CreateClient(Client : Client){
        return this.http.post(this.baseUrl,Client)
    }
    VerifySignIn(Client:Client){
        const Url = this.baseUrl + "/Verify";
        return this.http.post(Url,Client);
    }
}