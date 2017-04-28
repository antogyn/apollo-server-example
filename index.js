import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { createServer } from 'http';
import { graphqlExpress, graphiqlExpress } from 'graphql-server-express';

// Subs
import { SubscriptionServer } from 'subscriptions-transport-ws';
import { subscriptionManager } from './subscriptions';

import OpticsAgent from 'optics-agent';

import schema from './schema';
import logger from './winston';

const PORT = 3020;
const SUBSCRIPTIONS_PATH = '/subscriptions';

OpticsAgent.instrumentSchema(schema);

var app = express();

app.use(cors());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/graphql', OpticsAgent.middleware());

app.use('/graphql', graphqlExpress((req) => {

  logger.info({message:'there was a request'});

  return {
    schema,
    context: {
      opticsContext: OpticsAgent.context(req),
    }
  };
}));

app.use('/graphiql', graphiqlExpress({
  endpointURL: '/graphql',
}));

const server = createServer(app)

server.listen(PORT, () => {
  console.log(`API Server is now running on http://localhost:${PORT}/graphql`)
  console.log(`API Subscriptions server is now running on ws://localhost:${PORT}${SUBSCRIPTIONS_PATH}`)
});

// Subs
new SubscriptionServer(
  {
    subscriptionManager,
  },
  {
    path: SUBSCRIPTIONS_PATH,
    server,
  }
);
