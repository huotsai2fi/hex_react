import { useState, useEffect, useRef } from 'react';
import request from './request.js';
import Cart from './Cart.jsx';
import { Offcanvas } from 'bootstrap';

const { VITE_API_PATH } = import.meta.env;

function App() {
  const [products, setProducts] = useState([]);
  const [cartData, setCartData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const cartOffcanvasRef = useRef(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await request.get(
          `/api/${VITE_API_PATH}/products/all`
        );
        setProducts(response.data.products);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();

    const onOffcanvasHidden = () => {
      setCartData(null);
    };

    const offcanvasElement = document.getElementById('cartCanvas');
    cartOffcanvasRef.current = new Offcanvas(offcanvasElement);

    offcanvasElement.addEventListener('hidden.bs.offcanvas', onOffcanvasHidden);

    return () => {
      offcanvasElement.removeEventListener(
        'hidden.bs.offcanvas',
        onOffcanvasHidden
      );
      cartOffcanvasRef.current.dispose();
    };
  }, []);

  const addToCart = async (productId) => {
    setIsAddingProduct(true);

    const data = {
      data: {
        product_id: productId,
        qty: 1,
      },
    };

    try {
      const response = await request.post(`/api/${VITE_API_PATH}/cart`, data);
    } catch (error) {
      console.error('Error adding to cart:', error);
    } finally {
      setIsAddingProduct(false);
    }
  };

  const getCart = async () => {
    try {
      const response = await request.get(`/api/${VITE_API_PATH}/cart`);
      setCartData(response.data.data);
      cartOffcanvasRef.current.show();
    } catch (error) {
      console.error('Error fetching cart:', error);
    }
  };

  return (
    <div id="app">
      <div className="container my-4">
        <div className="text-end">
          <button
            className="btn btn-primary"
            type="button"
            disabled={isAddingProduct}
            onClick={getCart}
          >
            查看購物車
          </button>
        </div>
        <Cart
          id="cartCanvas"
          cartData={cartData}
          setCartData={setCartData}
          onOrderSubmit={() => cartOffcanvasRef.current.hide()}
        />
        {isLoading ? (
          <div>Loading...</div>
        ) : (
          <div className="mt-4">
            {/* 產品Modal */}
            <table className="table align-middle">
              <thead>
                <tr>
                  <th>圖片</th>
                  <th>商品名稱</th>
                  <th>價格</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id}>
                    <td style={{ width: '200px' }}>
                      <div
                        style={{
                          height: '100px',
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                          backgroundImage: `url(${product.imageUrl})`,
                        }}
                      ></div>
                    </td>
                    <td>{product.content}</td>
                    <td className="text-end">
                      <del className="h6">{product.origin_price}</del>
                      <div className="h5">{product.price}</div>
                    </td>
                    <td>
                      <button
                        type="button"
                        className="btn btn-outline-danger"
                        onClick={() => {
                          addToCart(product.id);
                        }}
                        disabled={isAddingProduct}
                      >
                        {isAddingProduct && (
                          <span
                            className="spinner-border spinner-border-sm"
                            role="status"
                            aria-hidden="true"
                          ></span>
                        )}
                        加到購物車
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
