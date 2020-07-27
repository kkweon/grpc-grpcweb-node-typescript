import {Component, OnInit} from '@angular/core';
import {ChatService} from '../chat-service.service';
import {map, scan} from 'rxjs/operators';
import {Message} from 'src/generated/chat_service_pb';
import {Observable} from 'rxjs';
import {Timestamp} from 'src/generated/timestamp_pb';
import {NgForm} from '@angular/forms';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class MainComponent implements OnInit {
  messages$: Observable<Message[]>;
  // form inputs
  username: string;
  message: string;

  constructor(private chatSerivce: ChatService) {
  }

  ngOnInit(): void {
    this.messages$ = this.chatSerivce.connect().pipe(
      map((streamResponse) => {
        return streamResponse.getMessage();
      }),
      scan((acc: Message[], curr: Message) => [...acc, curr], [])
    );
  }

  renderMessage(message: Message): string {
    const timestamp = this.getJSDateFromTimestamp(message.getTimestamp());
    return `[${timestamp.toLocaleString()}] ${message.getUsername()} ${message.getMessage()}`;
  }

  getJSDateFromTimestamp(ts: Timestamp): Date {
    const date = new Date();
    date.setTime(ts.getSeconds() * 1000);
    return date;
  }

  async onSubmit(chatForm: NgForm) {
    await this.chatSerivce.sendMessage(this.username, this.message);
    this.message = ""
    chatForm.reset({
      username: this.username
    })
  }
}
