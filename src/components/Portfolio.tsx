import React from 'react'
import { Query } from 'react-apollo'
import { Container } from 'semantic-ui-react'

import { IWallet } from '../graphql/types'
import getWallets from '../graphql/queries/getWallets'


interface IWalletList {
  wallets: IWallet[]
}

export default () => (
  <Query<IWalletList> query={getWallets}>
    {
      ({ loading, data, error }) => {
        let Portfolio

        if (error) Portfolio = <p>{error.message}</p>
        if (loading) Portfolio = <p>Loading Portfolio...</p>

        if (data && data.wallets) {
          const { wallets } = data
          Portfolio = wallets.map(wallet => {
            const { currency: { name }, quantity } = wallet
            return (
              <p key={name}>{`${name}: ${quantity}`} </p>
            )
          })
        }

        return (
          <Container>
            <h3>Portfolio</h3>
            {Portfolio}
          </Container>
        )
      }
    }

  </Query>
)