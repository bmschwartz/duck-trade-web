import { RouteProps } from 'react-router-dom'

import LoginPage from './containers/LoginPage'
import TradingDashboard from './containers/TradingDashboard'

const routes: RouteProps[] = [
  {
    component: TradingDashboard,
    exact: true,
    path: '/',
  },
  {
    component: LoginPage,
    exact: true,
    path: '/login'
  }
]

export default routes;
