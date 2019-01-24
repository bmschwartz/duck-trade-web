import React from 'react'
import { Query, Mutation } from 'react-apollo'
import { Container, Form, Button, Input, Select, Radio } from 'semantic-ui-react'

import { ICurrency, OrderSide } from '../graphql/types'
import getCurrencies from '../graphql/queries/getCurrencies'
import getWallets from '../graphql/queries/getWallets'
import getOrders from '../graphql/queries/getOrders'

import PLACE_ORDER_MUTATION from '../graphql/mutations/placeOrder'

interface ICurrencyList {
  currencies: ICurrency[]
}

interface IOrderFormProps {
  side: OrderSide
}

interface IOrderFormState {
  quantity: number
  selectedCurrency: { name: string, price: number }
}

interface ICurrencySelectOption {
  key: string
  text: string
  value: string
}

export default class OrderForm extends React.Component<IOrderFormProps, IOrderFormState> {
  
  private currencies: { [index: string]: {price?: number} } = {}
  private initialState: IOrderFormState = {
    quantity: 0,
    selectedCurrency: { name: '', price: 0 }
  }

  public state: IOrderFormState = this.initialState
  
  private handleQuantityChanged = (e: any, { value }: {value: string}) => this.setState({ quantity: Math.max(0, Number.parseFloat(value)) })

  private handleCurrencyChanged = (e: any, { value }: {value: string}) => {
    const price = this.currencies[value].price || 0
    const selected = { name: value, price }
    this.setState({ selectedCurrency: selected })
  }

  render() {
    return (
      <Mutation mutation={PLACE_ORDER_MUTATION} refetchQueries={[{ query: getWallets }, { query: getOrders }]}>
        {(placeOrder, { loading: placeOrderLoading, error: placeOrderError }) => {
          return (
            <Container>
              <h3>Order Form {this.props.side}</h3>
              <Query<ICurrencyList> query={getCurrencies}>
                {({ data: currencyData, loading: currencyLoading, error: currencyError }) => {
                  if (currencyError) return <p>Error loading currency data... ${currencyError.message}</p>
                  if (currencyLoading) return <p>Loading currency data...</p>

                  // TODO: Filter the currency options based on portfolio.
                  // eg. If only USD in portfolio, BTC should be the only option for BUY
                  const currencyOptions: ICurrencySelectOption[] = currencyData!.currencies
                    .filter(currency => currency.name !== 'USD')
                    .map(currency => {
                      this.currencies[currency.name] = {price: currency.lastPrice}
                      return { key: currency.name, text: currency.name, value: currency.name }
                    })
                  
                  const purchasingWithCurrency = this.state.selectedCurrency.name === 'BTC' ? 'USD' : 'BTC'
                  const CurrentPriceLabel = <p>Current Price: {this.state.selectedCurrency.price} {purchasingWithCurrency}</p>

                  const CurrencySelectDropdown = <Form.Field 
                    required
                    value={this.state.selectedCurrency.name}
                    disabled={placeOrderLoading}
                    control={Select}
                    onChange={this.handleCurrencyChanged}
                    options={currencyOptions}
                    label={{ children: 'Currency', htmlFor: 'form-select-control-currency' }}
                    placeholder='Select Currency'
                    search
                    searchInput={{ id: 'form-select-control-currency' }}
                  />

                  const QuantityField = (
                    <span>
                      Quantity:
                      <Input
                        required
                        disabled={placeOrderLoading}
                        value={this.state.quantity}
                        onChange={this.handleQuantityChanged}
                        type='number'
                        placeholder='Quantity'
                      >
                        <input />
                      </Input>
                    </span>
                  )

                  const OrderTypeField = (
                    <Form.Group inline>
                      <label>Order Type</label>
                      <Form.Field
                        control={Radio}
                        label='Market'
                        value='Market'
                        checked={true}
                      />
                      <Form.Field
                        disabled
                        control={Radio}
                        label='Limit'
                        value='Limit'
                      />
                    </Form.Group>
                  )

                  const OrderValueLabel = (
                    <p>Order Value: {this.state.selectedCurrency.price * this.state.quantity} {purchasingWithCurrency}</p>
                  )
                  
                  const PlaceOrderButton = (
                    <Button
                      content='Place Order'
                      disabled={placeOrderLoading}
                      loading={placeOrderLoading}
                      onClick={async () => {
                        try {
                          const { quantity, selectedCurrency: { name: currencyName }} = this.state
                          if (!quantity || currencyName === '') return

                          // TODO: Check to see if the portfolio size allows for an order of this size.

                          const { side } = this.props
                          this.setState(this.initialState)
                          await placeOrder({ variables: { quantity, currencyName, side } })
                        } catch (e) {
                          // do nothing.. gets handled elsewhere
                        }
                      }}
                    />
                  )

                  const OrderError = !!placeOrderError ? <p>Order Error: {placeOrderError.message.replace('GraphQL error: ', '')}</p> : ''
                  return (
                    <>
                      {OrderError}
                      <Form>
                        {CurrencySelectDropdown}
                        {CurrentPriceLabel}
                        {QuantityField}
                        {OrderTypeField}
                        {OrderValueLabel}
                        {PlaceOrderButton}
                      </Form>
                    </>
                  )
                }}
              </Query>
            </Container>
          )
        }}
      </Mutation>
    )
  }

}