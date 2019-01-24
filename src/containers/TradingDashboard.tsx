import React from 'react'
import { Query } from 'react-apollo'
import { Container, Grid, Header, Divider } from 'semantic-ui-react'

import { IUser, OrderSide } from '../graphql/types'
import getMe from '../graphql/queries/getMe'

import OrderForm from '../components/OrderForm'
import OrderHistory from '../components/OrderHistory'
import Portfolio from '../components/Portfolio'

export default () => (
  <Query<IUser> query={getMe}>
    {({ data }) => (
      <Container>
        <br/>
        <Header as='h2' textAlign='center'>
          Trading Dashboard
          <Header.Subheader>Logged in as: {data!.me ? data!.me.username : '' }</Header.Subheader>
        </Header>
        <Divider />
        <Grid relaxed>
          <Grid.Row>
            <Grid.Column width={3}>
              <Portfolio />
            </Grid.Column>
            <Grid.Column width={5}>
              <OrderForm side={OrderSide.BUY} />
            </Grid.Column>
            <Grid.Column width={5}>
              <OrderForm side={OrderSide.SELL} />
            </Grid.Column>
            <Grid.Column width={3}>
              <OrderHistory />
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Container>
    )}
  </Query>
)