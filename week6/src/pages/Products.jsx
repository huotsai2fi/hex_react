import { useState, useEffect, useRef } from 'react';
import request from '../request.js';
import { NavLink } from 'react-router';

const { VITE_API_PATH } = import.meta.env;

function Products() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddingProduct, setIsAddingProduct] = useState(false);

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

  return (
    <div id="app">
      <div className="container-fluid my-4">
        {isLoading ? (
          <div>Loading...</div>
        ) : (
          <div className="mt-4">
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
                      <NavLink
                        to={`/product/${product.id}`}
                        state={{ message: 'Hello' }}
                      >
                        <button
                          type="button"
                          className="btn btn-outline-primary"
                        >
                          詳細資訊
                        </button>
                      </NavLink>
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

export default Products;
