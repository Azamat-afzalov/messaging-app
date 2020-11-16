import { Component, OnInit } from '@angular/core';
import {WebSocketService} from './web-socket.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  message = '';
  messages = [];
  users = [];
  constructor(private webSocketService: WebSocketService) {}

  ngOnInit(): void {
    this.webSocketService.listen('get-messages').subscribe(data => {
      this.messages = data;
    });
    this.webSocketService.listen('new-message').subscribe( data => {
      this.messages.push({title : data.title, userId: data.userId});
    });
    this.webSocketService.listen('online-users').subscribe( data => {
      this.users = data;
    });
  }
  public sendMessage(): void {
    this.webSocketService.emit('new-message', this.message);
    this.message = '';
  }
}
