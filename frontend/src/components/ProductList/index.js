import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import client from "../../api/client";
import Pagination from "../Pagination";
import "./index.css";

const categories = [
  { value: "", label: "All categories" },
  { value: "Electronics", label: "Electronics" },
  { value: "Books", label: "Books" },
  { value: "Clothing", label: "Clothing" },
  { value: "Home & Kitchen", label: "Home & Kitchen" },
  { value: "Furniture", label: "Furniture" },
];

function ProductList() {
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, page: 1, limit: 8, totalPages: 1 });
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const fetchProducts = async (page = 1, searchValue = search, categoryValue = category) => {
    try {
      setLoading(true);
      setError("");
      const res = await client.get("/api/products", {
        params: {
          page,
          limit: 8,
          search: searchValue,
          category: categoryValue,
        },
      });
      setProducts(res.data.data);
      setPagination(res.data.pagination);
    } catch (e) {
      setError("Unable to load products.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(1);
  }, []);

  const handleSubmitFilters = (e) => {
    e.preventDefault();
    fetchProducts(1, search.trim(), category);
  };

  const handlePageChange = (page) => {
    fetchProducts(page);
  };

  return (
    <div className="plist-root">
      <div className="plist-header">
        <h1 className="plist-title">Browse products</h1>
        <p className="plist-subtitle">Search, filter by category and send enquiries.</p>
      </div>
      <form className="plist-filters" onSubmit={handleSubmitFilters}>
        <div className="plist-field">
          <label htmlFor="search" className="plist-label">
            Search
          </label>
          <input
            id="search"
            type="text"
            className="plist-input"
            placeholder="Search by name or description"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="plist-field">
          <label htmlFor="category" className="plist-label">
            Category
          </label>
          <select
            id="category"
            className="plist-select"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {categories.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </div>
        <button type="submit" className="plist-apply-btn">
          Apply
        </button>
      </form>
      {loading && (
        <div className="plist-state">
          <div className="plist-spinner" />
          <span>Loading products...</span>
        </div>
      )}
      {error && !loading && <div className="plist-error">{error}</div>}
      {!loading && !error && products.length === 0 && (
        <div className="plist-empty">No products found for your filters.</div>
      )}
      <div className="plist-grid">
        {products.map((p) => (
          <button
            key={p.id}
            type="button"
            className="plist-card"
            onClick={() => navigate(`/products/${p.id}`)}
          >
            <div className="plist-image-wrap">
              <img src={p.image_url} alt={p.name} className="plist-image" />
            </div>
            <div className="plist-card-body">
              <h2 className="plist-card-title">{p.name}</h2>
              <p className="plist-card-category">{p.category}</p>
              <p className="plist-card-desc">{p.short_desc}</p>
              <div className="plist-card-footer">
                <span className="plist-card-price">₹{Number(p.price).toFixed(2)}</span>
                <span className="plist-card-link">View details</span>
              </div>
            </div>
          </button>
        ))}
      </div>
      {pagination.totalPages > 1 && (
        <Pagination
          page={pagination.page}
          totalPages={pagination.totalPages}
          onChange={handlePageChange}
        />
      )}
    </div>
  );
}

export default ProductList;
