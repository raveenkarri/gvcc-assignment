import React, { useState } from "react";
import client from "../../api/client";
import "./index.css";

function EnquiryForm({ productId, productName, onClose }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("");

  const validate = () => {
    const next = {};
    if (!name.trim()) next.name = "Name is required.";
    if (!email.trim()) next.email = "Email is required.";
    else {
      const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!pattern.test(email.trim())) next.email = "Enter a valid email.";
    }
    if (!message.trim()) next.message = "Message is required.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      setStatus("loading");
      await client.post("/api/enquiries", {
        product_id: productId,
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim() || null,
        message: message.trim(),
      });
      setStatus("success");
      setName("");
      setEmail("");
      setPhone("");
      setMessage("");
    } catch (e) {
      setStatus("error");
    }
  };

  return (
    <div className="enq-overlay" role="dialog" aria-modal="true">
      <div className="enq-panel">
        <div className="enq-header">
          <div>
            <h2 className="enq-title">Enquire about this product</h2>
            <p className="enq-subtitle">{productName}</p>
          </div>
          <button type="button" className="enq-close" onClick={onClose} aria-label="Close enquiry form">
            ×
          </button>
        </div>
        <form className="enq-form" onSubmit={handleSubmit}>
          <div className="enq-field">
            <label htmlFor="enq-name" className="enq-label">
              Name
            </label>
            <input
              id="enq-name"
              type="text"
              className="enq-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            {errors.name && <div className="enq-error">{errors.name}</div>}
          </div>
          <div className="enq-field">
            <label htmlFor="enq-email" className="enq-label">
              Email
            </label>
            <input
              id="enq-email"
              type="email"
              className="enq-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {errors.email && <div className="enq-error">{errors.email}</div>}
          </div>
          <div className="enq-field">
            <label htmlFor="enq-phone" className="enq-label">
              Phone (optional)
            </label>
            <input
              id="enq-phone"
              type="tel"
              className="enq-input"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
          <div className="enq-field">
            <label htmlFor="enq-message" className="enq-label">
              Message
            </label>
            <textarea
              id="enq-message"
              className="enq-textarea"
              rows="4"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            {errors.message && <div className="enq-error">{errors.message}</div>}
          </div>
          <button type="submit" className="enq-submit" disabled={status === "loading"}>
            {status === "loading" ? "Sending..." : "Submit enquiry"}
          </button>
          {status === "success" && (
            <div className="enq-success">Your enquiry has been submitted.</div>
          )}
          {status === "error" && (
            <div className="enq-error-global">Something went wrong. Please try again.</div>
          )}
        </form>
      </div>
    </div>
  );
}

export default EnquiryForm;
