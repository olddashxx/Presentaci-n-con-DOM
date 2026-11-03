// =========================================================
// SCRIPT PRINCIPAL DEL PORTAFOLIO - GABRIEL GARAY (DOM PURO)
// =========================================================

document.addEventListener('DOMContentLoaded', () => {
  inicializarTema();
  inicializarMenuHamburguesa();
  inicializarHamburguesasSeccion();
  inicializarDobleSeleccionMusica();
  inicializarFiltrosMultinivel();
  inicializarFormularioContacto();
});

// ==========================================
// EJEMPLO 1: Modo Claro / Modo Oscuro (con persistencia)
// ==========================================
function inicializarTema() {
  const themeBtn = document.getElementById('themeBtn');
  const themeIcon = document.getElementById('themeIcon');
  const themeText = document.getElementById('themeText');

  const actualizarUI = (esLuz) => {
    if (!themeIcon || !themeText) return;
    if (esLuz) {
      themeIcon.className = 'bi bi-moon-fill';
      themeText.textContent = 'Modo Oscuro';
    } else {
      themeIcon.className = 'bi bi-sun-fill';
      themeText.textContent = 'Modo Claro';
    }
  };

  // Cargar preferencia guardada
  const temaGuardado = localStorage.getItem('gabriel_theme');
  if (temaGuardado === 'light') {
    document.body.classList.add('light-mode');
    actualizarUI(true);
  } else {
    actualizarUI(false);
  }

  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      document.body.classList.toggle('light-mode');
      const esLuz = document.body.classList.contains('light-mode');
      localStorage.setItem('gabriel_theme', esLuz ? 'light' : 'dark');
      actualizarUI(esLuz);
    });
  }
}

// ==========================================
// EJEMPLO 3: Menú Hamburguesa DOM Permanente
// ==========================================
function inicializarMenuHamburguesa() {
  const burguerBtn = document.getElementById('burguerBtn');
  const navMenu = document.getElementById('navMenu');

  if (burguerBtn && navMenu) {
    burguerBtn.addEventListener('click', () => {
      navMenu.classList.toggle('show');
    });
  }
}

function cerrarMenu() {
  const navMenu = document.getElementById('navMenu');
  if (navMenu) {
    navMenu.classList.remove('show');
  }
}
window.cerrarMenu = cerrarMenu;

// ==========================================
// REQUISITO 2 DOCENTE: Menú Hamburguesa en cada Sección (Diseño Minimalista y Plegable)
// ==========================================
function actualizarEstadoSeccion(targetContent, headerWrap, btn, colapsar) {
  if (!targetContent) return;

  if (colapsar) {
    targetContent.classList.add('is-collapsed');
    if (headerWrap) headerWrap.classList.add('is-collapsed');
    if (btn) btn.classList.add('is-collapsed');
  } else {
    targetContent.classList.remove('is-collapsed');
    if (headerWrap) headerWrap.classList.remove('is-collapsed');
    if (btn) btn.classList.remove('is-collapsed');
  }

  const estaColapsado = targetContent.classList.contains('is-collapsed');

  if (btn) {
    const textEl = btn.querySelector('.burger-text');
    const iconEl = btn.querySelector('i');
    if (estaColapsado) {
      if (textEl) textEl.textContent = 'Desplegar';
      if (iconEl) iconEl.className = 'bi bi-arrows-expand';
    } else {
      if (textEl) textEl.textContent = 'Plegar';
      if (iconEl) iconEl.className = 'bi bi-arrows-collapse';
    }
  }

  if (headerWrap) {
    const hintEl = headerWrap.querySelector('.badge-collapse-hint');
    if (hintEl) {
      hintEl.innerHTML = estaColapsado
        ? '<i class="bi bi-arrows-expand me-1"></i>Clic para desplegar'
        : '<i class="bi bi-arrows-collapse me-1"></i>Clic para plegar';
    }
  }
}

function inicializarHamburguesasSeccion() {
  const headerWraps = document.querySelectorAll('.section-header-wrap');

  headerWraps.forEach(headerWrap => {
    headerWrap.addEventListener('click', (e) => {
      // Ignorar si el clic fue en un enlace <a> (como "Ver en página dedicada")
      if (e.target.closest('a')) return;

      const targetSelector = headerWrap.getAttribute('data-section-target');
      if (!targetSelector) return;

      const targetContent = document.querySelector(targetSelector);
      if (!targetContent) return;

      const btn = headerWrap.querySelector('.section-burger-btn');
      const actualmenteColapsado = targetContent.classList.contains('is-collapsed');
      actualizarEstadoSeccion(targetContent, headerWrap, btn, !actualmenteColapsado);
    });
  });

  // Botones globales de Desplegar Todo y Plegar Todo
  const btnDesplegarTodo = document.getElementById('btnDesplegarTodo');
  const btnPlegarTodo = document.getElementById('btnPlegarTodo');

  if (btnDesplegarTodo) {
    btnDesplegarTodo.addEventListener('click', () => {
      document.querySelectorAll('.section-header-wrap').forEach(hw => {
        const targetSelector = hw.getAttribute('data-section-target');
        if (targetSelector) {
          const content = document.querySelector(targetSelector);
          const btn = hw.querySelector('.section-burger-btn');
          actualizarEstadoSeccion(content, hw, btn, false);
        }
      });
    });
  }

  if (btnPlegarTodo) {
    btnPlegarTodo.addEventListener('click', () => {
      document.querySelectorAll('.section-header-wrap').forEach(hw => {
        const targetSelector = hw.getAttribute('data-section-target');
        if (targetSelector) {
          const content = document.querySelector(targetSelector);
          const btn = hw.querySelector('.section-burger-btn');
          actualizarEstadoSeccion(content, hw, btn, true);
        }
      });
    });
  }

  // Auto-desplegar sección si se hace clic en enlaces de navegación interna (#contacto, #proyectos, etc.)
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', () => {
      const hash = link.getAttribute('href');
      if (!hash || hash === '#') return;
      const targetSec = document.querySelector(hash);
      if (targetSec) {
        const content = targetSec.querySelector('.section-collapsible-content');
        const hw = targetSec.querySelector('.section-header-wrap');
        const btn = targetSec.querySelector('.section-burger-btn');
        if (content && content.classList.contains('is-collapsed')) {
          actualizarEstadoSeccion(content, hw, btn, false);
        }
      }
    });
  });
}
window.inicializarHamburguesasSeccion = inicializarHamburguesasSeccion;

// ==========================================
// REQUISITO 1 DOCENTE: Doble Selección (Música: Romántica [Chayanne, Ricardo Arjona])
// ==========================================
const datosMusicaDobleSeleccion = {
  romantica: {
    nombre: "Romántica",
    artistas: [
      {
        id: "chayanne",
        nombre: "Chayanne",
        canciones: "Dejaría Todo • Torero • Un Siglo Sin Ti • Y Tú Te Vas",
        descripcion: "Ícono absoluto del pop latino y la balada romántica. Con décadas de trayectoria, sus letras apasionadas y energía escénica han marcado a generaciones enteras de oyentes en toda Latinoamérica.",
        imagen: "https://is1-ssl.mzstatic.com/image/thumb/Music114/v4/45/eb/eb/45ebebe8-8eab-ccdc-e610-0b029b02ceb3/mzi.flmctplg.jpg/400x400bb.jpg",
        tags: ["Romántica Clásica", "Balada Pop", "Latino"]
      },
      {
        id: "arjona",
        nombre: "Ricardo Arjona",
        canciones: "Historia de Taxi • Fuiste Tú • El Problema • Señora de las Cuatro Décadas",
        descripcion: "Cantautor y poeta guatemalteco célebre por su lírica introspectiva, narrativas urbanas de desamor y reflexiones profundas en formato de trova acústica y balada.",
        imagen: "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/1c/5d/9c/1c5d9cd7-465f-4625-1597-d041edaf7070/823375476696_Cover.jpg/400x400bb.jpg",
        tags: ["Trova Romántica", "Poesía Urbana", "Balada"]
      }
    ]
  },
  indie: {
    nombre: "Indie / Dream Pop",
    artistas: [
      {
        id: "cuco",
        nombre: "Cuco",
        canciones: "Lover Is a Day • Hydrocodone • Bossa No Sé • Amor de Siempre",
        descripcion: "Pionero del bedroom pop y dream pop bilingüe. Atmósferas vintage, sintetizadores melancólicos y trompetas suaves perfectas para concentrarse programando.",
        imagen: "https://is1-ssl.mzstatic.com/image/thumb/Music112/v4/75/cc/b7/75ccb720-1e2f-37c2-4b6c-a91dddcaf872/22UMGIM34482.rgb.jpg/400x400bb.jpg",
        tags: ["Dream Pop", "BedRoom Pop", "Para Programar"]
      },
      {
        id: "mac-demarco",
        nombre: "Mac DeMarco",
        canciones: "Chamber of Reflection • My Kind of Woman • Salad Days",
        descripcion: "Guitarras analógicas con efecto chorus y ritmos slacker rock relajados que brindan calma ideal tras largas horas de código y universidad.",
        imagen: "https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/e0/04/eb/e004eb2b-754f-4a76-9ecc-87d4eea2a327/cover.jpg/400x400bb.jpg",
        tags: ["Slacker Rock", "Indie Chill", "Relajación"]
      }
    ]
  },
  rock: {
    nombre: "Rock en Español / Clásico",
    artistas: [
      {
        id: "soda",
        nombre: "Soda Stereo / Gustavo Cerati",
        canciones: "De Música Ligera • Trátame Suavemente • Crimen • Puente",
        descripcion: "La banda más influyente del rock hispanoamericano. Guitarras envolventes, vanguardia sonora y poesía que inspiran creatividad estructural.",
        imagen: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=400&q=80",
        tags: ["Rock Latino", "Clásicos", "Guitarras"]
      }
    ]
  },
  gym: {
    nombre: "Gym / Phonk & Energía",
    artistas: [
      {
        id: "phonk",
        nombre: "Gym Phonk & Heavy Beats",
        canciones: "Kordhell • Ghostemane • DVRST • Metamorphosis",
        descripcion: "Ritmos de alto BPM, bajos profundos y distorsión que elevan la adrenalina y concentración durante mis 6 días de fuerza en el gimnasio.",
        imagen: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=400&q=80",
        tags: ["Entrenamiento Pesado", "Fuerza 6 Días", "Alta Intensidad"]
      }
    ]
  }
};

function inicializarDobleSeleccionMusica() {
  const selectGenero = document.getElementById('selectGenero');
  const selectArtista = document.getElementById('selectArtista');
  const resultadoBox = document.getElementById('resultadoDobleSeleccion');

  if (!selectGenero || !selectArtista) return;

  // Evento al cambiar Género (Primer Select)
  selectGenero.addEventListener('change', () => {
    const generoSeleccionado = selectGenero.value;

    // Resetear el segundo select con manipulación del DOM
    selectArtista.innerHTML = '';
    
    if (!generoSeleccionado || !datosMusicaDobleSeleccion[generoSeleccionado]) {
      selectArtista.disabled = true;
      const optDefault = document.createElement('option');
      optDefault.value = '';
      optDefault.textContent = '-- Primero elige un género arriba --';
      selectArtista.appendChild(optDefault);
      if (resultadoBox) {
        resultadoBox.style.display = 'none';
        resultadoBox.innerHTML = '';
      }
      return;
    }

    // Poblar el segundo select mediante createElement del DOM
    selectArtista.disabled = false;
    const optPrompt = document.createElement('option');
    optPrompt.value = '';
    optPrompt.textContent = `-- Selecciona un artista de ${datosMusicaDobleSeleccion[generoSeleccionado].nombre} --`;
    selectArtista.appendChild(optPrompt);

    const listaArtistas = datosMusicaDobleSeleccion[generoSeleccionado].artistas;
    listaArtistas.forEach(art => {
      const option = document.createElement('option');
      option.value = art.id;
      option.textContent = `${art.nombre} (${art.tags[0]})`;
      selectArtista.appendChild(option);
    });

    if (resultadoBox) {
      resultadoBox.style.display = 'none';
      resultadoBox.innerHTML = '';
    }
  });

  // Evento al cambiar Artista (Segundo Select - Doble Selección)
  selectArtista.addEventListener('change', () => {
    const generoSeleccionado = selectGenero.value;
    const artistaId = selectArtista.value;

    if (!resultadoBox) return;

    if (!generoSeleccionado || !artistaId || !datosMusicaDobleSeleccion[generoSeleccionado]) {
      resultadoBox.style.display = 'none';
      resultadoBox.innerHTML = '';
      return;
    }

    const artistaData = datosMusicaDobleSeleccion[generoSeleccionado].artistas.find(a => a.id === artistaId);
    if (!artistaData) return;

    // Renderizar tarjeta reactiva en el DOM
    resultadoBox.style.display = 'block';
    resultadoBox.innerHTML = `
      <div class="doble-seleccion-result">
        <div class="d-flex flex-column flex-md-row gap-3 align-items-center align-items-md-start">
          <img src="${artistaData.imagen}" alt="${artistaData.nombre}" class="result-artist-cover">
          <div class="flex-grow-1 text-center text-md-start">
            <div class="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-2">
              <h4 class="card-title m-0 text-cyan"><i class="bi bi-disc me-2"></i>${artistaData.nombre}</h4>
              <span class="badge badge-highlight text-uppercase">Doble Selección Activa</span>
            </div>
            <p class="text-warning fw-semibold small mb-2"><i class="bi bi-music-note-beamed me-1"></i>Éxitos representativos: ${artistaData.canciones}</p>
            <p class="card-text small mb-3">${artistaData.descripcion}</p>
            <div class="d-flex gap-2 flex-wrap justify-content-center justify-content-md-start">
              ${artistaData.tags.map(t => `<span class="badge badge-tech">${t}</span>`).join('')}
            </div>
          </div>
        </div>
      </div>
    `;
  });
}
window.inicializarDobleSeleccionMusica = inicializarDobleSeleccionMusica;

// ==========================================
// EJEMPLO 2 (AMPLIADO): Sistema de Filtrado Multinivel
// Aplicado a Proyectos, Pasatiempos, Intereses, Juegos y Música
// ==========================================
const estadoFiltros = {};

function inicializarFiltrosMultinivel() {
  const secciones = document.querySelectorAll('[data-filter-section]');

  secciones.forEach(seccion => {
    const sectionId = seccion.getAttribute('data-filter-section');
    estadoFiltros[sectionId] = {
      nivel1: 'todos',
      nivel2: 'todos',
      busqueda: ''
    };

    // Botones Nivel 1
    const botonesN1 = seccion.querySelectorAll('[data-filter-level="1"]');
    botonesN1.forEach(btn => {
      btn.addEventListener('click', () => {
        botonesN1.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        estadoFiltros[sectionId].nivel1 = btn.getAttribute('data-filter-value');
        aplicarFiltroSeccion(seccion, sectionId);
      });
    });

    // Botones Nivel 2
    const botonesN2 = seccion.querySelectorAll('[data-filter-level="2"]');
    botonesN2.forEach(btn => {
      btn.addEventListener('click', () => {
        botonesN2.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        estadoFiltros[sectionId].nivel2 = btn.getAttribute('data-filter-value');
        aplicarFiltroSeccion(seccion, sectionId);
      });
    });

    // Botón restablecer filtros
    const btnReset = seccion.querySelector('[data-filter-reset]');
    if (btnReset) {
      btnReset.addEventListener('click', () => {
        estadoFiltros[sectionId] = { nivel1: 'todos', nivel2: 'todos' };
        botonesN1.forEach((b, idx) => b.classList.toggle('active', idx === 0));
        botonesN2.forEach((b, idx) => b.classList.toggle('active', idx === 0));
        aplicarFiltroSeccion(seccion, sectionId);
      });
    }

    // Inicializar conteo
    aplicarFiltroSeccion(seccion, sectionId);
  });
}

function aplicarFiltroSeccion(seccion, sectionId) {
  const { nivel1, nivel2 } = estadoFiltros[sectionId];
  const items = seccion.querySelectorAll('[data-item-filtrable]');
  const contadorEl = seccion.querySelector('[data-filter-count]');
  const vacioEl = seccion.querySelector('[data-filter-empty]');

  let visibles = 0;

  items.forEach(item => {
    const itemN1 = (item.getAttribute('data-nivel1') || item.getAttribute('data-categoria') || '').toLowerCase();
    const itemN2 = (item.getAttribute('data-nivel2') || '').toLowerCase();

    const coincideN1 = nivel1 === 'todos' || itemN1.split(' ').includes(nivel1);
    const coincideN2 = nivel2 === 'todos' || itemN2.split(' ').includes(nivel2);

    if (coincideN1 && coincideN2) {
      item.style.display = '';
      visibles++;
    } else {
      item.style.display = 'none';
    }
  });

  if (contadorEl) {
    contadorEl.textContent = `Mostrando ${visibles} de ${items.length}`;
  }

  if (vacioEl) {
    vacioEl.style.display = visibles === 0 ? 'block' : 'none';
  }
}

// Función compatible con llamadas directas onclick="filtrarJuegos(...)"
function filtrarJuegos(categoria, botonActivo) {
  const seccionJuegos = document.querySelector('[data-filter-section="juegos"]');
  if (seccionJuegos && botonActivo) {
    botonActivo.click();
  }
}
window.filtrarJuegos = filtrarJuegos;

// ==========================================
// REQUISITO 4 DOCENTE: Formulario con Todas las Validaciones
// ==========================================
function inicializarFormularioContacto() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  const nombreInput = document.getElementById('nombre');
  const fechaInput = document.getElementById('fecha');
  const celularInput = document.getElementById('celular');
  const carreraSelect = document.getElementById('carrera');
  const semestreInput = document.getElementById('semestre');
  const submitBtn = document.getElementById('submitBtn');
  const alertaBox = document.getElementById('alertaBox');

  // Asegurar que el botón esté activo para permitir validar al hacer clic
  if (submitBtn) {
    submitBtn.disabled = false;
  }

  function aplicarFeedback(input, idError, idVal, esValido, mensajeError, mensajeValido) {
    const errorEl = document.getElementById(idError);
    const valEl = document.getElementById(idVal);

    if (esValido) {
      input.classList.remove('input-invalido', 'is-invalid');
      input.classList.add('input-valido', 'is-valid');
      if (errorEl) errorEl.innerHTML = '';
      if (valEl) valEl.innerHTML = `<i class="bi bi-check-circle-fill"></i> ${mensajeValido}`;
    } else {
      input.classList.remove('input-valido', 'is-valid');
      input.classList.add('input-invalido', 'is-invalid');
      if (valEl) valEl.innerHTML = '';
      if (errorEl) errorEl.innerHTML = `<i class="bi bi-exclamation-circle-fill"></i> ${mensajeError}`;
    }
  }

  // 1. Nombre Completo
  function validarNombre(mostrarFeedback = true) {
    const val = nombreInput ? nombreInput.value.trim() : '';
    let valido = true;
    let mensaje = '';

    if (!val) {
      valido = false;
      mensaje = 'El nombre completo es obligatorio.';
    } else if (val.length < 3) {
      valido = false;
      mensaje = `Debe tener al menos 3 caracteres (actual: ${val.length}).`;
    } else if (val.length > 60) {
      valido = false;
      mensaje = 'El nombre no puede exceder los 60 caracteres.';
    } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s\.]+$/.test(val)) {
      valido = false;
      mensaje = 'Solo se admiten letras y espacios (sin números ni símbolos extraños).';
    }

    if (mostrarFeedback && nombreInput) {
      aplicarFeedback(nombreInput, 'err-nombre', 'val-nombre', valido, mensaje, 'Nombre verificado');
    }
    return valido;
  }

  // 2. Fecha de Registro
  function validarFecha(mostrarFeedback = true) {
    const val = fechaInput ? fechaInput.value : '';
    let valido = true;
    let mensaje = '';

    if (!val) {
      valido = false;
      mensaje = 'Debes seleccionar una fecha de registro en el calendario.';
    } else {
      const anio = parseInt(val.split('-')[0], 10);
      if (isNaN(anio) || anio < 1980 || anio > 2035) {
        valido = false;
        mensaje = 'Selecciona una fecha válida con año realista.';
      }
    }

    if (mostrarFeedback && fechaInput) {
      aplicarFeedback(fechaInput, 'err-fecha', 'val-fecha', valido, mensaje, 'Fecha confirmada');
    }
    return valido;
  }

  // 3. Celular (8 dígitos - Bolivia)
  function validarCelular(mostrarFeedback = true) {
    const val = celularInput ? celularInput.value.trim() : '';
    let valido = true;
    let mensaje = '';

    if (!val) {
      valido = false;
      mensaje = 'El número de celular es obligatorio.';
    } else if (!/^\d+$/.test(val)) {
      valido = false;
      mensaje = 'Solo se permiten dígitos numéricos (sin letras ni guiones).';
    } else if (val.length !== 8) {
      valido = false;
      mensaje = `Debe contener exactamente 8 dígitos bolivianos (actual: ${val.length}).`;
    } else if (!/^[67]/.test(val)) {
      valido = false;
      mensaje = 'En Bolivia los números celulares inician con 6 o 7 (ej. 60120550).';
    }

    if (mostrarFeedback && celularInput) {
      aplicarFeedback(celularInput, 'err-celular', 'val-celular', valido, mensaje, 'Celular boliviano válido (+591)');
    }
    return valido;
  }

  // 4. Carrera Universitaria
  function validarCarrera(mostrarFeedback = true) {
    const val = carreraSelect ? carreraSelect.value : '';
    let valido = true;
    let mensaje = '';

    if (!val) {
      valido = false;
      mensaje = 'Por favor selecciona tu carrera universitaria de la lista desplegable.';
    }

    if (mostrarFeedback && carreraSelect) {
      aplicarFeedback(carreraSelect, 'err-carrera', 'val-carrera', valido, mensaje, `Carrera seleccionada: ${val}`);
    }
    return valido;
  }

  // 5. Semestre Actual (1 al 10)
  function validarSemestre(mostrarFeedback = true) {
    const val = semestreInput ? semestreInput.value.trim() : '';
    let valido = true;
    let mensaje = '';

    if (!val) {
      valido = false;
      mensaje = 'El semestre actual es obligatorio.';
    } else {
      const num = parseInt(val, 10);
      if (isNaN(num) || num < 1 || num > 10) {
        valido = false;
        mensaje = 'Debe ser un número entero entre 1 y 10 (rango universitario).';
      }
    }

    if (mostrarFeedback && semestreInput) {
      aplicarFeedback(semestreInput, 'err-semestre', 'val-semestre', valido, mensaje, `Semestre ${val}º registrado`);
    }
    return valido;
  }

  // Listeners reactivos
  if (nombreInput) {
    nombreInput.addEventListener('input', () => validarNombre(true));
    nombreInput.addEventListener('blur', () => validarNombre(true));
  }

  if (fechaInput) {
    ['input', 'change', 'blur'].forEach(evt => {
      fechaInput.addEventListener(evt, () => validarFecha(true));
    });
  }

  if (celularInput) {
    celularInput.addEventListener('input', () => validarCelular(true));
    celularInput.addEventListener('blur', () => validarCelular(true));
  }

  if (carreraSelect) {
    ['change', 'blur'].forEach(evt => {
      carreraSelect.addEventListener(evt, () => validarCarrera(true));
    });
  }

  if (semestreInput) {
    semestreInput.addEventListener('input', () => validarSemestre(true));
    semestreInput.addEventListener('blur', () => validarSemestre(true));
  }

  // Envío y validación completa
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const okNombre = validarNombre(true);
    const okFecha = validarFecha(true);
    const okCelular = validarCelular(true);
    const okCarrera = validarCarrera(true);
    const okSemestre = validarSemestre(true);

    const todoValido = okNombre && okFecha && okCelular && okCarrera && okSemestre;

    if (!todoValido) {
      if (alertaBox) {
        alertaBox.innerHTML = `
          <div class="alert alert-danger border-0 shadow-sm" role="alert">
            <h6 class="alert-heading fw-bold mb-1"><i class="bi bi-exclamation-triangle-fill me-2"></i>Formulario incompleto o con errores</h6>
            <p class="mb-0 small">Por favor revisa y corrige los campos señalados en rojo para registrar tus datos universitarios correctamente.</p>
          </div>
        `;
      }

      // Enfocar el primer campo inválido
      if (!okNombre && nombreInput) nombreInput.focus();
      else if (!okFecha && fechaInput) fechaInput.focus();
      else if (!okCelular && celularInput) celularInput.focus();
      else if (!okCarrera && carreraSelect) carreraSelect.focus();
      else if (!okSemestre && semestreInput) semestreInput.focus();

      return;
    }

    // Si todo es válido
    const nombreVal = nombreInput.value.trim();
    const fechaVal = fechaInput.value;
    const celularVal = celularInput.value.trim();
    const carreraVal = carreraSelect.value;
    const semestreNum = semestreInput.value.trim();

    const mensajeWa = encodeURIComponent(
      `¡Hola Gabriel! Me he registrado en tu portafolio web:\n\n• Estudiante: ${nombreVal}\n• Carrera: ${carreraVal}\n• Semestre: ${semestreNum}º\n• Celular: ${celularVal}\n• Fecha: ${fechaVal}\n\n¡Un gusto contactarte!`
    );

    if (alertaBox) {
      alertaBox.innerHTML = `
        <div class="alert alert-success border-0 shadow-lg p-4" role="alert">
          <h5 class="alert-heading fw-bold text-success mb-2">
            <i class="bi bi-patch-check-fill me-2 fs-4"></i>¡Registro Académico Validado Exitosamente!
          </h5>
          <p class="mb-2">Todos los campos han cumplido rigurosamente las reglas de validación del DOM en tiempo real.</p>
          <hr class="my-3">
          <div class="p-3 rounded bg-dark bg-opacity-10 mb-3 small">
            <div><strong>Estudiante / Visitante:</strong> ${nombreVal}</div>
            <div><strong>Carrera Universitaria:</strong> ${carreraVal}</div>
            <div><strong>Semestre Actual:</strong> ${semestreNum}º Semestre</div>
            <div><strong>Contacto Bolivia:</strong> +591 ${celularVal}</div>
            <div><strong>Fecha Registrada:</strong> ${fechaVal}</div>
          </div>
          <div class="d-flex flex-wrap gap-2">
            <a href="https://wa.me/59160120550?text=${mensajeWa}" target="_blank" rel="noopener noreferrer" class="btn btn-success fw-semibold">
              <i class="bi bi-whatsapp me-2"></i>Enviar confirmación a mi WhatsApp (+591 60120550)
            </a>
            <button type="button" class="btn btn-outline-secondary btn-sm" id="btnLimpiarForm">
              <i class="bi bi-arrow-repeat me-1"></i>Nuevo Registro
            </button>
          </div>
        </div>
      `;

      const btnLimpiar = document.getElementById('btnLimpiarForm');
      if (btnLimpiar) {
        btnLimpiar.addEventListener('click', () => {
          form.reset();
          [nombreInput, fechaInput, celularInput, carreraSelect, semestreInput].forEach(el => {
            if (el) el.classList.remove('input-valido', 'input-invalido', 'is-valid', 'is-invalid');
          });
          ['err-nombre', 'err-fecha', 'err-celular', 'err-carrera', 'err-semestre',
           'val-nombre', 'val-fecha', 'val-celular', 'val-carrera', 'val-semestre'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.innerHTML = '';
          });
          alertaBox.innerHTML = '';
        });
      }
    }
  });
}
window.inicializarFormularioContacto = inicializarFormularioContacto;

