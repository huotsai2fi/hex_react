import React, { useState } from 'react';
import PropTypes from 'prop-types';

const ProductModal = ({
  id,
  modalType,
  currentProduct,
  setCurrentProduct,
  onConfirm,
}) => {
  const [newImageUrl, setNewImageUrl] = useState('');

  const handleModalInputChange = (e) => {
    const { id, value, type, checked } = e.target;
    const newValue =
      type === 'checkbox' ? checked : type === 'number' ? Number(value) : value;
    setCurrentProduct({
      ...currentProduct,
      [id]: newValue,
    });
  };

  const handleNewImageClick = () => {
    if (newImageUrl === '') return;
    if (!currentProduct.imagesUrl) {
      setCurrentProduct({
        ...currentProduct,
        imagesUrl: [newImageUrl],
      });
    } else {
      setCurrentProduct({
        ...currentProduct,
        imagesUrl: [...currentProduct.imagesUrl, newImageUrl],
      });
    }
    setNewImageUrl('');
  };

  const handleDeleteImageClick = (index) => {
    setCurrentProduct({
      ...currentProduct,
      imagesUrl: currentProduct.imagesUrl.filter((_, i) => i !== index),
    });
  };

  return (
    <div
      id={id}
      className="modal fade"
      tabIndex="-1"
      aria-labelledby="productModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-xl">
        <div className="modal-content border-0">
          <div className="modal-header bg-dark text-white">
            <h5 id="productModalLabel" className="modal-title">
              <span>{modalType.title}</span>
            </h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body">
            <div className="row">
              <div className="col-sm-4">
                <div className="mb-2">
                  <div className="mb-3">
                    <label htmlFor="imageUrl" className="form-label">
                      主圖片網址
                    </label>
                    <input
                      id="imageUrl"
                      value={currentProduct.imageUrl}
                      type="text"
                      className="form-control"
                      placeholder="請輸入圖片連結"
                      onChange={handleModalInputChange}
                    />
                  </div>
                  {currentProduct.imageUrl.length > 0 && (
                    <img
                      className="img-fluid"
                      src={currentProduct.imageUrl}
                      alt="image"
                    />
                  )}
                </div>
              </div>
              <div className="col-sm-8">
                <div className="mb-3">
                  <label htmlFor="title" className="form-label">
                    標題
                  </label>
                  <input
                    id="title"
                    value={currentProduct.title}
                    type="text"
                    className="form-control"
                    placeholder="請輸入標題"
                    onChange={handleModalInputChange}
                  />
                </div>

                <div className="row">
                  <div className="mb-3 col-md-6">
                    <label htmlFor="category" className="form-label">
                      分類
                    </label>
                    <input
                      id="category"
                      value={currentProduct.category}
                      type="text"
                      className="form-control"
                      placeholder="請輸入分類"
                      onChange={handleModalInputChange}
                    />
                  </div>
                  <div className="mb-3 col-md-6">
                    <label htmlFor="unit" className="form-label">
                      單位
                    </label>
                    <input
                      id="unit"
                      value={currentProduct.unit}
                      type="text"
                      className="form-control"
                      placeholder="請輸入單位"
                      onChange={handleModalInputChange}
                    />
                  </div>
                </div>

                <div className="row">
                  <div className="mb-3 col-md-6">
                    <label htmlFor="origin_price" className="form-label">
                      原價
                    </label>
                    <input
                      id="origin_price"
                      value={currentProduct.origin_price}
                      type="number"
                      min="0"
                      className="form-control"
                      placeholder="請輸入原價"
                      onChange={handleModalInputChange}
                    />
                  </div>
                  <div className="mb-3 col-md-6">
                    <label htmlFor="price" className="form-label">
                      售價
                    </label>
                    <input
                      id="price"
                      value={currentProduct.price}
                      type="number"
                      min="0"
                      className="form-control"
                      placeholder="請輸入售價"
                      onChange={handleModalInputChange}
                    />
                  </div>
                </div>
                <hr />
                <div className="mb-3">
                  <label htmlFor="description" className="form-label">
                    產品描述
                  </label>
                  <textarea
                    id="description"
                    value={currentProduct.description}
                    className="form-control"
                    placeholder="請輸入產品描述"
                    onChange={handleModalInputChange}
                  ></textarea>
                </div>
                <div className="mb-3">
                  <label htmlFor="content" className="form-label">
                    說明內容
                  </label>
                  <textarea
                    id="content"
                    value={currentProduct.content}
                    className="form-control"
                    placeholder="請輸入說明內容"
                    onChange={handleModalInputChange}
                  ></textarea>
                </div>
                <div className="mb-3">
                  <div className="form-check">
                    <input
                      id="is_enabled"
                      checked={currentProduct.is_enabled}
                      className="form-check-input"
                      type="checkbox"
                      onChange={handleModalInputChange}
                    />
                    <label className="form-check-label" htmlFor="is_enabled">
                      是否啟用
                    </label>
                  </div>
                </div>
              </div>
            </div>
            <hr />
            <div className="mb-3">其他圖片</div>
            <div className="mb-3">
              <input
                id="newImageUrl"
                value={newImageUrl}
                type="text"
                className="form-control"
                placeholder="請輸入圖片連結"
                onChange={(e) => setNewImageUrl(e.target.value)}
              />
              <button
                className="btn btn-outline-primary btn-sm mt-2 w-100"
                onClick={handleNewImageClick}
              >
                新增圖片
              </button>
            </div>
            {currentProduct.imagesUrl?.length > 0 && (
              <div className="row">
                {currentProduct.imagesUrl.map((url, index) => (
                  <div key={index} className="col-6">
                    <img src={url} alt="image" height={100} />
                    <button
                      className="btn btn-outline-danger btn-sm my-2 w-100"
                      onClick={() => handleDeleteImageClick(index)}
                    >
                      刪除圖片
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-outline-secondary"
              data-bs-dismiss="modal"
            >
              取消
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => onConfirm(currentProduct)}
            >
              確認
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

ProductModal.displayName = 'ProductModal';

ProductModal.propTypes = {
  id: PropTypes.string.isRequired,
  modalType: PropTypes.shape({
    title: PropTypes.string.isRequired,
    onConfirm: PropTypes.func.isRequired,
  }).isRequired,
  currentProduct: PropTypes.shape({
    imageUrl: PropTypes.string,
    title: PropTypes.string,
    category: PropTypes.string,
    unit: PropTypes.string,
    origin_price: PropTypes.number,
    price: PropTypes.number,
    description: PropTypes.string,
    content: PropTypes.string,
    is_enabled: PropTypes.bool,
    imagesUrl: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
  setCurrentProduct: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
};

export default ProductModal;
