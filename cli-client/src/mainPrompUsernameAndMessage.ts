import readline from 'readline'
import { ChatServiceClient } from './generated/chat_service_grpc_pb'
import { SendMessageRequest } from './generated/chat_service_pb'
import { buildMessage } from './buildMessage'

export function mainPrompUsernameAndMessage(client: ChatServiceClient): void {
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
}
