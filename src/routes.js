import React from 'react';


const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'));
const Login = React.lazy(() => import('./views/pages/login/Login'));
const Buy = React.lazy(() => import('./views/Buy'));
const Sell = React.lazy(() => import('./views/Sell'));
const Payables = React.lazy(() => import('./views/Payables'));
const Receivables = React.lazy(() => import('./views/Receivables'));
const Customers = React.lazy(() => import('./views/Customers'));
const FactorDetails =  React.lazy(() => import('./views/FactorDetails'));
const CustomerDetails = React.lazy(() => import('./views/CustomerDetails'));
const Stock = React.lazy(() => import('./views/Stock'));
const BuyFactors = React.lazy(() => import('./views/BuyFactors'));
const SellFactors = React.lazy(() => import('./views/SellFactors'));
const Users =  React.lazy(() => import('./views/Users'));
const UpdateUserAccess = React.lazy(() => import('./views/UpdateUserAccess'));
const CreateTransaction = React.lazy(() => import('./views/CreateTransaction'));
const Transactions =  React.lazy(() => import('./views/Transactions'));
const CreateShop = React.lazy(() => import('./views/CreateShop'));
const UpdatePayable = React.lazy(() => import('./views/UpdatePayable'));
const UpdateReceivable = React.lazy(() => import('./views/UpdateReceivable'));


const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/dashboard', name: 'Dashboard', component: Dashboard },
  { path: '/login', name: 'Login', component: Login },
  { path: '/buy', name: 'Theme', component: Buy, exact: true },
  { path: '/sell', name: 'Theme', component: Sell, exact: true },
  { path: '/payables', name: 'Typography', component: Payables, exact:true},
  { path: '/receivables', name: 'Typography', component: Receivables, exact:true},
  { path: '/factors/:factorID/:shopID', exact: true, name: 'User Details', component: FactorDetails },
  { path: '/customers', exact: true,  name: 'Users', component: Customers },
  { path: '/customers/:id', exact: true, name: 'User Details', component: CustomerDetails },
  { path: '/stock', exact: true, name: 'User Details', component: Stock },
  { path: '/buy-factors', name: 'Carousel', component: BuyFactors },
  { path: '/sell-factors', name: 'Carousel', component: SellFactors },
  { path: '/users', name: 'Carousel', component: Users },
  { path: '/create-user', name: 'Carousel', component: UpdateUserAccess },
  { path: '/create-tx', name: 'Carousel', component: CreateTransaction },
  { path: '/transactions', name: 'Carousel', component: Transactions },
  { path: '/create-shop', name: 'Carousel', component: CreateShop },
  { path: '/update-payable/:id',exact: true, name: 'Carousel', component: UpdatePayable },
  { path: '/update-receivable/:id',exact: true, name: 'Carousel', component: UpdateReceivable },
];

export default routes;
