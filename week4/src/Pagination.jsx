import { useState } from 'react';
import PropTypes from 'prop-types';

function Pagination({ currentPage, totalPages, onPageChange }) {
  const [page, setPage] = useState(currentPage);

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages) return;
    setPage(newPage);
    onPageChange(newPage);
  };

  return (
    <nav aria-label="Page navigation">
      <ul className="pagination">
        <li className={`page-item ${page === 1 ? 'disabled' : ''}`}>
          <button
            className="page-link"
            onClick={() => handlePageChange(page - 1)}
          >
            Previous
          </button>
        </li>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((i) => (
          <li key={i} className={`page-item ${i === page ? 'active' : ''}`}>
            <button className="page-link" onClick={() => handlePageChange(i)}>
              {i}
            </button>
          </li>
        ))}
        <li className={`page-item ${page === totalPages ? 'disabled' : ''}`}>
          <button
            className="page-link"
            onClick={() => handlePageChange(page + 1)}
          >
            Next
          </button>
        </li>
      </ul>
    </nav>
  );
}

Pagination.propTypes = {
  currentPage: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
};

export default Pagination;
