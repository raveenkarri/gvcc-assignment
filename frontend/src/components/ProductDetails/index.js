import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import client from "../../api/client";
import EnquiryForm from "../EnquiryForm";
import "./index.css";

function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    async function fetchProduct() {
      try {
        setLoading(true);
        setError("");
        const res = await client.get(`/api/products/${id}`);
        setProduct(res.data.data);
      } catch (e) {
        setError("Unable to load product.");
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="pdetails-root">
        <div className="pdetails-state">Loading product...</div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="pdetails-root">
        <div className="pdetails-error">{error || "Product not found."}</div>
      </div>
    );
  }

  return (
    <div className="pdetails-root">
      <div className="pdetails-layout">
        <div className="pdetails-image-wrap">
          <img src={product.image_url} alt={product.name} className="pdetails-image" />
        </div>
        <div className="pdetails-body">
          <h1 className="pdetails-title">{product.name}</h1>
          <p className="pdetails-category">{product.category}</p>
          <p className="pdetails-price">₹{Number(product.price).toFixed(2)}</p>
          <p className="pdetails-short">{product.short_desc}</p>
          <p className="pdetails-long">{product.long_desc}</p>
          <button
            type="button"
            className="pdetails-enquire-btn"
            onClick={() => setShowForm(true)}
          >
            Enquire about this product
          </button>
        </div>
      </div>
      {showForm && (
        <EnquiryForm
          productId={product.id}
          productName={product.name}
          onClose={() => setShowForm(false)}
        />
      )}
    </div>
  );
}

export default ProductDetails;
