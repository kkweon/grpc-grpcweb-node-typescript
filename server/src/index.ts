import { ChatServiceService } from './generated/chat_service_grpc_pb'
import { Server, ServerCredentials } from 'grpc'
import { ChatServiceImpl } from './chat_service_impl'
import { InMemoryConnectionService } from './connection_utils/connection_service'

const server = new Server()
server.addService(
  ChatServiceService,
  new ChatServiceImpl(new InMemoryConnectionService()),
)
server.bind('0.0.0.0:8888', ServerCredentials.createInsecure())
server.start()
