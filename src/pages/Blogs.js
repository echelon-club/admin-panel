import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useCollection } from "../hooks/useCollection";
import { addBlog, deleteBlog } from "../firebase/firestore";
import RecordsTable from "../components/RecordsTable";
import ImagePreview from "../components/ImagePreview";
import Toast from "../components/Toast";
import "./PageShared.css";

const empty = {
  title: "",
  author: "",
  date: "",
  type: "",
  description: "",
  image: ""
};

export default function Blogs() {
  const { user } = useAuth();
  const { docs, loading } = useCollection("blogs");
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
    if (!form.title || !form.author || !form.date || !form.type || !form.description) {
      setToast({ message: "Please fill all required fields.", type: "error" });
      return;
    }
    setSubmitting(true);
    try {
      await addBlog(form, user.email);
      setToast({ message: "Blog post added successfully.", type: "success" });
      clearForm();
    } catch (err) {
      setToast({ message: "Failed to add blog post: " + err.message, type: "error" });
    }
    setSubmitting(false);
  }

  async function handleDelete(doc) {
    if (!window.confirm(`Delete "${doc.title}"? This cannot be undone.`)) return;
    try {
      await deleteBlog(doc.id, doc.title, user.email);
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
          <img className="td-thumb" src={row.image} alt={row.title} />
        ) : (
          <div className="td-thumb-placeholder"><span>None</span></div>
        )
    },
    { key: "title", label: "Title", className: "td-title" },
    { key: "author", label: "Author", render: (row) => row.author || "—" },
    {
      key: "type",
      label: "Type",
      render: (row) => <span className="tag-pill">{row.type || "—"}</span>
    },
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
          <h1>Blog Posts</h1>
          <p>Publish event recaps, stories, and ideas from the club.</p>
        </div>
      </div>

      <div className="form-card">
        <h3>Add New Blog Post</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label>Title *</label>
              <input
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="e.g. What We Built in 24 Hours"
              />
            </div>
            <div className="form-group">
              <label>Author *</label>
              <input
                name="author"
                value={form.author}
                onChange={handleChange}
                placeholder="e.g. Dhanush K"
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
            <div className="form-group">
              <label>Type *</label>
              <select name="type" value={form.type} onChange={handleChange}>
                <option value="">Select type</option>
                <option>Hackathon Recap</option>
                <option>Workshop</option>
                <option>Media</option>
                <option>Community</option>
                <option>Other</option>
              </select>
            </div>
            <div className="form-group full">
              <label>Description / Excerpt *</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Short excerpt shown on the blog listing page..."
              />
            </div>
            <div className="form-group full">
              <label>Cover Image URL</label>
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
              {submitting ? "Adding..." : "Add Blog Post"}
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
          <h3>All Blog Posts</h3>
          <span className="record-count">
            {docs.length} {docs.length === 1 ? "record" : "records"}
          </span>
        </div>
        <RecordsTable
          columns={columns}
          rows={docs}
          loading={loading}
          emptyText="No blog posts yet. Add one above."
        />
      </div>
    </div>
  );
}
