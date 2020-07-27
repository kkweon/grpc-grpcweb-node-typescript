import { IChatServiceServer } from './generated/chat_service_grpc_pb'
import {
  handleServerStreamingCall,
  handleUnaryCall,
  ServerWritableStream,
} from 'grpc'
import {
  Empty,
  CreateStreamResponse,
  SendMessageRequest,
} from './generated/chat_service_pb'
import { getTimestampNow } from './timestamp_util'
import { ConnectionService } from './connection_utils/connection_service'

export class ChatServiceImpl implements IChatServiceServer {
  constructor(private connectionService: ConnectionService<Empty>) {}
  createStream: handleServerStreamingCall<Empty, CreateStreamResponse> = (
    stream,
  ) => {
    this.connectionService.addConnection({
      stream: stream,
    })
  }

  sendMessage: handleUnaryCall<SendMessageRequest, Empty> = (
    call,
    callback,
  ) => {
    callback(null, new Empty())
    this.connectionService.broadcast(call.request.getMessage())
  }
}
