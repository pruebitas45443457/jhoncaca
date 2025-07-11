import React, { useEffect, useState } from "react";
import { getAuth, signOut } from "firebase/auth";
import { getFirestore, doc, getDoc, updateDoc } from "firebase/firestore";

function Perfil() {
  const [usuario, setUsuario] = useState(null);
  const [editando, setEditando] = useState(false);
  const [nombre, setNombre] = useState("");
  const [direccion, setDireccion] = useState("");
  const [guardando, setGuardando] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [cargando, setCargando] = useState(true);
  const [avatarUrl, setAvatarUrl] = useState("");
  const [showLogout, setShowLogout] = useState(false);
  

  useEffect(() => {
    const fetchUser = async () => {
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) {
        setCargando(false);
        setUsuario(false);
        return;
      }
      const db = getFirestore();
      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        setUsuario({ ...userSnap.data(), email: user.email });
        setNombre(userSnap.data().nombre || "");
        setDireccion(userSnap.data().direccion || "");
        setAvatarUrl(userSnap.data().avatarUrl || "");
      } else {
        setUsuario({ email: user.email });
        setAvatarUrl("");
      }
      setCargando(false);
    };
    fetchUser();
  }, []);

  const handleGuardar = async (e) => {
    e.preventDefault();
    setGuardando(true);
    setMensaje("");
    try {
      const auth = getAuth();
      const user = auth.currentUser;
      const db = getFirestore();
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, { nombre, direccion, avatarUrl });
      setUsuario((prev) => ({ ...prev, nombre, direccion, avatarUrl }));
      setEditando(false);
      setMensaje("✅ Datos actualizados correctamente.");
    } catch (err) {
      setMensaje("❌ Error al guardar los datos.");
    }
    setGuardando(false);
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setAvatarUrl(ev.target.result);
    reader.readAsDataURL(file);
  };

  const handleLogout = async () => {
    await signOut(getAuth());
    window.location.reload();
  };

  if (cargando) {
    return (
      <div style={{ textAlign: "center", marginTop: 80, color: "#1976d2" }}>
        <div className="loader" style={{ margin: "0 auto 18px auto" }} />
        Cargando perfil...
      </div>
    );
  }

  if (usuario === false) {
    return (
      <div
        style={{
          textAlign: "center",
          marginTop: 80,
          color: "#e53935",
          fontWeight: 700,
        }}
      >
        Debes iniciar sesión para ver tu perfil.
      </div>
    );
  }

  return (
    <div
      style={{
        maxWidth: 520,
        margin: "3rem auto",
        background: "linear-gradient(120deg, #e3f2fd 60%, #fff 100%)",
        borderRadius: "2rem",
        boxShadow: "0 8px 32px #2196f344",
        padding: "2.5rem 2rem 2rem 2rem",
        position: "relative",
        animation: "fadeIn 0.7s",
      }}
    >
      {/* Botón cerrar sesión flotante */}
      <button
        onClick={() => setShowLogout((v) => !v)}
        style={{
          position: "absolute",
          top: 24,
          right: 24,
          background: "none",
          border: "none",
          fontSize: 26,
          color: "#1976d2",
          cursor: "pointer",
          zIndex: 2,
        }}
        title="Opciones"
      >
        ⋮
      </button>
      {showLogout && (
        <div
          style={{
            position: "absolute",
            top: 54,
            right: 24,
            background: "#fff",
            borderRadius: 12,
            boxShadow: "0 2px 16px #2196f344",
            padding: "0.5rem 1.2rem",
            zIndex: 10,
            minWidth: 120,
            textAlign: "right",
          }}
        >
          <button
            onClick={handleLogout}
            style={{
              background: "none",
              border: "none",
              color: "#e53935",
              fontWeight: 700,
              fontSize: 16,
              cursor: "pointer",
              padding: "6px 0",
              width: "100%",
              textAlign: "right",
            }}
          >
            Cerrar sesión
          </button>
        </div>
      )}

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 22,
          marginBottom: 28,
        }}
      >
        <div
          style={{
            width: 90,
            height: 90,
            borderRadius: "50%",
            background: "linear-gradient(135deg, #fff 60%, #e3f2fd 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 44,
            color: "#1976d2",
            fontWeight: 900,
            boxShadow: "0 2px 16px #2196f344",
            border: "2.5px solid #2196f3",
            userSelect: "none",
            overflow: "hidden",
            position: "relative",
          }}
        >
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt="avatar"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                borderRadius: "50%",
              }}
            />
          ) : (
            <span role="img" aria-label="avatar">
              👤
            </span>
          )}
          {editando && (
            <label
              htmlFor="avatar-input"
              style={{
                position: "absolute",
                bottom: 0,
                right: 0,
                background: "#1976d2",
                color: "#fff",
                borderRadius: "50%",
                width: 32,
                height: 32,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 18,
                cursor: "pointer",
                border: "2px solid #fff",
                boxShadow: "0 2px 8px #2196f344",
              }}
              title="Cambiar avatar"
            >
              <input
                id="avatar-input"
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={handleAvatarChange}
              />
              <span role="img" aria-label="cambiar">✏️</span>
            </label>
          )}
        </div>
        <div>
          <div style={{ fontWeight: 900, fontSize: 26, color: "#1976d2" }}>
            {usuario.nombre || "Usuario"}
          </div>
          <div style={{ color: "#1565c0", fontSize: 15, marginTop: 2 }}>
            {usuario.email}
          </div>
          <div style={{ color: "#43a047", fontSize: 13, marginTop: 6, fontWeight: 700 }}>
            {direccion && !editando && "✔ Dirección guardada"}
          </div>
        </div>
      </div>

      <form onSubmit={handleGuardar} style={{ marginTop: 18 }}>
        <div style={{ marginBottom: 18 }}>
          <label style={{ color: "#1565c0", fontWeight: 700, fontSize: 15 }}>
            Nombre completo
          </label>
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            disabled={!editando}
            style={{
              width: "100%",
              borderRadius: 10,
              border: "1.5px solid #e3f2fd",
              padding: "0.7rem 1rem",
              fontSize: 16,
              color: "#1976d2",
              background: editando ? "#f5fafd" : "#f3f3f3",
              fontWeight: 600,
              marginTop: 4,
              outline: editando ? "2px solid #2196f3" : "none",
              transition: "background 0.2s, outline 0.2s",
            }}
            required
          />
        </div>
        <div style={{ marginBottom: 18 }}>
          <label style={{ color: "#1565c0", fontWeight: 700, fontSize: 15 }}>
            Dirección de envío
          </label>
          <input
            type="text"
            value={direccion}
            onChange={(e) => setDireccion(e.target.value)}
            disabled={!editando}
            style={{
              width: "100%",
              borderRadius: 10,
              border: "1.5px solid #e3f2fd",
              padding: "0.7rem 1rem",
              fontSize: 16,
              color: "#1976d2",
              background: editando ? "#f5fafd" : "#f3f3f3",
              fontWeight: 600,
              marginTop: 4,
              outline: editando ? "2px solid #2196f3" : "none",
              transition: "background 0.2s, outline 0.2s",
            }}
            required
          />
        </div>
        {mensaje && (
          <div
            style={{
              color: mensaje.includes("Error") ? "#e53935" : "#43a047",
              fontWeight: 700,
              marginBottom: 12,
              fontSize: 15,
              textAlign: "center",
            }}
          >
            {mensaje}
          </div>
        )}
        <div style={{ display: "flex", gap: 12, marginTop: 10 }}>
          {!editando ? (
            <button
              type="button"
              onClick={() => setEditando(true)}
              style={{
                background: "linear-gradient(90deg, #2196f3 60%, #0d47a1 100%)",
                color: "#fff",
                border: "none",
                borderRadius: 10,
                padding: "12px 0",
                width: "100%",
                fontWeight: 900,
                fontSize: 17,
                cursor: "pointer",
                boxShadow: "0 2px 8px #2196f344",
                letterSpacing: 1,
                transition: "background 0.18s, transform 0.18s",
              }}
            >
              Editar perfil
            </button>
          ) : (
            <>
              <button
                type="submit"
                disabled={guardando}
                style={{
                  background: "linear-gradient(90deg, #2196f3 60%, #0d47a1 100%)",
                  color: "#fff",
                  border: "none",
                  borderRadius: 10,
                  padding: "12px 0",
                  width: "100%",
                  fontWeight: 900,
                  fontSize: 17,
                  cursor: guardando ? "not-allowed" : "pointer",
                  boxShadow: "0 2px 8px #2196f344",
                  letterSpacing: 1,
                  opacity: guardando ? 0.7 : 1,
                  transition: "background 0.18s, transform 0.18s",
                }}
              >
                {guardando ? "Guardando..." : "Guardar cambios"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setEditando(false);
                  setNombre(usuario.nombre || "");
                  setDireccion(usuario.direccion || "");
                  setAvatarUrl(usuario.avatarUrl || "");
                  setMensaje("");
                }}
                style={{
                  background: "#e3f2fd",
                  color: "#1976d2",
                  border: "none",
                  borderRadius: 10,
                  padding: "12px 0",
                  width: "100%",
                  fontWeight: 900,
                  fontSize: 17,
                  cursor: "pointer",
                  boxShadow: "0 2px 8px #2196f344",
                  letterSpacing: 1,
                  transition: "background 0.18s, transform 0.18s",
                }}
              >
                Cancelar
              </button>
            </>
          )}
        </div>
      </form>
      <div
        style={{
          marginTop: 32,
          textAlign: "center",
          color: "#bdbdbd",
          fontSize: 13,
          letterSpacing: 1,
        }}
      >
        <span>© {new Date().getFullYear()} | Tu perfil</span>
      </div>
      <style>
        {`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .loader {
          border: 4px solid #e3f2fd;
          border-top: 4px solid #1976d2;
          border-radius: 50%;
          width: 36px;
          height: 36px;
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          0% { transform: rotate(0deg);}
          100% { transform: rotate(360deg);}
        }
        `}
      </style>
    </div>
  );
}

export default Perfil;