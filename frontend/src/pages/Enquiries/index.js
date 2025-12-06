import React, { useEffect, useState } from "react";
import client from "../../api/client";
import "./index.css";

function Enquiries() {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchEnquiries() {
      try {
        setLoading(true);
        setError("");
        const res = await client.get("/api/enquiries");
        setEnquiries(res.data.data);
      } catch (e) {
        setError("Unable to load enquiries.");
      } finally {
        setLoading(false);
      }
    }
    fetchEnquiries();
  }, []);

  if (loading) {
    return (
      <div className="enqs-root">
        <div className="enqs-state">Loading enquiries...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="enqs-root">
        <div className="enqs-error">{error}</div>
      </div>
    );
  }

  if (enquiries.length === 0) {
    return (
      <div className="enqs-root">
        <div className="enqs-empty">No enquiries yet.</div>
      </div>
    );
  }

  return (
    <div className="enqs-root">
      <h1 className="enqs-title">Enquiries</h1>
      <div className="enqs-list">
        {enquiries.map((e) => (
          <div key={e.id} className="enqs-card">
            <div className="enqs-header-row">
              <div>
                <div className="enqs-product">{e.product_name || "General enquiry"}</div>
                <div className="enqs-name">{e.name}</div>
              </div>
              <div className="enqs-email">{e.email}</div>
            </div>
            {e.phone && <div className="enqs-phone">Phone: {e.phone}</div>}
            <p className="enqs-message">{e.message}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Enquiries;
