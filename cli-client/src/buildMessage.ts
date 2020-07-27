import { Message } from './generated/chat_service_pb'
export function buildMessage(username: string, msg: string): Message {
  const message = new Message()
  message.setUsername(username)
  message.setMessage(msg)
  return message
}
