// Get the user data
import gql from 'graphql-tag';

export default gql`
  {
    wallets {
      quantity
      currency {
        name
        lastPrice
      }
    }
  }
`;
