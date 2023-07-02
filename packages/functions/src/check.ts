import { APIGatewayProxyEvent } from 'aws-lambda'
import AWS from 'aws-sdk'
import { Table } from 'sst/node/table'

const dynamoDb = new AWS.DynamoDB.DocumentClient()

export const handler = async (event: APIGatewayProxyEvent) => {
  if (!event.pathParameters) return { statusCode: 404 }

  const player = event.pathParameters['player']

  const totalDeposit = await dynamoDb
    .get({
      TableName: Table.deposits.tableName,
      Key: {
        player: player
      }
    })
    .promise()

  if (!totalDeposit.Item) return { statusCode: 404 }

  return {
    statusCode: 200,
    body: totalDeposit.Item
  }
}
