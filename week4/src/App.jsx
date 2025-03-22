import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Modal } from 'bootstrap'; // 這裡也要引入
import ProductModal from './ProductModal';

const { VITE_API_URL, VITE_API_PATH } = import.meta.env;
const request = axios.create({
  baseURL: VITE_API_URL,
});

function App() {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [loginErrorMessage, setLoginErrorMessage] = useState(null);
  const [isAuth, setIsAuth] = useState(false);
  const [products, setProducts] = useState(null);
  const productModalRef = useRef(null);
  const newProduct = async (data) => {
    data = {
      ...data,
      is_enabled: data.is_enabled ? 1 : 0,
    };
    try {
      await request.post(`/api/${VITE_API_PATH}/admin/product`, { data });
    } catch (error) {
      throw error;
    }
  };
  const updateProduct = async (data) => {
    const { id, ...restData } = data;
    try {
      await request.put(`/api/${VITE_API_PATH}/admin/product/${id}`, {
        data: restData,
      });
    } catch (error) {
      throw error;
    }
  };
  const ModalType = {
    NEW: {
      title: '新增產品',
      onConfirm: (data) => newProduct(data),
    },
    UPDATE: {
      title: '編輯產品',
      onConfirm: (data) => updateProduct(data),
    },
  };
  const [modalType, setModalType] = useState(ModalType.NEW);
  const initialProduct = {
    title: '',
    imageUrl: '',
    imagesUrl: [],
    category: '',
    unit: '',
    origin_price: 0,
    price: 0,
    description: '',
    content: '',
    is_enabled: false,
  };
  const [currentProduct, setCurrentProduct] = useState(initialProduct);
  // const [newImageUrl, setNewImageUrl] = useState('');
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [isProductLoading, setIsProductLoading] = useState(true);

  // Check if the user is authenticated already
  useEffect(() => {
    const token = document.cookie.replace(
      /(?:(?:^|.*;\s*)hexToken\s*=\s*([^;]*).*$)|^.*$/,
      '$1'
    );
    if (token) {
      request.defaults.headers.common['Authorization'] = token;
      checkAdmin();
    } else {
      setIsPageLoading(false);
    }
  }, []);

  // Get products when the user is authenticated
  useEffect(() => {
    if (isAuth) {
      getProducts();
      const modalElement = document.getElementById('productModal');
      productModalRef.current = new Modal(modalElement, {
        keyboard: false, // disable keyboard esc close
      });

      modalElement.addEventListener('hidden.bs.modal', () => {
        setCurrentProduct(initialProduct);
      });
    }

    return () => {
      if (productModalRef.current) {
        productModalRef.current.hide();
      }
      const modalElement = document.getElementById('productModal');
      modalElement.removeEventListener('hidden.bs.modal', () => {
        setCurrentProduct(initialProduct);
      });
    };
  }, [isAuth]);

  const checkAdmin = async () => {
    try {
      await request.post(`/api/user/check`);
      setIsAuth(true);
    } catch (error) {
      setIsAuth(false);
      console.error(error);
    } finally {
      setIsPageLoading(false);
    }
  };

  const getProducts = async () => {
    setIsProductLoading(true);
    try {
      const response = await request.get(
        `/api/${VITE_API_PATH}/admin/products`
      );
      const { products } = response.data;
      setProducts(products);
      setIsProductLoading(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    const { username, password } = formData;
    try {
      const response = await request.post(`/admin/signin`, {
        username,
        password,
      });
      const { token, expired } = response.data;
      document.cookie = `hexToken=${token}; expires=${new Date(expired)};`;
      request.defaults.headers.common['Authorization'] = token;
      setIsAuth(true);
    } catch (error) {
      const { message } = error.response.data;
      setLoginErrorMessage(message);
    }
  };

  const handleLoginInputChange = (e) => {
    setLoginErrorMessage(null);
    const { id, value } = e.target;
    setFormData({
      ...formData,
      [id]: value,
    });
  };

  const deleteProduct = async (id) => {
    try {
      await request.delete(`/api/${VITE_API_PATH}/admin/product/${id}`);
      getProducts();
    } catch (error) {
      console.error(error);
    }
  };

  const handleNewProductClick = () => {
    setModalType(ModalType.NEW);
    productModalRef.current.show();
  };

  const handleUpdateProductClick = (item) => {
    setModalType(ModalType.UPDATE);
    setCurrentProduct(item);
    productModalRef.current.show();
  };

  const handleDeleteProductClick = (item) => {
    const { id, title } = item;
    if (!confirm(`確認刪除 ${title} ?`)) return;
    deleteProduct(id);
  };

  const handleConfirmClick = async (data) => {
    try {
      await modalType.onConfirm(data);
      getProducts();
      productModalRef.current.hide();
    } catch (error) {
      alert(error.response.data.message);
    }
  };

  return (
    <>
      {isPageLoading ? (
        'Loading...'
      ) : isAuth ? (
        <div>
          <div className="container">
            <div className="text-end mt-4">
              <button
                className="btn btn-primary"
                onClick={handleNewProductClick}
              >
                建立新的產品
              </button>
            </div>
            <table className="table mt-4">
              <thead>
                <tr>
                  <th width="120">分類</th>
                  <th>產品名稱</th>
                  <th width="120">原價</th>
                  <th width="120">售價</th>
                  <th width="100">是否啟用</th>
                  <th width="120">編輯</th>
                </tr>
              </thead>
              <tbody>
                {isProductLoading ? (
                  <tr>
                    <td colSpan="6">商品載入中...</td>
                  </tr>
                ) : products.length > 0 ? (
                  products.map((item) => (
                    <tr key={item.id}>
                      <td>{item.category}</td>
                      <td>{item.title}</td>
                      <td className="text-end">{item.origin_price}</td>
                      <td className="text-end">{item.price}</td>
                      <td>
                        {item.is_enabled ? (
                          <span className="text-success">啟用</span>
                        ) : (
                          <span className="text-gray">未啟用</span>
                        )}
                      </td>
                      <td>
                        <div className="btn-group">
                          <button
                            type="button"
                            className="btn btn-outline-primary btn-sm"
                            onClick={() => handleUpdateProductClick(item)}
                          >
                            編輯
                          </button>
                          <button
                            type="button"
                            className="btn btn-outline-danger btn-sm"
                            onClick={() => handleDeleteProductClick(item)}
                          >
                            刪除
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6">尚無產品資料</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="container login">
          <div className="row justify-content-center">
            <h1 className="h3 mb-3 font-weight-normal">請先登入</h1>
            <div className="col-8">
              <form
                id="form"
                className="form-signin"
                onSubmit={handleLoginSubmit}
              >
                <div className="form-floating mb-3">
                  <input
                    type="email"
                    className="form-control"
                    id="username"
                    placeholder="name@example.com"
                    value={formData.username}
                    onChange={handleLoginInputChange}
                    required
                    autoFocus
                  />
                  <label htmlFor="username">Email address</label>
                </div>
                <div className="form-floating">
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleLoginInputChange}
                    required
                  />
                  <label htmlFor="password">Password</label>
                </div>
                {loginErrorMessage && (
                  <div className="text-danger">{loginErrorMessage}</div>
                )}
                <button
                  className="btn btn-lg btn-primary w-100 mt-3"
                  type="submit"
                >
                  登入
                </button>
              </form>
            </div>
          </div>
          <p className="mt-5 mb-3 text-muted">&copy; 2024~∞ - 六角學院</p>
        </div>
      )}
      <ProductModal
        id="productModal"
        modalType={modalType}
        currentProduct={currentProduct}
        setCurrentProduct={setCurrentProduct}
        onConfirm={handleConfirmClick}
      />
    </>
  );
}

export default App;
