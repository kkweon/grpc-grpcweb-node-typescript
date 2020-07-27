import readline from 'readline'
import { ChatServiceClient } from './generated/chat_service_grpc_pb'
import { credentials } from 'grpc'
import {
  Empty,
  CreateStreamResponse,
  Message,
  SendMessageRequest,
} from './generated/chat_service_pb'

process.on('SIGINT', function() {
  console.log("terminating")
  process.exit()
})

const client = new ChatServiceClient(
  process.env.ADDRESS || '0.0.0.0:8888',
  credentials.createInsecure(),
)

const stream = client.createStream(new Empty())
stream.on('data', (resp: CreateStreamResponse) => {
  printMessage(resp.getMessage())
})

function printMessage(message: Message | undefined) {
  if (!message) {
    return
  }
  const timestamp = message.getTimestamp()
  const date = new Date()
  date.setTime(timestamp!.getSeconds() * 1000)

  const username = message.getUsername()
  console.log(`[${date.toLocaleString()}] ${username}: ${message.getMessage()}`)
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

rl.question('enter a username: ', (username) => {
  function prompMessage() {
    rl.question('enter a message: ', (message) => {
      const request = new SendMessageRequest()
      request.setMessage(buildMessage(username, message))
      client.sendMessage(request, (error) => {
        if (error) {
          console.error(error)
          return
        }
      })

      prompMessage()
    })
  }

  prompMessage()
})

function buildMessage(username: string, msg: string): Message {
  const message = new Message()
  message.setUsername(username)
  message.setMessage(msg)
  return message
}
