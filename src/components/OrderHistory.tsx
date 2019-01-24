import React from 'react'
import { Query } from 'react-apollo'
import { Container, List, Divider } from 'semantic-ui-react'

import { IOrder } from '../graphql/types'
import getOrders from '../graphql/queries/getOrders'

interface IOrderList {
  orders: IOrder[]
}

export default () => (
  <Query<IOrderList> query={getOrders}>
    {({data, loading, error}) => {
      return (
        <Container>
          <h3>Order History</h3>
          {error && <p>Error loading orders!</p>}
          {loading && <p>Loading orders...</p>}
          <List relaxed>
            {data!.orders && data!.orders.map(order => {
              const { currency: { name: currencyName }, quantity, price, side: orderSide } = order
              const priceSuffix = currencyName === 'BTC' ? 'USD' : 'BTC'
              const description = `${orderSide} ${quantity} ${currencyName} @ ${price} ${priceSuffix}`
              return <List.Item key={order.id}>{description}</List.Item>
            })}
          </List>
        </Container>
      )
    }}
  </Query>
)