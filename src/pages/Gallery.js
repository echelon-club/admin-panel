import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useCollection } from "../hooks/useCollection";
import { addGalleryItem, deleteGalleryItem } from "../firebase/firestore";
import RecordsTable from "../components/RecordsTable";
import ImagePreview from "../components/ImagePreview";
import Toast from "../components/Toast";
import "./PageShared.css";

const empty = {
  name: "",
  date: "",
  image: ""
};

export default function Gallery() {
  const { user } = useAuth();
  const { docs, loading } = useCollection("gallery");
  const [form, setForm] = useState(empty);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState(null);

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function clearForm() {
    setForm(empty);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.name || !form.date || !form.image) {
      setToast({ message: "All fields are required for a photo.", type: "error" });
      return;
    }
    setSubmitting(true);
    try {
      await addGalleryItem(form, user.email);
      setToast({ message: "Photo added successfully.", type: "success" });
      clearForm();
    } catch (err) {
      setToast({ message: "Failed to add photo: " + err.message, type: "error" });
    }
    setSubmitting(false);
  }

  async function handleDelete(doc) {
    if (!window.confirm(`Delete "${doc.name}"? This cannot be undone.`)) return;
    try {
      await deleteGalleryItem(doc.id, doc.name, user.email);
    } catch (err) {
      setToast({ message: "Delete failed: " + err.message, type: "error" });
    }
  }

  function fmtDate(dateStr) {
    if (!dateStr) return "—";
    const [y, m, d] = dateStr.split("-");
    const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    return `${months[parseInt(m) - 1]} ${parseInt(d)}, ${y}`;
  }

  const columns = [
    {
      key: "image",
      label: "Image",
      render: (row) =>
        row.image ? (
          <img className="td-thumb" src={row.image} alt={row.name} />
        ) : (
          <div className="td-thumb-placeholder"><span>None</span></div>
        )
    },
    { key: "name", label: "Caption / Name", className: "td-title" },
    { key: "date", label: "Date", render: (row) => fmtDate(row.date) },
    {
      key: "actions",
      label: "",
      render: (row) => (
        <button className="btn-delete" onClick={() => handleDelete(row)}>
          Delete
        </button>
      )
    }
  ];

  return (
    <div className="page-content">
      <div className="page-header">
        <div>
          <h1>Gallery</h1>
          <p>Add photos from events and campus moments to the visual archive.</p>
        </div>
      </div>

      <div className="form-card">
        <h3>Add New Photo</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label>Caption / Name *</label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="e.g. 24-Hour Hackathon"
              />
            </div>
            <div className="form-group">
              <label>Date *</label>
              <input
                type="date"
                name="date"
                value={form.date}
                onChange={handleChange}
              />
            </div>
            <div className="form-group full">
              <label>Image URL *</label>
              <input
                name="image"
                value={form.image}
                onChange={handleChange}
                placeholder="https://..."
              />
              <ImagePreview url={form.image} />
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn-primary" disabled={submitting}>
              {submitting ? "Adding..." : "Add Photo"}
            </button>
            <button type="button" className="btn-ghost" onClick={clearForm}>
              Clear
            </button>
            {toast && (
              <Toast
                message={toast.message}
                type={toast.type}
                onDone={() => setToast(null)}
              />
            )}
          </div>
        </form>
      </div>

      <div className="records-section">
        <div className="records-header">
          <h3>All Photos</h3>
          <span className="record-count">
            {docs.length} {docs.length === 1 ? "record" : "records"}
          </span>
        </div>
        <RecordsTable
          columns={columns}
          rows={docs}
          loading={loading}
          emptyText="No photos yet. Add one above."
        />
      </div>
    </div>
  );
}
