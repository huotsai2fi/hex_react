import request from './request.js';
import PropTypes from 'prop-types';
import { useForm } from 'react-hook-form';

const { VITE_API_PATH } = import.meta.env;

function Cart({ id, cartData, setCartData, onOrderSubmit }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      email: '',
      name: '',
      tel: '',
      address: '',
      message: '',
    },
  });

  const deleteCarts = async () => {
    try {
      await request.delete(`/api/${VITE_API_PATH}/carts`);
      setCartData(null);
    } catch (error) {
      console.error('Error deleting cart:', error);
    }
  };

  const onSubmit = async (formData) => {
    const { message, ...user } = formData;
    const data = {
      data: {
        user,
        message,
      },
    };
    try {
      const response = await request.post(`/api/${VITE_API_PATH}/order`, data);
      if (response.data.success) {
        alert('訂單成立');
        onOrderSubmit();
        reset();
      } else {
        alert('訂單成立失敗');
      }
    } catch (error) {
      console.error('Error submitting order:', error);
    }
  };

  return (
    <div
      className="offcanvas offcanvas-end"
      tabIndex="-1"
      id={id}
      aria-labelledby="offcanvasRightLabel"
    >
      <div className="offcanvas-header">
        <h5 id="offcanvasRightLabel">購物車</h5>
        <button
          type="button"
          className="btn-close text-reset"
          data-bs-dismiss="offcanvas"
          aria-label="Close"
        ></button>
      </div>
      <div className="offcanvas-body">
        <div className="mt-4">
          {cartData?.carts.lengh > 0 && (
            <div className="text-end">
              <button
                className="btn btn-outline-danger"
                type="button"
                onClick={deleteCarts}
              >
                清空購物車
              </button>
            </div>
          )}
          <table className="table align-middle">
            <thead>
              <tr>
                <th></th>
                <th>品名</th>
                <th style={{ width: '150px' }}>數量/單位</th>
                <th>單價</th>
              </tr>
            </thead>
            <tbody>
              {cartData?.carts.length > 0 ? (
                cartData.carts.map((item) => (
                  <tr key={item.id}>
                    <td style={{ width: '200px' }}>
                      <div
                        style={{
                          height: '100px',
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                          backgroundImage: `url(${item.product.imageUrl})`,
                        }}
                      ></div>
                    </td>
                    <td>{item.product.content}</td>
                    <td className="text-end">{item.qty}</td>
                    <td className="text-end">
                      <del className="h6">{item.product.origin_price}</del>
                      <div className="h5">{item.product.price}</div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center">
                    購物車內沒有商品
                  </td>
                </tr>
              )}
            </tbody>
            {cartData?.carts.length > 0 && (
              <tfoot>
                <tr>
                  <td colSpan="3" className="text-end">
                    總計
                  </td>
                  <td className="text-end">{cartData.total}</td>
                </tr>
                <tr>
                  <td colSpan="3" className="text-end text-success">
                    折扣價
                  </td>
                  <td className="text-end text-success">
                    {cartData.final_total}
                  </td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>
        {cartData?.carts.length > 0 && (
          <div className="my-5">
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="mb-3">
                <label htmlFor="name" className="form-label">
                  收件人姓名
                </label>
                <input
                  id="name"
                  name="姓名"
                  type="text"
                  className="form-control"
                  placeholder="請輸入姓名"
                  {...register('name', {
                    required: '姓名必填',
                  })}
                />
                <span className="text-danger">
                  {errors.name ? errors.name.message : ''}
                </span>
              </div>
              <div className="mb-3">
                <label htmlFor="email" className="form-label">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  className="form-control"
                  placeholder="請輸入 Email"
                  {...register('email', {
                    required: 'Email必填',
                    pattern: {
                      value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                      message: '請輸入有效的Email',
                    },
                  })}
                />
                <span className="text-danger">
                  {errors.email ? errors.email.message : ''}
                </span>
              </div>
              <div className="mb-3">
                <label htmlFor="tel" className="form-label">
                  收件人電話
                </label>
                <input
                  id="tel"
                  name="電話"
                  type="tel"
                  className="form-control"
                  placeholder="請輸入電話"
                  {...register('tel', {
                    required: '電話必填',
                    minLength: {
                      value: 8,
                      message: '電話至少8碼',
                    },
                  })}
                />
                <span className="text-danger">
                  {errors.tel ? errors.tel.message : ''}
                </span>
              </div>

              <div className="mb-3">
                <label htmlFor="address" className="form-label">
                  收件人地址
                </label>
                <input
                  id="address"
                  name="地址"
                  type="text"
                  className="form-control"
                  placeholder="請輸入地址"
                  {...register('address', {
                    required: '地址必填',
                  })}
                />
                <span className="text-danger">
                  {errors.address ? errors.address.message : ''}
                </span>
              </div>

              <div className="mb-3">
                <label htmlFor="message" className="form-label">
                  留言
                </label>
                <textarea
                  id="message"
                  className="form-control"
                  cols="30"
                  rows="10"
                  placeholder="請輸入留言"
                  {...register('message')}
                ></textarea>
              </div>
              <div className="text-end">
                <button type="submit" className="btn btn-danger">
                  送出訂單
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

Cart.propTypes = {
  id: PropTypes.string.isRequired,
  cartData: PropTypes.shape({
    carts: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        product: PropTypes.shape({
          imageUrl: PropTypes.string.isRequired,
          content: PropTypes.string.isRequired,
          origin_price: PropTypes.number.isRequired,
          price: PropTypes.number.isRequired,
        }).isRequired,
        qty: PropTypes.number.isRequired,
      })
    ),
    total: PropTypes.number,
    final_total: PropTypes.number,
  }),
  setCartData: PropTypes.func.isRequired,
  onOrderSubmit: PropTypes.func.isRequired,
};

export default Cart;
