import { useEffect, useRef, useState } from "react";
import { ExternalBlob } from "../backend";
import { useActor } from "../hooks/useActor";

export function AdminPage() {
  const { actor, isFetching } = useActor();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [musicStatus, setMusicStatus] = useState<string>("Checking...");
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!actor || isFetching) return;
    actor
      .isCallerAdmin()
      .then((result) => setIsAdmin(result))
      .catch(() => setIsAdmin(false));
    actor
      .getBackgroundMusicKey()
      .then((blob) =>
        setMusicStatus(blob ? "✅ Music is set" : "No music uploaded yet"),
      )
      .catch(() => setMusicStatus("Unable to check"));
  }, [actor, isFetching]);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !actor) return;
    setErrorMsg("");
    setSuccessMsg("");
    setUploading(true);
    setProgress(0);
    try {
      const bytes = new Uint8Array(await file.arrayBuffer());
      const blob = ExternalBlob.fromBytes(bytes).withUploadProgress((pct) =>
        setProgress(Math.round(pct)),
      );
      await actor.setBackgroundMusicKey(blob);
      setSuccessMsg(
        "🎵 Music uploaded successfully! Refresh the main page to hear it.",
      );
      setMusicStatus("✅ Music is set");
    } catch {
      setErrorMsg("Upload failed. Please try again.");
    } finally {
      setUploading(false);
      setProgress(0);
    }
  }

  if (isFetching || isAdmin === null) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#fff0f5",
          fontFamily: "serif",
        }}
      >
        <p style={{ color: "#e91e8c" }}>Loading...</p>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#fff0f5",
          fontFamily: "serif",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <p style={{ fontSize: "2rem" }}>🔒</p>
          <p style={{ color: "#e91e8c", fontSize: "1.2rem" }}>Access denied</p>
          <a href="/" style={{ color: "#ff6ba8", fontSize: "0.9rem" }}>
            ← Go back
          </a>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#fff0f5",
        fontFamily: "serif",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem",
      }}
    >
      <div
        style={{
          background: "white",
          borderRadius: "1.5rem",
          padding: "2.5rem",
          maxWidth: "480px",
          width: "100%",
          boxShadow: "0 4px 32px rgba(233,30,140,0.12)",
        }}
      >
        <h1
          style={{
            color: "#e91e8c",
            fontSize: "1.6rem",
            marginBottom: "0.5rem",
            textAlign: "center",
          }}
        >
          🎵 Music Admin
        </h1>
        <p
          style={{
            color: "#aaa",
            fontSize: "0.9rem",
            textAlign: "center",
            marginBottom: "2rem",
          }}
        >
          Upload background music for the anniversary website
        </p>

        <div
          style={{
            background: "#fff0f5",
            borderRadius: "0.75rem",
            padding: "1rem",
            marginBottom: "1.5rem",
            textAlign: "center",
          }}
        >
          <span style={{ color: "#e91e8c", fontWeight: 600 }}>
            Current status:
          </span>
          <span style={{ color: "#555", marginLeft: "0.5rem" }}>
            {musicStatus}
          </span>
        </div>

        <label
          htmlFor="music-file-input"
          style={{
            display: "block",
            marginBottom: "0.5rem",
            color: "#e91e8c",
            fontWeight: 600,
          }}
        >
          Upload new music
        </label>
        <p style={{ color: "#aaa", fontSize: "0.8rem", marginBottom: "1rem" }}>
          Accepted: MP3, WAV, M4A, OGG
        </p>

        <input
          ref={fileInputRef}
          type="file"
          accept="audio/*"
          onChange={handleFileChange}
          disabled={uploading}
          id="music-file-input"
          data-ocid="admin.upload_button"
          style={{ display: "none" }}
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          style={{
            width: "100%",
            padding: "0.85rem",
            background: uploading ? "#f9a8d4" : "#e91e8c",
            color: "white",
            border: "none",
            borderRadius: "0.75rem",
            fontSize: "1rem",
            cursor: uploading ? "not-allowed" : "pointer",
            fontFamily: "serif",
            transition: "background 0.2s",
          }}
        >
          {uploading ? `Uploading... ${progress}%` : "Choose Audio File"}
        </button>

        {uploading && (
          <div
            style={{
              marginTop: "1rem",
              background: "#ffe0ee",
              borderRadius: "9999px",
              height: "8px",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                height: "100%",
                background: "#e91e8c",
                width: `${progress}%`,
                transition: "width 0.3s",
                borderRadius: "9999px",
              }}
            />
          </div>
        )}

        {successMsg && (
          <div
            data-ocid="admin.success_state"
            style={{
              marginTop: "1rem",
              padding: "0.75rem 1rem",
              background: "#e8f5e9",
              borderRadius: "0.75rem",
              color: "#2e7d32",
              fontSize: "0.9rem",
            }}
          >
            {successMsg}
          </div>
        )}
        {errorMsg && (
          <div
            data-ocid="admin.error_state"
            style={{
              marginTop: "1rem",
              padding: "0.75rem 1rem",
              background: "#ffebee",
              borderRadius: "0.75rem",
              color: "#c62828",
              fontSize: "0.9rem",
            }}
          >
            {errorMsg}
          </div>
        )}

        <div style={{ marginTop: "2rem", textAlign: "center" }}>
          <a href="/" style={{ color: "#ff6ba8", fontSize: "0.9rem" }}>
            ← Back to website
          </a>
        </div>
      </div>
    </div>
  );
}
