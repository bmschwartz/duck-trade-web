export enum OrderSide {
  BUY = 'BUY',
  SELL = 'SELL'
}

export interface IUser {
  me: {
    username: string
  }
}

export interface IOrder {
  id: string
  quantity: number
  price: number
  side: OrderSide
  currency: ICurrency
}

export interface IWallet {
  quantity: number
  currency: {
    name: string
    lastPrice: number
  }
}

export interface ICurrency {
  id: string
  name: string
  lastPrice: number
}