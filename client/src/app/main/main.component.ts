import { Component, OnInit, ViewChild, ElementRef } from '@angular/core'
import { ChatService } from '../chat-service.service'
import { map, scan, tap } from 'rxjs/operators'
import { Message } from 'src/generated/chat_service_pb'
import { Observable } from 'rxjs'
import { Timestamp } from 'src/generated/timestamp_pb'
import { NgForm } from '@angular/forms'
import { ActivatedRoute, Router } from '@angular/router'
import { UserService } from '../user.service'

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class MainComponent implements OnInit {
  messages$: Observable<Message[]>
  message: string

  @ViewChild('chatAreaRef')
  chatFormElement: ElementRef

  constructor(
    private chatSerivce: ChatService,
    private userService: UserService,
  ) {}

  scrollChatAreaToBottom(): void {
    this.chatFormElement.nativeElement.scrollTop = this.chatFormElement.nativeElement.scrollHeight
  }

  ngOnInit(): void {
    this.messages$ = this.chatSerivce.connect(this.userService.username).pipe(
      map((streamResponse) => {
        return streamResponse.getMessage()
      }),
      scan((acc: Message[], curr: Message) => [...acc, curr], []),
    )
  }

  renderMessage(message: Message): string {
    const timestamp = this.getJSDateFromTimestamp(message.getTimestamp())
    return `[${timestamp.toLocaleString()}]\t${message.getUsername()}:\t${message.getMessage()}`
  }

  getJSDateFromTimestamp(ts: Timestamp): Date {
    const date = new Date()
    date.setTime(ts.getSeconds() * 1000)
    return date
  }

  async onSubmit() {
    await this.chatSerivce.sendMessage(this.userService.username, this.message)
    this.message = ''
  }
}
