import { Connection } from './connection'
import {
  Message,
  CreateStreamResponse,
  CreateStreamRequest,
} from '../generated/chat_service_pb'
import { getTimestampNow } from '../timestamp_util'
import { logger } from '../app_logger'

const kSystem = 'system'

export interface ConnectionService<RequestType> {
  addConnection(connection: Connection<RequestType>): void

  broadcast(message: Message | undefined): void
}

function wrapWithCreateStreamResponse(message: Message): CreateStreamResponse {
  const resp = new CreateStreamResponse()
  resp.setMessage(message)
  return resp
}

export class InMemoryConnectionService
  implements ConnectionService<CreateStreamRequest> {
  private connections: Connection<CreateStreamRequest>[] = []

  addConnection(connection: Connection<CreateStreamRequest>): void {
    const username = connection.stream.request.getUsername()

    if (!username) {
      logger.warn(
        'connection was created but the username was not found in the request',
      )
      connection.stream.end()
      return
    }

    this.connections.push(connection)
    logger.info('created a new connection')

    this.broadcast(
      this.generateSystemMessage(`${username} has joined the room`),
    )
  }

  private generateSystemMessage(message: string): Message {
    const msg = new Message()
    msg.setTimestamp(getTimestampNow())
    msg.setUsername(kSystem)
    msg.setMessage(message)
    return msg
  }

  async broadcast(message: Message | undefined): Promise<void> {
    if (!message) {
      return
    }
    const activeConnectionPromises: Promise<
      Connection<CreateStreamRequest>
    >[] = []
    const inactiveConnections: Connection<CreateStreamRequest>[] = []

    message.setTimestamp(getTimestampNow())

    for (const connection of this.connections) {
      if (connection.stream.cancelled || connection.stream.destroyed) {
        logger.info('skipping already cancelled or destroyed connection')
        inactiveConnections.push(connection)
        continue
      }
      activeConnectionPromises.push(
        new Promise((resolve, reject) => {
          connection.stream.write(
            wrapWithCreateStreamResponse(message),
            (error) => {
              if (!error) {
                logger.info('sent message message = ', message)
                resolve(connection)
              } else {
                logger.warn(`connection is lost connection = ${connection}`)
                logger.warn(`error message = ${error}`)
                reject({ error, connection })
              }
            },
          )
        }),
      )
    }

    const activeConnections: Connection<CreateStreamRequest>[] = []
    for (const promise of activeConnectionPromises) {
      try {
        activeConnections.push(await promise)
      } catch ({ error, connection }) {
        inactiveConnections.push(connection)
        logger.warn('connection disconnected ' + error)
      }
    }

    this.connections = activeConnections

    inactiveConnections.forEach((disconnectedConnection) => {
      this.broadcast(
        this.generateSystemMessage(
          `${disconnectedConnection.username} was disconnected`,
        ),
      )
    })
  }
}
