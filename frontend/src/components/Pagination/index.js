import React from "react";
import "./index.css";

function Pagination({ page, totalPages, onChange }) {
  if (totalPages <= 1) return null;

  const pages = [];
  for (let p = 1; p <= totalPages; p += 1) {
    pages.push(p);
  }

  return (
    <div className="pg-root">
      <button
        type="button"
        className="pg-btn"
        disabled={page === 1}
        onClick={() => onChange(page - 1)}
      >
        Prev
      </button>
      <div className="pg-pages">
        {pages.map((p) => (
          <button
            key={p}
            type="button"
            className={p === page ? "pg-page pg-page-active" : "pg-page"}
            onClick={() => onChange(p)}
          >
            {p}
          </button>
        ))}
      </div>
      <button
        type="button"
        className="pg-btn"
        disabled={page === totalPages}
        onClick={() => onChange(page + 1)}
      >
        Next
      </button>
    </div>
  );
}

export default Pagination;
