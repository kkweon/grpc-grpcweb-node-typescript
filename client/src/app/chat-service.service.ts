import { Injectable, ɵisDefaultChangeDetectionStrategy } from '@angular/core'
import { ChatServiceClient } from '../generated/Chat_serviceServiceClientPb'
import {
  Empty,
  CreateStreamResponse,
  SendMessageRequest,
  Message,
} from 'src/generated/chat_service_pb'
import { environment } from '../environments/environment'
import { Observable } from 'rxjs'
import {
  Error,
  ClientReadableStream,
  GrpcWebClientBase,
  Metadata,
} from 'grpc-web'

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  chatServiceClient: ChatServiceClient
  constructor() {
    this.chatServiceClient = new ChatServiceClient(environment.addressWithPort)
  }

  connect(): Observable<CreateStreamResponse> {
    return new Observable((observer) => {
      const deadline = new Date()
      deadline.setFullYear(deadline.getFullYear() + 1)
      const stream: ClientReadableStream<CreateStreamResponse> = this.chatServiceClient.createStream(
        new Empty(),
        {
          // @ts-ignore
          deadline: deadline.getTime(),
        },
      )
      stream.on('data', (resp: CreateStreamResponse) => {
        observer.next(resp)
      })

      stream.on('end', () => {
        observer.complete()
      })

      stream.on('error', (error: Error) => {
        observer.error(error)
      })

      // teardown logic
      return () => {
        stream.cancel()
      }
    })
  }

  sendMessage(username: string, message: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = new SendMessageRequest()
      request.setMessage(this.buildMessageWithUsername(username, message))
      this.chatServiceClient.sendMessage(request, null, (err) => {
        if (err) {
          reject(err)
        } else {
          resolve()
        }
      })
    })
  }

  buildMessageWithUsername(username: string, message: string): Message {
    const msg = new Message()
    msg.setUsername(username)
    msg.setMessage(message)
    return msg
  }
}
