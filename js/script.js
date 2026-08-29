/* =========================================================
   PELDAÑO — script principal
   1. Header con sombra al hacer scroll + menú móvil
   2. Portada dinámica (slider automático de 3 imágenes)
   3. Catálogo de productos generado dinámicamente + filtros
   4. Formulario de contacto con validación
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  initHeader();
  initHeroSlider();
  initProductCatalog();
  initContactForm();
  document.getElementById("year").textContent = new Date().getFullYear();
});

/* ---------------------------------------------------------
   1. HEADER
--------------------------------------------------------- */
function initHeader() {
  const header = document.getElementById("siteHeader");
  const toggle = document.getElementById("navToggle");
  const nav = document.getElementById("mainNav");

  const onScroll = () => {
    header.classList.toggle("is-scrolled", window.scrollY > 40);
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  toggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(isOpen));
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      nav.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
    });
  });
}

/* ---------------------------------------------------------
   2. PORTADA DINÁMICA — slider automático
--------------------------------------------------------- */
function initHeroSlider() {
  const slides = document.querySelectorAll(".hero-slide");
  const dots = document.querySelectorAll(".hero-dot");
  if (!slides.length) return;

  let current = 0;
  const intervalMs = 4500;
  let timer = null;

  function goTo(index) {
    slides[current].classList.remove("is-active");
    dots[current]?.classList.remove("is-active");
    current = (index + slides.length) % slides.length;
    slides[current].classList.add("is-active");
    dots[current]?.classList.add("is-active");
  }

  function next() { goTo(current + 1); }

  function start() {
    timer = setInterval(next, intervalMs);
  }
  function stop() {
    clearInterval(timer);
  }

  dots.forEach((dot, i) => {
    dot.addEventListener("click", () => {
      goTo(i);
      stop();
      start();
    });
  });

  start();
}

/* ---------------------------------------------------------
   3. CATÁLOGO DE PRODUCTOS — datos + render dinámico
--------------------------------------------------------- */
const PRODUCTS = [
  {
    id: "p1",
    name: "Estuche Roble Clásico",
    category: "madera",
    price: 89000,
    desc: "Protector en madera de roble sellada, ideal para escaleras interiores de alto tránsito.",
    tag: "Best seller",
    img: "https://images.unsplash.com/photo-1615873968403-89e068629265?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "p2",
    name: "Estuche Aluminio Line",
    category: "metal",
    price: 76000,
    desc: "Perfil de aluminio anodizado con borde antideslizante, ligero y muy resistente.",
    tag: "Nuevo",
    img: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "p3",
    name: "Estuche Exterior Grip",
    category: "exterior",
    price: 98000,
    desc: "Caucho técnico de alta fricción, resistente a la intemperie para escaleras exteriores.",
    tag: "Resistente",
    img: "https://images.unsplash.com/photo-1600566752734-2a0cd66d6b46?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "p4",
    name: "Estuche Nogal Premium",
    category: "madera",
    price: 129000,
    desc: "Acabado en nogal natural con laca mate, pensado para escaleras a la vista.",
    tag: "Premium",
    img: "https://images.unsplash.com/photo-1505692433770-1586ba93d5a3?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "p5",
    name: "Estuche Metal Industrial",
    category: "metal",
    price: 82000,
    desc: "Placa de acero galvanizado, diseñado para escaleras de bodegas y locales comerciales.",
    tag: "Industrial",
    img: "https://images.unsplash.com/photo-1571512564751-c1e26e07d3cf?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "p6",
    name: "Estuche Terraza Outdoor",
    category: "exterior",
    price: 94000,
    desc: "Compuesto WPC resistente a la humedad, ideal para escaleras de terraza o jardín.",
    tag: "Exterior",
    img: "https://images.unsplash.com/photo-1600607687644-c7171b42498f?auto=format&fit=crop&w=600&q=80",
  },
];

const priceFormatter = new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP",
  maximumFractionDigits: 0,
});

function initProductCatalog() {
  const grid = document.getElementById("productGrid");
  const filters = document.getElementById("portfolioFilters");
  if (!grid) return;

  function render(filter) {
    const items = filter === "todos" ? PRODUCTS : PRODUCTS.filter((p) => p.category === filter);

    grid.innerHTML = "";

    if (!items.length) {
      grid.innerHTML = `<p class="portfolio-empty">Aún no hay estuches en esta categoría.</p>`;
      return;
    }

    items.forEach((product) => {
      const card = document.createElement("article");
      card.className = "product-card";
      card.innerHTML = `
        <div class="product-media">
          <span class="product-tag">${product.tag}</span>
          <img src="${product.img}" alt="${product.name}" loading="lazy">
        </div>
        <div class="product-body">
          <h3 class="product-name">${product.name}</h3>
          <p class="product-desc">${product.desc}</p>
          <div class="product-footer">
            <span class="product-price">${priceFormatter.format(product.price)}</span>
            <a href="#contacto" class="product-cta">Solicitar</a>
          </div>
        </div>
      `;
      grid.appendChild(card);
    });
  }

  render("todos");

  filters.addEventListener("click", (e) => {
    const btn = e.target.closest(".filter-btn");
    if (!btn) return;
    filters.querySelectorAll(".filter-btn").forEach((b) => b.classList.remove("is-active"));
    btn.classList.add("is-active");
    render(btn.dataset.filter);
  });
}

/* ---------------------------------------------------------
   4. FORMULARIO DE CONTACTO
--------------------------------------------------------- */
function initContactForm() {
  const form = document.getElementById("contactForm");
  if (!form) return;
  const status = document.getElementById("formStatus");

  const validators = {
    nombre: (v) => v.trim().length >= 3 || "Escribe tu nombre completo.",
    email: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || "Ingresa un correo válido.",
    telefono: (v) => /^[0-9\s+()-]{7,15}$/.test(v) || "Ingresa un teléfono válido.",
    mensaje: (v) => v.trim().length >= 10 || "Cuéntanos un poco más (mín. 10 caracteres).",
  };

  function validateField(field) {
    const input = form.elements[field];
    const errorEl = document.getElementById(`err-${field}`);
    const result = validators[field](input.value);

    if (result === true) {
      input.classList.remove("is-invalid");
      errorEl.textContent = "";
      return true;
    }
    input.classList.add("is-invalid");
    errorEl.textContent = result;
    return false;
  }

  Object.keys(validators).forEach((field) => {
    form.elements[field].addEventListener("blur", () => validateField(field));
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const fields = Object.keys(validators);
    const allValid = fields.map(validateField).every(Boolean);

    if (!allValid) {
      status.textContent = "Revisa los campos marcados en rojo.";
      status.classList.remove("is-success");
      return;
    }

    // Aquí se integraría un envío real (fetch a un backend, servicio de email, etc.)
    const nombre = form.elements["nombre"].value.trim().split(" ")[0];
    status.textContent = `¡Gracias, ${nombre}! Recibimos tu solicitud y te contactaremos pronto.`;
    status.classList.add("is-success");
    form.reset();
  });
}
