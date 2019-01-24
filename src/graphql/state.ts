// Local GraphQL state
import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloLink } from 'apollo-link';
import { ClientStateConfig, withClientState } from 'apollo-link-state';

export interface IState {
  // stuff
}

// 'Root', which contains the 'State' key
export interface IRoot {
  state: IState;
}

export default function createState(cache: InMemoryCache): ApolloLink {

  function getState(query: any): IState {
    return cache.readQuery<IRoot>({ query })!.state;
  }

  function writeState(state: IState) {
    return cache.writeData({ data: { state } });
  }

  const opt: ClientStateConfig = {
    cache,
    resolvers: {
      Mutation: {
        // mutation methods
      },
    },
  };

  opt.defaults = {
    state: {
      __typename: 'State',
      // state defaults
    },
  } as IRoot;

  return withClientState(opt);
}
