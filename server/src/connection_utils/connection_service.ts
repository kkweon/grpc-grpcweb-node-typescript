import { Connection } from './connection'
import { Message, CreateStreamResponse } from '../generated/chat_service_pb'
import { getTimestampNow } from '../timestamp_util'

export interface ConnectionService<RequestType> {
  addConnection(connection: Connection<RequestType>): void
  broadcast(message: Message | undefined): void
}

function wrapWithCreateStreamResponse(message: Message): CreateStreamResponse {
  const resp = new CreateStreamResponse()
  resp.setMessage(message)
  return resp
}

export class InMemoryConnectionService<RequestType>
  implements ConnectionService<RequestType> {
  private connections: Connection<RequestType>[] = []

  addConnection(connection: Connection<RequestType>): void {
    this.connections.push(connection)
    console.info('created a new connection')
  }
  async broadcast(message: Message | undefined): Promise<void> {
    if (!message) {
      return
    }
    const activeConnectionPromises: Promise<Connection<RequestType>>[] = []

    message.setTimestamp(getTimestampNow())

    for (const connection of this.connections) {
      if (connection.stream.cancelled || connection.stream.destroyed) {
        console.info('skipping already cancelled or destroyed connection')
        continue
      }
      activeConnectionPromises.push(
        new Promise((resolve, reject) => {
          connection.stream.write(
            wrapWithCreateStreamResponse(message),
            (error) => {
              if (!error) {
                console.info('sent message message = ', message)
                resolve(connection)
              } else {
                console.warn('connection is lost connection = ', connection)
                connection.stream.end()
                reject(error)
              }
            },
          )
        }),
      )
    }

    const activeConnections: Connection<RequestType>[] = []
    for (const promise of activeConnectionPromises) {
      try {
        activeConnections.push(await promise)
      } catch (error) {
        console.warn('connection disconnected ' + error)
      }
    }

    this.connections = activeConnections
  }
}
