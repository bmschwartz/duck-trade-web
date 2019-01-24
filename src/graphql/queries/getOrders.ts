import gql from 'graphql-tag'

export default gql`
  {
    orders {
      id
      quantity
      price
      side
      currency {
        id
        name
      }
    }
  }
`