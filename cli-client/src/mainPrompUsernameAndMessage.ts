import readline from 'readline'
import { ChatServiceClient } from './generated/chat_service_grpc_pb'
import { SendMessageRequest } from './generated/chat_service_pb'
import { buildMessage } from './buildMessage'

export function mainReadMessageAndSend(
  client: ChatServiceClient,
  username: string,
  rl: readline.Interface,
): void {
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
}
