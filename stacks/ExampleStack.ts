import { StackContext, Api, KinesisStream, Table } from 'sst/constructs'

export function ExampleStack({ stack }: StackContext) {

  const table = new Table(stack, 'deposits', {
    fields: {
      player: 'string',
      deposit: 'number'
    },
    primaryIndex: { partitionKey: 'player' }
  })

  const stream = new KinesisStream(stack, 'Stream', {
    defaults: {
      function: {
        bind: [table]
      }
    },
    consumers: {
      aggragator: 'packages/functions/src/aggregate.handler'
    }
  })

  const api = new Api(stack, 'Api', {
    defaults: {
      function: {
        bind: [stream, table]
      }
    },
    routes: {
      'POST /': 'packages/functions/src/produce-deposit.handler',
      'GET /check/{player}': 'packages/functions/src/check.handler'
    }
  })

  stack.addOutputs({
    ApiEndpoint: api.url
  })
}
