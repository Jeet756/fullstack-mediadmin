import { useEffect, useState } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable
} from "@hello-pangea/dnd";
export default function DoctorsAdmin() {
  const API = "https://fullstack-mediadmin.onrender.com";
  const token = localStorage.getItem("token");
const [isOrderChanged, setIsOrderChanged] = useState(false);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);
const [deleteLoadingId, setDeleteLoadingId] = useState(null);
const [orderLoading, setOrderLoading] = useState(false);
const [fetchLoading, setFetchLoading] = useState(true);
const [isEditOpen, setIsEditOpen] = useState(false);
  const [form, setForm] = useState({
    name: "",
    degree: "",
    description: ""
  });
  const [image, setImage] = useState(null);
  const [editId, setEditId] = useState(null);
const [search, setSearch] = useState("");
 const fetchDoctors = async () => {
  try {
    setFetchLoading(true); 
    const res = await fetch(`${API}/api/doctors`);
    const data = await res.json();
    data.sort((a, b) => a.order_index - b.order_index);
    setDoctors(data);
  } catch (err) {
    console.error(err);
  } finally {
    setFetchLoading(false); 
  }
};
  useEffect(() => {
    fetchDoctors();
  }, []);
const filteredDoctors = doctors.filter((doc) =>
  doc.name.toLowerCase().includes(search.toLowerCase())
);
  const handleSubmit = async () => {
  try {
    setLoading(true);
    const fd = new FormData();
    Object.keys(form).forEach((k) => fd.append(k, form[k]));
    if (image) {
  fd.append("image", image);
}
fd.append("order_index", doctors.length); 
    const url = editId
      ? `${API}/api/doctors/${editId}`
      : `${API}/api/doctors`;
    const method = editId ? "PUT" : "POST";
    const res = await fetch(url, {
      method,
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: fd
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || "Something went wrong");
    }
    alert(editId ? "Doctor updated ✅" : "Doctor added ✅");
    setForm({ name: "", degree: "", description: "" });
    setImage(null);
    setEditId(null);
setIsEditOpen(false); 
    fetchDoctors();
  } catch (err) {
    console.error(err);
    alert("Error: " + err.message);
  }
  finally {
    setLoading(false); 
  }
};
  const handleDelete = async (id) => {
  try {
    setDeleteLoadingId(id);
    await fetch(`${API}/api/doctors/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` }
    });
    fetchDoctors();
  } catch (err) {
    alert("Delete failed");
  } finally {
    setDeleteLoadingId(null);
  }
};
  const handleEdit = (doc) => {
  setEditId(doc.id);
  setForm({
    name: doc.name,
    degree: doc.degree,
    description: doc.description
  });
  setIsEditOpen(true); 
};
const handleSaveOrder = async () => {
  try {
    setOrderLoading(true);
    const order = doctors.map((d) => d.id);
    const res = await fetch(`${API}/api/doctors/reorder`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ order })
    });
    if (!res.ok) throw new Error();
    setIsOrderChanged(false);
    fetchDoctors();
  } catch {
    alert("Failed");
  } finally {
    setOrderLoading(false);
  }
};
const handleDragEnd = (result) => {
  if (!result.destination) return;
  const items = Array.from(doctors);
  const [moved] = items.splice(result.source.index, 1);
  items.splice(result.destination.index, 0, moved);
  setDoctors(items);
  setIsOrderChanged(true); 
};
const inputStyle = {
  width: "100%",
  padding: "10px",
  marginBottom: "10px",
  borderRadius: "6px",
  border: "1px solid #ccc"
};
const primaryBtn = {
  background: "#2563eb",
  color: "#fff",
  padding: "10px 15px",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
  marginTop: "10px"
};
const saveBtn = {
  background: "green",
  color: "#fff",
  padding: "10px 15px",
  border: "none",
  borderRadius: "6px",
  marginBottom: "20px",
  cursor: "pointer"
};
const editBtn = {
  background: "#3b82f6",
  color: "#fff",
  border: "none",
  padding: "6px 10px",
  borderRadius: "5px",
  cursor: "pointer",
  flex: "1"
};
const deleteBtn = {
  background: "#ef4444",
  color: "#fff",
  border: "none",
  padding: "6px 10px",
  borderRadius: "5px",
  cursor: "pointer",
  flex: "1"
};
  return (
  <div style={{ padding: "20px", background: "#f5f7fb", minHeight: "100vh" }}>
    <h2 style={{
  marginBottom: "20px",
  wordBreak: "break-word",
  fontSize: "clamp(16px, 5vw, 24px)"
}}>
  Doctors Management
</h2>
    <input
      placeholder="Search doctor..."
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      style={{
        padding: "10px",
        width: "100%",
        marginBottom: "20px",
        borderRadius: "8px",
        border: "1px solid #ccc"
      }}
    />
    <div
      style={{
        background: "#fff",
        padding: "20px",
        borderRadius: "10px",
        boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
        marginBottom: "20px"
      }}
    >
      <h3>Add Doctor</h3>
      <input
        placeholder="Name"
        value={form.name}
        onChange={(e) =>
          setForm({ ...form, name: e.target.value })
        }
        style={inputStyle}
      />
      <input
        placeholder="Degree"
        value={form.degree}
        onChange={(e) =>
          setForm({ ...form, degree: e.target.value })
        }
        style={inputStyle}
      />
      <textarea
        placeholder="Description"
        value={form.description}
        onChange={(e) =>
          setForm({ ...form, description: e.target.value })
        }
        style={{ ...inputStyle, height: "80px" }}
      />
      <label style={{
  display: "block",
  width: "100%",
  padding: "10px",
  border: "1px solid #ccc",
  borderRadius: "6px",
  cursor: "pointer",
  textAlign: "center",
  background: "#fafafa",
  marginTop: "10px"
}}>
  {image ? image.name : "Choose Image"}
  <input
    type="file"
    onChange={(e) => setImage(e.target.files[0])}
    style={{ display: "none" }}
  />
</label>
      {image && (
        <img
          src={URL.createObjectURL(image)}
          alt="preview"
          width="80"
          style={{ marginTop: "10px", borderRadius: "6px" }}
        />
      )}
      <button onClick={handleSubmit} style={primaryBtn} disabled={loading}>
  {loading ? "Adding..." : "Add"}
</button>
    </div>
    {isOrderChanged && (
  <button
    onClick={handleSaveOrder}
    style={saveBtn}
    disabled={orderLoading}
  >
    {orderLoading ? "Saving..." : "Save Order"}
  </button>
)}
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="doctors">
        {(provided) => (
          <div ref={provided.innerRef} {...provided.droppableProps}>
  {fetchLoading ? (
  <p style={{ textAlign: "center", color: "#777" }}>
    Loading doctors...
  </p>
) : filteredDoctors.length === 0 ? (
  <p style={{ textAlign: "center", color: "#777" }}>
    No doctors found
  </p>
) : null}
            {doctors.filter((doc) =>
    doc.name.toLowerCase().includes(search.toLowerCase())
  )
  .map((doc, index) => (
              <Draggable
                key={doc.id.toString()}
                draggableId={doc.id.toString()}
                index={index}
              >
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    style={{
  background: "#fff",
  padding: "15px",
  marginBottom: "15px",
  borderRadius: "10px",
  display: "flex",
  flexWrap: "wrap", 
  gap: "10px",
  alignItems: "center",
  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
  ...provided.draggableProps.style
}}
                  >
                    <img
  src={doc.image_url}
  width="80"
  style={{ borderRadius: "8px", flexShrink: 0 }}
/>
                    <div style={{ flex: "1 1 120px", minWidth: "100px" }}>
                      <h4 style={{ margin: 0 }}>{doc.name}</h4>
                      <p style={{ margin: "5px 0", color: "#666" }}>
                        {doc.degree}
                      </p>
                    </div>
                    <div style={{
  display: "flex",
  gap: "8px",
  flexWrap: "wrap",
  justifyContent: "flex-end",
  flex: "1 1 100%",
}}>
  <button
    onClick={() => handleEdit(doc)}
    style={editBtn}
  >
    Edit
  </button>
  <button
    onClick={() => {
      if (window.confirm("Delete this doctor?")) {
        handleDelete(doc.id);
      }
    }}
    style={deleteBtn}
    disabled={deleteLoadingId === doc.id}
  >
    {deleteLoadingId === doc.id ? "Deleting..." : "Delete"}
  </button>
</div>
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
    {isEditOpen && (
  <div style={{
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: "rgba(0,0,0,0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000
  }}>
    <div style={{
      background: "#fff",
      padding: "20px",
      borderRadius: "10px",
      width: "400px"
    }}>
      <h3>Edit Doctor</h3>
      <input
        value={form.name}
        onChange={(e) =>
          setForm({ ...form, name: e.target.value })
        }
        style={inputStyle}
      />
      <input
        value={form.degree}
        onChange={(e) =>
          setForm({ ...form, degree: e.target.value })
        }
        style={inputStyle}
      />
      <textarea
        value={form.description}
        onChange={(e) =>
          setForm({ ...form, description: e.target.value })
        }
        style={{ ...inputStyle, height: "80px" }}
      />
      <label style={{
  display: "block",
  width: "100%",
  padding: "10px",
  border: "1px solid #ccc",
  borderRadius: "6px",
  cursor: "pointer",
  textAlign: "center",
  background: "#fafafa",
  marginTop: "10px"
}}>
  {image ? image.name : "Choose Image"}
  <input
    type="file"
    onChange={(e) => setImage(e.target.files[0])}
    style={{ display: "none" }}
  />
</label>
      <button
        onClick={handleSubmit}
        style={primaryBtn}
        disabled={loading}
      >
        {loading ? "Updating..." : "Update"}
      </button>
      <button
        onClick={() => setIsEditOpen(false)}
        style={{
          marginLeft: "10px",
          padding: "10px",
          borderRadius: "6px",
          border: "1px solid #ccc"
        }}
      >
        Cancel
      </button>
    </div>
  </div>
)}
  </div>
);
}