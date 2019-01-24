import gql from 'graphql-tag'

export default gql`
  mutation PlaceOrder($quantity: Float!, $currencyName: String!, $side: OrderSide!) {
    placeOrder(quantity: $quantity, currencyName: $currencyName, side: $side) {
      id
    }
  }
`