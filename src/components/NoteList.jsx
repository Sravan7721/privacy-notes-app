import React from "react";

export default function NoteList({ notes, onDelete, onEdit }) {
  return (
    <div className="card">
      <h3>Your Notes</h3>

      {notes.length === 0 && <p>No notes yet.</p>}

      {notes.map((n) => (
        <div key={n.id} className="note">
          <strong>{n.title || "Untitled"}</strong>
          <p>{n.preview}</p>

          <button onClick={() => onEdit(n)}>Edit</button>
          <button onClick={() => onDelete(n.id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}
