// Get the user data
import gql from 'graphql-tag';

export default gql`
  {
    me {
      username
    }
  }
`;
