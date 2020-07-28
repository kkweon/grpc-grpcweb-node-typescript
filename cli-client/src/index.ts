import { ChatServiceClient } from './generated/chat_service_grpc_pb'
import { credentials } from 'grpc'
import {
  Empty,
  CreateStreamResponse,
  CreateStreamRequest,
} from './generated/chat_service_pb'
import { printMessage } from './printMessage'
import { mainReadMessageAndSend } from './mainPrompUsernameAndMessage'
import readline from 'readline'

process.on('SIGINT', function () {
  console.log('terminating')
  process.exit()
})

const client = new ChatServiceClient(
  process.env.ADDRESS || '0.0.0.0:8888',
  credentials.createInsecure(),
)

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

rl.question('enter a username: ', (username) => {
  const request = new CreateStreamRequest()
  request.setUsername(username)
  const stream = client.createStream(request)

  stream.on('data', (resp: CreateStreamResponse) => {
    printMessage(resp.getMessage())
  })

  mainReadMessageAndSend(client, username, rl)
})
