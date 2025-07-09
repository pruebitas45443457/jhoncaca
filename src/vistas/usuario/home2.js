import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import "./home2.css";
import Registro from "../auth/registro"; 
import Login from "../auth/login"; // ✅ Usa el export correcto
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase"; // ✅ Usa el export correcto

function Home2() {
	const navigate = useNavigate();
	const [showRegistro, setShowRegistro] = useState(false);
	const [showLogin, setShowLogin] = useState(false);
	const [productos, setProductos] = useState([]);
	const [loading, setLoading] = useState(true);
	
	// Estados para el buscador
	const [searchTerm, setSearchTerm] = useState("");
	const [selectedCategory, setSelectedCategory] = useState("todos");
	const [sortBy, setSortBy] = useState("nombre");
	const [priceRange, setPriceRange] = useState({ min: 0, max: Infinity });
	const [showFilters, setShowFilters] = useState(false);

	// Obtener categorías únicas de los productos
	const categorias = useMemo(() => {
		const cats = [...new Set(productos.map(p => p.categoria).filter(Boolean))];
		return ["todos", ...cats];
	}, [productos]);

	// Filtrar y ordenar productos
	const productosFiltrados = useMemo(() => {
		let filtered = productos.filter(producto => {
			// Filtro por término de búsqueda
			const matchesSearch = searchTerm === "" || 
				producto.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
				producto.descripcion?.toLowerCase().includes(searchTerm.toLowerCase()) ||
				producto.categoria?.toLowerCase().includes(searchTerm.toLowerCase());

			// Filtro por categoría
			const matchesCategory = selectedCategory === "todos" || 
				producto.categoria === selectedCategory;

			// Filtro por rango de precio
			const precio = parseFloat(producto.precio) || 0;
			const matchesPrice = precio >= priceRange.min && precio <= priceRange.max;

			return matchesSearch && matchesCategory && matchesPrice;
		});

		// Ordenar productos
		filtered.sort((a, b) => {
			switch (sortBy) {
				case "precio-asc":
					return (parseFloat(a.precio) || 0) - (parseFloat(b.precio) || 0);
				case "precio-desc":
					return (parseFloat(b.precio) || 0) - (parseFloat(a.precio) || 0);
				case "nombre":
				default:
					return (a.nombre || "").localeCompare(b.nombre || "");
			}
		});

		return filtered;
	}, [productos, searchTerm, selectedCategory, sortBy, priceRange]);

	// Función para limpiar filtros
	const clearFilters = () => {
		setSearchTerm("");
		setSelectedCategory("todos");
		setSortBy("nombre");
		setPriceRange({ min: 0, max: Infinity });
	};

	// Función para manejar cambio en rango de precio
	const handlePriceRangeChange = (min, max) => {
		setPriceRange({ min: parseFloat(min) || 0, max: parseFloat(max) || Infinity });
	};

	useEffect(() => {
		const fetchProductos = async () => {
			try {
				const productosCol = collection(db, "productos");
				const productosSnap = await getDocs(productosCol);
				const productosList = productosSnap.docs.map((doc) => ({
					id: doc.id,
					...doc.data(),
				}));
				setProductos(productosList);
			} catch (error) {
				console.error("Error al traer productos:", error);
			}
			setLoading(false);
		};
		fetchProductos();
	}, []);

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
			{/* Hero Section Dinámico */}
			<div className="hero-section">
				<div className="hero-content">
					<div className="hero-text">
						<h1 className="hero-title">
							<span className="hero-title-main">Descubre</span>
							<span className="hero-title-accent">Productos Increíbles</span>
						</h1>
						<p className="hero-subtitle">
							Encuentra exactamente lo que buscas en nuestra colección curada de productos de calidad
						</p>
					</div>
					<div className="hero-actions">
						<button 
							className="hero-btn primary"
							onClick={() => document.querySelector('.productos-searchbar input').focus()}
						>
							<span>🔍</span>
							Explorar Productos
						</button>
						<button 
							className="hero-btn secondary"
							onClick={() => setShowRegistro(true)}
						>
							<span>🚀</span>
							Comenzar
						</button>
					</div>
					<div className="hero-stats">
						<div className="stat-item">
							<span className="stat-number">{productos.length}</span>
							<span className="stat-label">Productos</span>
						</div>
						<div className="stat-item">
							<span className="stat-number">{categorias.length - 1}</span>
							<span className="stat-label">Categorías</span>
						</div>
						<div className="stat-item">
							<span className="stat-number">24/7</span>
							<span className="stat-label">Soporte</span>
						</div>
					</div>
				</div>
				<div className="hero-visual">
					<div className="floating-cards">
						{productos.slice(0, 3).map((prod, i) => (
							<div 
								key={prod.id || i} 
								className={`floating-card card-${i + 1}`}
								style={{ animationDelay: `${i * 0.2}s` }}
							>
								<div 
									className="floating-card-img"
									style={{ 
										backgroundImage: `url(${prod.imagen || "/images/placeholder.jpg"})`,
										backgroundSize: "cover",
										backgroundPosition: "center"
									}}
									onError={(e) => {
										e.target.style.backgroundImage = "url('/images/placeholder.jpg')";
									}}
								/>
								<div className="floating-card-info">
									<h4>{prod.nombre}</h4>
									<p>${prod.precio}</p>
								</div>
							</div>
						))}
					</div>
					<div className="hero-decoration">
						<div className="decoration-circle circle-1"></div>
						<div className="decoration-circle circle-2"></div>
						<div className="decoration-circle circle-3"></div>
					</div>
				</div>
			</div>

			<div className="productos-titulo">
				<h2>Productos Destacados</h2>
				<p style={{ color: "var(--text-secondary)", fontSize: "1rem", margin: "0.5rem 0" }}>
					{loading ? "Cargando..." : `${productosFiltrados.length} productos encontrados`}
				</p>
			</div>

			{/* Barra de búsqueda funcional */}
			<div className="productos-searchbar">
				<input
					type="text"
					placeholder="Buscar productos por nombre, descripción o categoría..."
					value={searchTerm}
					onChange={(e) => setSearchTerm(e.target.value)}
				/>
				<span 
					className="search-icon"
					onClick={() => setShowFilters(!showFilters)}
					style={{ cursor: "pointer" }}
					title="Filtros avanzados"
				>
					{showFilters ? "⚙️" : "🔍"}
				</span>
			</div>

			{/* Filtros avanzados */}
			{showFilters && (
				<div className="search-filters" style={{ 
					background: "white", 
					padding: "1rem", 
					borderRadius: "1rem", 
					margin: "0 auto 1.5rem auto", 
					maxWidth: "700px",
					boxShadow: "0 4px 24px #2196f322",
					border: "1.5px solid #e3f2fd"
				}}>
					<div style={{ display: "flex", flexWrap: "wrap", gap: "1rem", alignItems: "center" }}>
						{/* Filtro por categoría */}
						<div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
							<label style={{ fontSize: "0.9rem", fontWeight: "600", color: "#1565c0" }}>
								Categoría:
							</label>
							<select
								value={selectedCategory}
								onChange={(e) => setSelectedCategory(e.target.value)}
								className="filter-btn"
								style={{ padding: "0.5rem", borderRadius: "8px", border: "1px solid #e3f2fd" }}
							>
								{categorias.map(cat => (
									<option key={cat} value={cat}>
										{cat === "todos" ? "Todas las categorías" : cat}
									</option>
								))}
							</select>
						</div>

						{/* Ordenar por */}
						<div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
							<label style={{ fontSize: "0.9rem", fontWeight: "600", color: "#1565c0" }}>
								Ordenar por:
							</label>
							<select
								value={sortBy}
								onChange={(e) => setSortBy(e.target.value)}
								className="filter-btn"
								style={{ padding: "0.5rem", borderRadius: "8px", border: "1px solid #e3f2fd" }}
							>
								<option value="nombre">Nombre A-Z</option>
								<option value="precio-asc">Precio: Menor a Mayor</option>
								<option value="precio-desc">Precio: Mayor a Menor</option>
							</select>
						</div>

						{/* Rango de precio */}
						<div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
							<label style={{ fontSize: "0.9rem", fontWeight: "600", color: "#1565c0" }}>
								Precio:
							</label>
							<div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
								<input
									type="number"
									placeholder="Min"
									value={priceRange.min === 0 ? "" : priceRange.min}
									onChange={(e) => handlePriceRangeChange(e.target.value, priceRange.max)}
									style={{ 
										width: "80px", 
										padding: "0.4rem", 
										borderRadius: "6px", 
										border: "1px solid #e3f2fd",
										fontSize: "0.9rem"
									}}
								/>
								<span style={{ color: "#1565c0" }}>-</span>
								<input
									type="number"
									placeholder="Max"
									value={priceRange.max === Infinity ? "" : priceRange.max}
									onChange={(e) => handlePriceRangeChange(priceRange.min, e.target.value)}
									style={{ 
										width: "80px", 
										padding: "0.4rem", 
										borderRadius: "6px", 
										border: "1px solid #e3f2fd",
										fontSize: "0.9rem"
									}}
								/>
							</div>
						</div>

						{/* Botón limpiar filtros */}
						<button
							onClick={clearFilters}
							className="filter-btn"
							style={{ 
								background: "#f44336", 
								color: "white", 
								border: "none",
								padding: "0.5rem 1rem",
								borderRadius: "8px",
								cursor: "pointer",
								fontSize: "0.9rem",
								marginTop: "1.5rem"
							}}
						>
							Limpiar Filtros
						</button>
					</div>
				</div>
			)}

			{/* Filtros rápidos */}
			<div className="search-filters">
				{categorias.slice(1).map(categoria => (
					<button
						key={categoria}
						onClick={() => setSelectedCategory(categoria)}
						className={`filter-btn ${selectedCategory === categoria ? 'active' : ''}`}
					>
						{categoria}
					</button>
				))}
			</div>

			{/* Grid de productos filtrados */}
			<div className="productos-grid">
				{loading ? (
					// Skeleton loading
					Array.from({ length: 6 }).map((_, i) => (
						<div key={i} className="producto-card skeleton">
							<div className="producto-img" />
							<div className="producto-info">
								<div className="producto-nombre">Cargando...</div>
								<div className="producto-desc">Cargando descripción...</div>
								<div className="producto-precio">$0.00</div>
								<button className="producto-btn">Cargando</button>
							</div>
						</div>
					))
				) : productosFiltrados.length === 0 ? (
					<div style={{ 
						gridColumn: "1 / -1",
						textAlign: "center", 
						color: "#888", 
						fontSize: 18, 
						margin: "2rem auto",
						padding: "2rem",
						background: "white",
						borderRadius: "1rem",
						boxShadow: "0 4px 24px #2196f322"
					}}>
						{searchTerm || selectedCategory !== "todos" || priceRange.min > 0 || priceRange.max < Infinity ? (
							<>
								<div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🔍</div>
								<h3 style={{ color: "#1565c0", marginBottom: "0.5rem" }}>
									No se encontraron productos
								</h3>
								<p>Intenta ajustar tus filtros de búsqueda</p>
								<button
									onClick={clearFilters}
									className="home-usuario-btn"
									style={{ marginTop: "1rem" }}
								>
									Limpiar Filtros
								</button>
							</>
						) : (
							<>
								<div style={{ fontSize: "3rem", marginBottom: "1rem" }}>📦</div>
								<h3 style={{ color: "#1565c0" }}>No hay productos disponibles</h3>
							</>
						)}
					</div>
				) : (
					productosFiltrados.map((prod, i) => (
						<div
							className="producto-card"
							key={prod.id || i}
							onClick={() => handleCardClick(prod)}
							style={{ 
								cursor: "pointer",
								"--animation-order": i
							}}
						>
							<div
								className="producto-img"
								style={{ 
									backgroundImage: `url(${prod.imagen || ""})`,
									backgroundSize: "cover",
									backgroundPosition: "center",
									backgroundColor: "#f5f5f5"
								}}
							>
								{prod.categoria && (
									<div style={{
										position: "absolute",
										top: "0.5rem",
										left: "0.5rem",
										background: "rgba(33, 150, 243, 0.9)",
										color: "white",
										padding: "0.2rem 0.5rem",
										borderRadius: "12px",
										fontSize: "0.8rem",
										fontWeight: "600"
									}}>
										{prod.categoria}
									</div>
								)}
							</div>
							<div className="producto-info" onClick={e => e.stopPropagation()}>
								<div className="producto-nombre">{prod.nombre}</div>
								<div className="producto-desc">{prod.descripcion}</div>
								<div className="producto-precio">
									${prod.precio?.toFixed ? prod.precio.toFixed(2) : prod.precio}
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
					))
				)}
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
				<div className="footer-beneficios" id="beneficios">
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
				<div className="footer-social" id="contacto">
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