import React, { useState, useEffect } from "react";

export default function NoteEditor({ onSave, editing }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    if (editing) {
      setTitle(editing.title || "");
      setContent(editing.content || "");
    }
  }, [editing]);

  return (
    <div className="card">
      <h3>{editing ? "Edit Note" : "New Note"}</h3>

      <input
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <textarea
        placeholder="Write something..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />

      <button onClick={() => onSave(title, content)}>
        {editing ? "Update Note" : "Save Note"}
      </button>
    </div>
  );
}
