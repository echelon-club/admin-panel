import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useCollection } from "../hooks/useCollection";
import { addEvent, deleteEvent } from "../firebase/firestore";
import RecordsTable from "../components/RecordsTable";
import ImagePreview from "../components/ImagePreview";
import Toast from "../components/Toast";
import "./PageShared.css";

const empty = {
  title: "",
  date: "",
  type: "",
  location: "",
  description: "",
  image: "",
  rsvp_url: ""
};

export default function Events() {
  const { user } = useAuth();
  const { docs, loading } = useCollection("events");
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
    if (!form.title || !form.date || !form.type || !form.description) {
      setToast({ message: "Please fill all required fields.", type: "error" });
      return;
    }
    setSubmitting(true);
    try {
      await addEvent(form, user.email);
      setToast({ message: "Event added successfully.", type: "success" });
      clearForm();
    } catch (err) {
      setToast({ message: "Failed to add event: " + err.message, type: "error" });
    }
    setSubmitting(false);
  }

  async function handleDelete(doc) {
    if (!window.confirm(`Delete "${doc.title}"? This cannot be undone.`)) return;
    try {
      await deleteEvent(doc.id, doc.title, user.email);
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
    {
      key: "type",
      label: "Type",
      render: (row) => <span className="tag-pill">{row.type || "—"}</span>
    },
    { key: "date", label: "Date", render: (row) => fmtDate(row.date) },
    { key: "location", label: "Location", render: (row) => row.location || "—" },
    {
      key: "rsvp_url",
      label: "RSVP",
      render: (row) =>
        row.rsvp_url ? (
          <a href={row.rsvp_url} target="_blank" rel="noreferrer" className="td-rsvp-link">
            Link ↗
          </a>
        ) : (
          <span style={{ color: "#d4d1cc" }}>—</span>
        )
    },
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
          <h1>Events</h1>
          <p>Add and manage club events — hackathons, workshops, media sessions.</p>
        </div>
      </div>

      <div className="form-card">
        <h3>Add New Event</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label>Title *</label>
              <input
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="e.g. 24-Hour Build Challenge"
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
                <option>Hackathon</option>
                <option>Workshop</option>
                <option>Media</option>
                <option>Other</option>
              </select>
            </div>
            <div className="form-group">
              <label>Location</label>
              <input
                name="location"
                value={form.location}
                onChange={handleChange}
                placeholder="e.g. Main Auditorium, Block B"
              />
            </div>
            <div className="form-group full">
              <label>Description *</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Describe the event..."
              />
            </div>
            <div className="form-group full">
              <label>Image URL</label>
              <input
                name="image"
                value={form.image}
                onChange={handleChange}
                placeholder="https://..."
              />
              <ImagePreview url={form.image} />
            </div>
            <div className="form-group full">
              <label>RSVP URL</label>
              <input
                name="rsvp_url"
                value={form.rsvp_url}
                onChange={handleChange}
                placeholder="https://forms.google.com/..."
              />
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn-primary" disabled={submitting}>
              {submitting ? "Adding..." : "Add Event"}
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
          <h3>All Events</h3>
          <span className="record-count">
            {docs.length} {docs.length === 1 ? "record" : "records"}
          </span>
        </div>
        <RecordsTable
          columns={columns}
          rows={docs}
          loading={loading}
          emptyText="No events yet. Add one above."
        />
      </div>
    </div>
  );
}