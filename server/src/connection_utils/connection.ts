import { ServerWriteableStream } from 'grpc'

export interface Connection<RequestType> {
  stream: ServerWriteableStream<RequestType>
}
