import "./ImagePreview.css";

export default function ImagePreview({ url }) {
  if (!url) {
    return <div className="img-preview empty">No image URL entered</div>;
  }

  return (
    <div className="img-preview">
      <img
        src={url}
        alt="preview"
        onError={(e) => {
          e.target.style.display = "none";
          e.target.nextSibling.style.display = "flex";
        }}
      />
      <div className="img-preview-error" style={{ display: "none" }}>
        Invalid image URL
      </div>
    </div>
  );
}
