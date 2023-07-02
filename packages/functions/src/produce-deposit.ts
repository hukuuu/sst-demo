import { Deposit } from "@sstdemo/core/Types"
import AWS from 'aws-sdk'
import { KinesisStream } from 'sst/node/kinesis-stream'

const players = ['alice', 'bob', 'carol', 'david']
const amounts = [25, 50, 100, 200, 500, 100]

const pick = <T>(arr: T[]): T => {
  return arr[Math.floor(Math.random() * arr.length)]
}

const stream = new AWS.Kinesis()

export async function handler() {
  const deposit: Deposit = { player: pick(players), amount: pick(amounts) }
  await stream
    .putRecord({
      Data: JSON.stringify(deposit),
      PartitionKey: 'deposits',
      StreamName: KinesisStream.Stream.streamName
    })
    .promise()

  console.log('Deposit made: ', deposit)
  return {
    statusCode: 200,
    body: JSON.stringify({ status: 'successful' })
  }
}
