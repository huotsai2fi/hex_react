const Cart = () => {
  return (
    <div className="container my-5">
      <div className="row">
        <div className="col-md-8 offset-md-2">
          <h2>購物車</h2>
          <hr />
        </div>
      </div>
      <div className="row">
        <div className="col-md-8 offset-md-2">
          <h4>購物車內容</h4>
          {/* 這裡可以放購物車的內容 */}
        </div>
      </div>
      <div className="row mt-4">
        <div className="col-md-8 offset-md-2">
          <h4>結帳資訊</h4>
          {/* 這裡可以放結帳資訊的表單 */}
        </div>
      </div>
    </div>
  );
};

export default Cart;
