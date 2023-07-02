import { Deposit } from '@sstdemo/core/Types'
import { KinesisStreamEvent } from 'aws-lambda'
import AWS from 'aws-sdk'
import { Table } from 'sst/node/table'

const dynamoDb = new AWS.DynamoDB.DocumentClient()

export async function handler(event: KinesisStreamEvent) {
  for (const record of event.Records) {
    const deposit = JSON.parse(atob(record.kinesis.data)) as Deposit
    console.log('process', deposit)

    const oldDeposit = await dynamoDb
      .get({
        TableName: Table.deposits.tableName,
        Key: {
          player: deposit.player
        }
      })
      .promise()

    const oldTotal = oldDeposit.Item ? oldDeposit.Item['amount'] : 0
    deposit.amount += oldTotal

    await dynamoDb
      .put({
        TableName: Table.deposits.tableName,
        Item: deposit
      })
      .promise()
  }

  return {}
}
