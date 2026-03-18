import { useCollection } from "../hooks/useCollection";
import RecordsTable from "../components/RecordsTable";
import "./PageShared.css";
import "./Logs.css";

const actionColors = {
  ADDED: "log-added",
  DELETED: "log-deleted"
};

const collectionLabels = {
  events: "Event",
  blogs: "Blog",
  gallery: "Gallery"
};

export default function Logs() {
  const { docs, loading } = useCollection("logs");

  function fmtTimestamp(ts) {
    if (!ts) return "—";
    const date = ts.toDate ? ts.toDate() : new Date(ts);
    return date.toLocaleString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true
    });
  }

  const columns = [
    {
      key: "action",
      label: "Action",
      render: (row) => (
        <span className={`log-badge ${actionColors[row.action] || ""}`}>
          {row.action || "—"}
        </span>
      )
    },
    {
      key: "collection",
      label: "Collection",
      render: (row) => (
        <span className="tag-pill">
          {collectionLabels[row.collection] || row.collection || "—"}
        </span>
      )
    },
    { key: "title", label: "Record Title", className: "td-title" },
    { key: "adminEmail", label: "Admin", render: (row) => row.adminEmail || "—" },
    {
      key: "timestamp",
      label: "Timestamp",
      render: (row) => (
        <span className="log-timestamp">{fmtTimestamp(row.timestamp)}</span>
      )
    }
  ];

  return (
    <div className="page-content">
      <div className="page-header">
        <div>
          <h1>Activity Logs</h1>
          <p>A record of every add and delete action performed by admins.</p>
        </div>
        <div className="log-count-badge">
          {docs.length} {docs.length === 1 ? "entry" : "entries"}
        </div>
      </div>

      <div className="records-section" style={{ marginTop: 0 }}>
        <RecordsTable
          columns={columns}
          rows={docs}
          loading={loading}
          emptyText="No activity logged yet."
        />
      </div>
    </div>
  );
}
