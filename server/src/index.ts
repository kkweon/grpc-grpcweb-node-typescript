import {
  IChatServiceServer,
  ChatServiceService,
} from './generated/chat_service_grpc_pb'
import {
  handleServerStreamingCall,
  handleUnaryCall,
  Server,
  ServerCredentials,
} from 'grpc'
import {
  Empty,
  CreateStreamResponse,
  SendMessageRequest,
  Message,
} from './generated/chat_service_pb'
import { Timestamp } from './generated/timestamp_pb'

function getTimestampNow(): Timestamp {
  const timestamp = new Timestamp()
  const now = Date.now()
  timestamp.setSeconds(Math.floor(now / 1000))
  timestamp.setNanos((now % 1000) * 1e6)
  return timestamp
}

class ChatServiceImpl implements IChatServiceServer {
  createStream: handleServerStreamingCall<Empty, CreateStreamResponse> = (
    call,
  ) => {
    call
    setInterval(() => {
      const resp = new CreateStreamResponse()

      const message = new Message()
      message.setUsername('kkweon')
      message.setMessage('hello world')
      message.setTimestamp(getTimestampNow())
      resp.setMessage(message)

      console.log(`Will write resp => ${resp}`)
      call.write(resp, (error) => {
        if (error) {
          console.warn('error occurred while writing response', error)
        }
      })
    }, 1000)
  }

  sendMessage: handleUnaryCall<SendMessageRequest, Empty> = (
    call,
    callback,
  ) => {
    const message = call.request.getMessage()
    console.log('Hello ' + (message?.getUsername() ?? '??????'))
    callback(null, new Empty())
  }
}

const server = new Server()
server.addService(ChatServiceService, new ChatServiceImpl())
server.bind('0.0.0.0:8888', ServerCredentials.createInsecure())
server.start()
