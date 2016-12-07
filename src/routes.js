import React from 'react'
import ApolloClient, { createNetworkInterface } from 'apollo-client'
import { ApolloProvider } from 'react-apollo'
import { nativeHistory, Route, Router, } from 'react-router-native'
import { Client } from 'subscriptions-transport-ws';
import { addGraphQLSubscriptions } from './util'
import * as x from 'subscriptions-transport-ws';

import ListPage from './components/ListPage'
import CreatePage from './components/CreatePage'

const wsClient = new Client('ws://subscriptions.graph.cool/ciwf2nhji00ky01711z4twwvp');
const networkInterface = createNetworkInterface({
  uri: 'https://api.graph.cool/simple/v1/ciwf2nhji00ky01711z4twwvp',
})

const networkInterfaceWithSubscriptions = addGraphQLSubscriptions(
  networkInterface,
  wsClient,
)

const client = new ApolloClient({
  networkInterface: networkInterfaceWithSubscriptions,
})

export default (
  <ApolloProvider client={client}>
    <Router history={nativeHistory}>
      <Route path="/" component={ListPage} />
      <Route path="/create" component={CreatePage} />
    </Router>
  </ApolloProvider>
)
