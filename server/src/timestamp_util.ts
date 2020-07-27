import { Timestamp } from './generated/timestamp_pb'
export function getTimestampNow(): Timestamp {
  const timestamp = new Timestamp()
  const now = Date.now()
  timestamp.setSeconds(Math.floor(now / 1000))
  timestamp.setNanos((now % 1000) * 1e6)
  return timestamp
}
