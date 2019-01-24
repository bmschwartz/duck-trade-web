import { InMemoryCache, NormalizedCacheObject } from 'apollo-cache-inmemory'
import { ApolloClient } from 'apollo-client'
import { ApolloLink, split } from 'apollo-link'
import { onError } from 'apollo-link-error'
import { createHttpLink } from 'apollo-link-http'
import { WebSocketLink } from 'apollo-link-ws'
import { getMainDefinition } from 'apollo-utilities'
import { SubscriptionClient } from 'subscriptions-transport-ws'

import createState from './state'

// ----------------------------------------------------------------------------

export function createClient(): ApolloClient<NormalizedCacheObject> {

  const cache = new InMemoryCache()

  const httpLink = createHttpLink({
    credentials: 'include',
    uri: 'http://localhost:4000',
  })

  cache.restore((window as any).__APOLLO_STATE__)

  return new ApolloClient({
    cache,
    link: ApolloLink.from([

      onError(({ graphQLErrors, networkError }) => {
        if (graphQLErrors) {
          graphQLErrors.map(({ message, locations, path }) =>
            console.log(
              `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
            )
          )
        }
        if (networkError) {
          console.log(`[Network error]: ${networkError}`)
        }
      }),

      createState(cache),

      process.env.WS_SUBSCRIPTIONS ? split(
        ({ query }) => {
          const definition = getMainDefinition(query)
          return definition.kind === 'OperationDefinition' && definition.operation === 'subscription'
        },
        new WebSocketLink(
          new SubscriptionClient('http://localhost:4000'!.replace(/^https?/, 'ws'), {
            reconnect: true,
          })
        ),
        httpLink
      ) : httpLink,
    ]),
  })
}
