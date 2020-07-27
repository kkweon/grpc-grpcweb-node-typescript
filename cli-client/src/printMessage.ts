import { Message } from './generated/chat_service_pb'

export function printMessage(message: Message | undefined): void {
  if (!message) {
    return
  }
  const timestamp = message.getTimestamp()
  const date = new Date()
  date.setTime(timestamp!.getSeconds() * 1000)

  const username = message.getUsername()
  console.log(`[${date.toLocaleString()}] ${username}: ${message.getMessage()}`)
}
