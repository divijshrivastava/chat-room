import { Component, OnInit } from '@angular/core';
import * as SockJS from 'sockjs-client';
import * as Stomp from '@stomp/stompjs';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
})
export class ChatComponent implements OnInit {
  private stompClient: any;
  messages: string[] = [];
  newMessage: string = '';

  ngOnInit() {
    this.connectToWebSocket();
  }

  connectToWebSocket() {
    const socket = new SockJS('http://localhost:8080/ws');
    this.stompClient = Stomp.over(socket);

    this.stompClient.connect({}, () => {
      this.stompClient.subscribe('/topic/messages', (message: any) => {
        this.messages.push(JSON.parse(message.body));
      });
    });
  }

  sendMessage() {
    if (this.newMessage.trim()) {
      this.stompClient.send(
        '/app/chat',
        {},
        JSON.stringify({
          content: this.newMessage,
        })
      );
      this.newMessage = '';
    }
  }
}
