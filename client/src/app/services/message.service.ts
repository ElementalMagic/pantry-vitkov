import {Injectable} from "@angular/core";
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: "root"
})
export class MessageService{
  constructor(private http: HttpClient){}

  getMessage():Observable<Message> {
    return this.http.get<Message>('/api/');
  }
}

export interface Message {
  title: string
}
