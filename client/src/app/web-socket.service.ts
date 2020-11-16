import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {io} from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  socket: any;
  readonly uri = 'http://localhost:3000';
  constructor() {
    this.socket = io(this.uri);
  }


  listen(eventName: string): Observable<any> {
    return new Observable((subscriber) => {
      this.socket.on(eventName, data => {
        subscriber.next(data);
      });
    });
  }


  emit(eventName: string, data: any): void {
    this.socket.emit(eventName, data);
  }
}
