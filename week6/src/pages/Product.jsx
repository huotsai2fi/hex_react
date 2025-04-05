import React from 'react';
import { useParams, useLocation } from 'react-router';

const Product = () => {
  const { productId } = useParams();

  const location = useLocation();
  const message = location.state?.message;

  return (
    <div>
      <h1>Product</h1>
      <div>{productId}</div>
      <div>{message}</div>
    </div>
  );
};

export default Product;
