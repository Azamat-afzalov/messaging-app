import { Component, OnInit, OnDestroy } from '@angular/core';
import {WebSocketService} from './web-socket.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  subscriptions = [];
  message = '';
  username = '';
  connected = false;
  messages = [];
  users: number = 0;
  joinedUser = ''
  constructor(private webSocketService: WebSocketService) {}

  ngOnInit(): void {
    this.subscriptions.push(this.webSocketService
      .listen('new message')
      .subscribe( data => {
        console.log('new message :',data)
        this.messages.push({
          message : data.message,
          username: data.username
        });
      }));
    this.subscriptions.push(
      this.webSocketService
        .listen('login')
        .subscribe(({numUsers,messages}) => {
          this.users = numUsers;
          this.connected = true;
          this.messages = messages;
          console.log(messages);
        })
    )
    this.subscriptions.push(
      this.webSocketService
      .listen('user joined')
      .subscribe(({numUsers,username}) => {
        this.users = numUsers;
        this.joinedUser = username;
      })
    )
    this.subscriptions.push(
      this.webSocketService
      .listen('user left')
      .subscribe(({numUsers,username}) => {
        this.users = numUsers;
      })
    )
  }
  public login(): void {
    this.webSocketService.emit('add-user', this.username);
  }
  public sendMessage(): void {
    this.webSocketService.emit('new message', this.message);
    this.message = '';
  }
  ngOnDestroy(){
    this.subscriptions.forEach(subscription => subscription.unsubscribe())
  }
}
