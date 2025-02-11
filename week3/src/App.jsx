import React, { useState, useEffect } from 'react'
import axios from 'axios'

const { VITE_API_URL, VITE_API_PATH } = import.meta.env
const request = axios.create({
  baseURL: VITE_API_URL,
})


function App() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [loginErrorMessage, setLoginErrorMessage] = useState(null);
  const [isAuth, setIsAuth] = useState(false);
  const [products, setProducts] = useState(null);
  const [tempProduct, setTempProduct] = useState(null);

  // Check if the user is authenticated already
  useEffect(() => {
    const token = document.cookie.replace(
      /(?:(?:^|.*;\s*)hexToken\s*=\s*([^;]*).*$)|^.*$/,
      "$1"
    );
    if (token) {
      request.defaults.headers.common["Authorization"] = token;
      checkAdmin();
    }
  }, []);

  // Get products when the user is authenticated
  useEffect(() => {
    if (isAuth) {
      getProducts();
    }
  }, [isAuth]);

  const getProducts = async () => {
    try {
      const response = await request.get(`/api/${VITE_API_PATH}/admin/products`);
      const { products } = response.data;
      setProducts(products);
    } catch (error) {
      console.error(error);
    }
  };

  const checkAdmin = async () => {
    try {
      await request.post(`/api/user/check`);
      setIsAuth(true);
    } catch (error) {
      setIsAuth(false);
      console.log(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { username, password } = formData;
    try {
      const response = await request.post(`/admin/signin`, {
        username,
        password,
      });
      const { token, expired } = response.data;
      document.cookie = `hexToken=${token}; expires=${new Date(expired)};`;
      request.defaults.headers.common["Authorization"] = token;
      setIsAuth(true);
    } catch (error) {
      const { message } = error.response.data;
      setLoginErrorMessage(message);
    }
  };

  const handleInputChange = (e) => {
    setLoginErrorMessage(null);
    const { id, value } = e.target;
    setFormData({
      ...formData,
      [id]: value,
    });
  };

  return (
    <>
      {isAuth ? (
        <div>
          <div className="container">
            <div className="text-end mt-4">
              <button className="btn btn-primary">建立新的產品</button>
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
                <tr>
                  <td></td>
                  <td></td>
                  <td className="text-end"></td>
                  <td className="text-end"></td>
                  <td>
                    <span className="text-success">啟用</span>
                    <span>未啟用</span>
                  </td>
                  <td>
                    <div className="btn-group">
                      <button type="button" className="btn btn-outline-primary btn-sm">
                        編輯
                      </button>
                      <button type="button" className="btn btn-outline-danger btn-sm">
                        刪除
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="container login">
          <div className="row justify-content-center">
            <h1 className="h3 mb-3 font-weight-normal">請先登入</h1>
            <div className="col-8">
              <form id="form" className="form-signin" onSubmit={handleSubmit}>
                <div className="form-floating mb-3">
                  <input
                    type="email"
                    className="form-control"
                    id="username"
                    placeholder="name@example.com"
                    value={formData.username}
                    onChange={handleInputChange}
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
                    onChange={handleInputChange}
                    required
                  />
                  <label htmlFor="password">Password</label>
                </div>
                {loginErrorMessage && (
                  <div className="text-danger">
                    {loginErrorMessage}
                  </div>
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
    </>
  );
}

export default App

