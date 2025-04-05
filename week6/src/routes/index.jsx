import App from '../App.jsx';
import Products from '../pages/Products.jsx';
import Product from '../pages/Product.jsx';
import Cart from '../pages/Cart.jsx';
import Home from '../pages/Home.jsx';

const routes = [
  {
    path: '/',
    element: <App />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: 'products',
        element: <Products />,
        children: [{ path: ':productId', element: <Product /> }],
      },
      {
        path: 'cart',
        element: <Cart />,
      },
      {
        path: 'product/:productId',
        element: <Product />,
      },
    ],
  },
  {
    path: '*',
    element: <div>404 Not Found</div>,
  },
];

export default routes;
