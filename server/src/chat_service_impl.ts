import { IChatServiceServer } from './generated/chat_service_grpc_pb'
import {
  handleServerStreamingCall,
  handleUnaryCall,

} from 'grpc'
import {
  Empty,
  CreateStreamResponse,
  SendMessageRequest, CreateStreamRequest,
} from './generated/chat_service_pb'
import { getTimestampNow } from './timestamp_util'
import { ConnectionService } from './connection_utils/connection_service'

export class ChatServiceImpl implements IChatServiceServer {
  constructor(private connectionService: ConnectionService<CreateStreamRequest>) {
  }

  createStream: handleServerStreamingCall<CreateStreamRequest, CreateStreamResponse> = (
    stream,
  ) => {
    this.connectionService.addConnection({
      stream: stream,
      username: stream.request.getUsername(),
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
