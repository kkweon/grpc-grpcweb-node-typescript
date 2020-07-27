import { ChatServiceClient } from './generated/chat_service_grpc_pb'
import { credentials } from 'grpc'
import { Empty, CreateStreamResponse } from './generated/chat_service_pb'
import { printMessage } from './printMessage'
import { mainPrompUsernameAndMessage } from './mainPrompUsernameAndMessage'

process.on('SIGINT', function () {
  console.log('terminating')
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

mainPrompUsernameAndMessage(client)
