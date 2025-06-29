import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./home2.css";
import Registro from "../registro";
import Login from "../login"; // <--- IMPORTA LOGIN

const productos = [
	{
		nombre: "Suplemento Premium",
		descripcion: "Mejora tu energía y bienestar con ingredientes naturales.",
		precio: 29.99,
		imagen:
			"https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80",
	},
	{
		nombre: "Proteína Vegana",
		descripcion: "Ideal para recuperación muscular y dietas saludables.",
		precio: 39.99,
		imagen:
			"https://images.unsplash.com/photo-1519864600265-abb23847ef2c?auto=format&fit=crop&w=400&q=80",
	},
	{
		nombre: "Vitaminas Complejas",
		descripcion: "Refuerza tu sistema inmune con vitaminas esenciales.",
		precio: 19.99,
		imagen:
			"https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80",
	},
	{
		nombre: "Bebida Detox",
		descripcion: "Limpia tu organismo y siente la diferencia.",
		precio: 24.99,
		imagen:
			"https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80",
	},
];

function Home2() {
	const navigate = useNavigate();
	const [showRegistro, setShowRegistro] = useState(false);
	const [showLogin, setShowLogin] = useState(false);

	function handleCardClick(producto) {
		navigate(`/producto/${encodeURIComponent(producto.nombre)}`, { state: { producto } });
	}

	function handleComprar(nombre) {
		const user = null; // Cambia esto por tu lógica real
		if (!user) {
			setShowRegistro(true);
			return;
		}
		alert(`¡Has comprado: ${nombre}!`);
	}

	function handleRegistroSuccess(user) {
		setShowRegistro(false);
		navigate("/usuario/principal2");
	}

	function handleLoginSuccess(user) {
		setShowLogin(false);
		navigate("/usuario/principal2");
	}

	return (
		<div className="home-usuario-container">
			<div className="home-usuario-bienvenida">
				<h1>¡Bienvenido/a!</h1>
				<p>
					Nos alegra tenerte aquí. Explora nuestros productos destacados,
					actualiza tu información de envío o realiza tus compras de manera fácil y
					segura.
				</p>
				<div className="home-usuario-acciones">
					<a href="/comprar" className="home-usuario-btn">
						Ir a Comprar
					</a>
					<a href="/perfil" className="home-usuario-btn-sec">
						Mi Perfil
					</a>
				</div>
			</div>

			<div
				className="productos-titulo"
				style={{ marginTop: 40, marginBottom: 10 }}
			>
				<h2>Productos Destacados</h2>
			</div>

			{/* Barra de búsqueda visual */}
			<div className="productos-searchbar">
				<input
					type="text"
					placeholder="Buscar productos..."
					disabled
				/>
				<span className="search-icon">🔍</span>
			</div>

			<div className="productos-grid">
				{productos.map((prod, i) => (
					<div
						className="producto-card"
						key={i}
						onClick={() => handleCardClick(prod)}
						style={{ cursor: "pointer" }}
					>
						<div
							className="producto-img"
							style={{ backgroundImage: `url(${prod.imagen})` }}
						/>
						<div className="producto-info" onClick={e => e.stopPropagation()}>
							<div className="producto-nombre">{prod.nombre}</div>
							<div className="producto-desc">{prod.descripcion}</div>
							<div className="producto-precio">
								${prod.precio.toFixed(2)}
							</div>
							<button
								className="producto-btn"
								onClick={e => {
									e.stopPropagation();
									handleComprar(prod.nombre);
								}}
							>
								Comprar
							</button>
						</div>
					</div>
				))}
			</div>

			{/* Modal de registro */}
			{showRegistro && (
				<div className="modal-bg">
					<div className="modal-content">
						<Registro
							onRegister={handleRegistroSuccess}
							onCancel={() => setShowRegistro(false)}
						/>
						<button
							className="home-usuario-btn-sec"
							style={{ marginTop: 16 }}
							onClick={() => {
								setShowRegistro(false);
								setShowLogin(true);
							}}
						>
							¿Ya tienes cuenta? Inicia sesión
						</button>
					</div>
				</div>
			)}

			{/* Modal de login */}
			{showLogin && (
				<div className="modal-bg">
					<div className="modal-content">
						<Login
							onLogin={handleLoginSuccess}
							onCancel={() => setShowLogin(false)}
						/>
					</div>
				</div>
			)}

			{/* --- SECCIÓN AVANZADA DE BENEFICIOS Y REDES --- */}
			<footer className="home-usuario-footer">
				<div className="footer-beneficios">
					<div className="beneficio-card">
						<span className="beneficio-icon" style={{ background: "#e3f2fd" }}>🚚</span>
						<h4>Envío Rápido</h4>
						<p>Recibe tus productos en menos de 48h en todo el país.</p>
					</div>
					<div className="beneficio-card">
						<span className="beneficio-icon" style={{ background: "#e8f5e9" }}>🔒</span>
						<h4>Compra Segura</h4>
						<p>Tus pagos y datos están protegidos con cifrado SSL.</p>
					</div>
					<div className="beneficio-card">
						<span className="beneficio-icon" style={{ background: "#fffde7" }}>⭐</span>
						<h4>Calidad Garantizada</h4>
						<p>Productos originales y seleccionados por expertos.</p>
					</div>
					<div className="beneficio-card">
						<span className="beneficio-icon" style={{ background: "#fce4ec" }}>💬</span>
						<h4>Soporte 24/7</h4>
						<p>Atención personalizada por WhatsApp y correo.</p>
					</div>
				</div>
				<div className="footer-social">
					<span>Síguenos:</span>
					<a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
						<img src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/facebook.svg" alt="Facebook" />
					</a>
					<a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
						<img src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/instagram.svg" alt="Instagram" />
					</a>
					<a href="https://wa.me/5491112345678" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
						<img src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/whatsapp.svg" alt="WhatsApp" />
					</a>
					<a href="mailto:info@tiendaazul.com" aria-label="Email">
						<img src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/gmail.svg" alt="Email" />
					</a>
				</div>
				<div className="footer-legal">
					<p>
						© {new Date().getFullYear()} Tienda Azul. Todos los derechos reservados.
						<br />
						<span style={{ fontSize: 12, opacity: 0.7 }}>
							Powered by React · Términos y condiciones · Políticas de privacidad
						</span>
					</p>
				</div>
			</footer>
		</div>
	);
}

export default Home2;