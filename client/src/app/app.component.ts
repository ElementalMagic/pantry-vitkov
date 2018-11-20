import {Component, Injectable, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {MessageService} from "./services/message.service";
import {AuthService} from "./shared/services/auth.service";


@Component({
  selector: 'app-root',
  template: '<router-outlet></router-outlet>'
})
export class AppComponent implements OnInit{
  constructor(private auth: AuthService){}

  ngOnInit(){
    const potentialToken = localStorage.getItem('auth-token');
    if(potentialToken !== null){
      this.auth.setToken(potentialToken);
    }
  }
}
export interface Message {
  title: string
}
