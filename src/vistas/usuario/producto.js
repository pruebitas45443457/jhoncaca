import React, { useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import "./home2.css";

// Simula tus productos (puedes importar desde un archivo común si lo prefieres)
const productos = [
	{
		nombre: "Suplemento Premium",
		descripcion:
			"Mejora tu energía y bienestar con ingredientes naturales.",
		precio: 29.99,
		imagen:
			"https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80",
		caracteristicas: [
			"100% natural",
			"Sin gluten",
			"Apto veganos",
			"Presentación: 60 cápsulas",
		],
		calificacion: 4.7,
		opiniones: 123,
		diasHabiles: "2 a 5 días hábiles",
		mediosPago: [
			"💳 Tarjeta",
			"💸 Transferencia",
			"🪙 Efectivo",
			"🟦 MercadoPago",
		],
	},
	{
		nombre: "Proteína Vegana",
		descripcion:
			"Ideal para recuperación muscular y dietas saludables.",
		precio: 39.99,
		imagen:
			"https://images.unsplash.com/photo-1519864600265-abb23847ef2c?auto=format&fit=crop&w=400&q=80",
		caracteristicas: [
			"Sabor chocolate",
			"Sin lactosa",
			"1kg por envase",
			"25g proteína por porción",
		],
		calificacion: 4.5,
		opiniones: 87,
		diasHabiles: "3 a 6 días hábiles",
		mediosPago: ["💳 Tarjeta", "🟦 MercadoPago"],
	},
	{
		nombre: "Vitaminas Complejas",
		descripcion:
			"Refuerza tu sistema inmune con vitaminas esenciales.",
		precio: 19.99,
		imagen:
			"https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80",
		caracteristicas: [
			"Complejo B, C y D",
			"Frasco con 90 tabletas",
			"Apto para toda la familia",
		],
		calificacion: 4.8,
		opiniones: 201,
		diasHabiles: "2 a 4 días hábiles",
		mediosPago: [
			"💳 Tarjeta",
			"💸 Transferencia",
			"🟦 MercadoPago",
		],
	},
	{
		nombre: "Bebida Detox",
		descripcion: "Limpia tu organismo y siente la diferencia.",
		precio: 24.99,
		imagen:
			"https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=400&q=80",
		caracteristicas: [
			"Botella 500ml",
			"Sabor limón y menta",
			"Sin azúcar añadida",
		],
		calificacion: 4.3,
		opiniones: 54,
		diasHabiles: "3 a 7 días hábiles",
		mediosPago: [
			"💳 Tarjeta",
			"💸 Transferencia",
			"🪙 Efectivo",
		],
	},
];

function Producto() {
	const location = useLocation();
	const navigate = useNavigate();
	const { nombre } = useParams();
	const [comprado, setComprado] = useState(false);

	// Busca el producto por nombre en la URL o en el estado
	let producto = location.state?.producto;
	if (!producto && nombre) {
		producto = productos.find(
			(p) =>
				p.nombre.toLowerCase() ===
				decodeURIComponent(nombre).toLowerCase()
		);
	}

	if (!producto) {
		return (
			<div className="home-usuario-container">
				<div className="home-usuario-bienvenida">
					<h1>Producto no encontrado</h1>
					<button
						className="home-usuario-btn"
						onClick={() => navigate(-1)}
					>
						Volver
					</button>
				</div>
			</div>
		);
	}

	function handleComprar() {
		// Aquí deberías validar usuario logueado
		setComprado(true);
		setTimeout(() => setComprado(false), 2500);
	}

	return (
		<div
			className="home-usuario-container"
			style={{
				minHeight: "100vh",
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
			}}
		>
			<div
				style={{
					background: "#fff",
					borderRadius: "1.5rem",
					boxShadow: "0 4px 24px #2196f322",
					padding: "2.5rem 2rem",
					maxWidth: 900,
					width: "100%",
					display: "flex",
					gap: 36,
					alignItems: "flex-start",
					margin: "2rem 0",
				}}
			>
				{/* Imagen del producto */}
				<div style={{ flex: "0 0 320px", maxWidth: 320 }}>
					<img
						src={producto.imagen}
						alt={producto.nombre}
						style={{
							width: "100%",
							borderRadius: "1.2rem",
							marginBottom: "1.2rem",
							maxHeight: 320,
							objectFit: "cover",
							boxShadow: "0 2px 16px #2196f322",
						}}
					/>
					<div
						style={{
							marginTop: 16,
							color: "#1565c0",
							fontWeight: 600,
						}}
					>
						<span
							style={{
								fontSize: 22,
								color: "#2196f3",
							}}
						>
							★ {producto.calificacion}
						</span>
						<span
							style={{
								marginLeft: 8,
								fontSize: 15,
								color: "#1976d2",
							}}
						>
							({producto.opiniones} opiniones)
						</span>
					</div>
				</div>

				{/* Info y acciones */}
				<div style={{ flex: 1, minWidth: 0 }}>
					<h1
						style={{
							color: "#2196f3",
							fontWeight: 900,
							fontSize: "2rem",
							marginBottom: 8,
						}}
					>
						{producto.nombre}
					</h1>
					<div
						style={{
							color: "#1976d2",
							fontSize: "1.13rem",
							marginBottom: 18,
						}}
					>
						{producto.descripcion}
					</div>
					<ul
						style={{
							paddingLeft: 18,
							marginBottom: 18,
							color: "#1565c0",
						}}
					>
						{producto.caracteristicas?.map((c, i) => (
							<li key={i} style={{ marginBottom: 4 }}>
								{c}
							</li>
						))}
					</ul>
					<div
						style={{
							fontSize: "1.35rem",
							fontWeight: 800,
							color: "#0d47a1",
							marginBottom: 18,
						}}
					>
						${producto.precio.toFixed(2)}
					</div>
					<button
						className="producto-btn"
						style={{ width: 220, marginBottom: 18 }}
						onClick={handleComprar}
						disabled={comprado}
					>
						{comprado ? "¡Gracias por tu compra!" : "Comprar"}
					</button>
					<div style={{ marginBottom: 18 }}>
						<b>Métodos de pago:</b>
						<div
							style={{
								marginTop: 6,
								display: "flex",
								gap: 10,
								flexWrap: "wrap",
							}}
						>
							{producto.mediosPago?.map((m, i) => (
								<span
									key={i}
									style={{
										background: "#e3f2fd",
										color: "#1565c0",
										borderRadius: "1rem",
										padding: "0.3rem 1rem",
										fontSize: 15,
										fontWeight: 600,
									}}
								>
									{m}
								</span>
							))}
						</div>
					</div>
					<div style={{ marginBottom: 18 }}>
						<b>Días hábiles de entrega:</b>{" "}
						<span style={{ color: "#2196f3" }}>
							{producto.diasHabiles}
						</span>
					</div>
					<div style={{ marginBottom: 18 }}>
						<b>¿Cómo calificarías este producto?</b>
						<div style={{ marginTop: 6 }}>
							{[1, 2, 3, 4, 5].map((n) => (
								<span
									key={n}
									style={{
										fontSize: 26,
										color: "#ffd600",
										cursor: "pointer",
									}}
								>
									★
								</span>
							))}
						</div>
					</div>
					<button
						className="home-usuario-btn-sec"
						style={{ marginTop: 12 }}
						onClick={() => navigate(-1)}
					>
						Volver
					</button>
				</div>
			</div>
		</div>
	);
}

export default Producto;