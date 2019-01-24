import gql from 'graphql-tag'

export default gql`
  {
    currencies {
      id
      name
      lastPrice
    }
  }
`