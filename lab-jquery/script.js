/* ==========================================================
   DEPORZONE WALLY PARK - LÓGICA DE INTERACCIÓN CON JQUERY
   Materia: Diseño Web II (Ingeniería de Sistemas)
   4 Funciones Clave:
     1. Menú Hamburguesa responsive permanente (.slideToggle)
     2. Modo Oscuro y Claro (.toggleClass, .fadeIn, .hide)
     3. Filtrado por Tipos y Subtipos (.fadeIn, .fadeOut, .show, .hide)
     4. Formulario de Reserva con cálculo en vivo, validación en tiempo real / blur y activación dinámica del botón
   ========================================================== */

$(document).ready(function() {

  // ==========================================================
  // FUNCIÓN 1: MENÚ HAMBURGUESA PERMANENTE (DESPLEGABLE ELEGANTE)
  // ==========================================================
  // Al hacer clic en el botón de hamburguesa, despliega o recoge el menú
  $('#hamburger-btn').click(function(e) {
    e.stopPropagation(); // Evitar que el clic en el botón cierre el menú de inmediato
    $('#navbar').slideToggle(250);
  });

  // Al hacer clic en un enlace del menú, navega, se cierra suavemente y marca el activo
  $('.nav-link').click(function() {
    $('#navbar').slideUp(200);
    $('.nav-link').removeClass('active');
    $(this).addClass('active');
  });

  // Cerrar el menú si el usuario hace clic fuera de la cabecera
  $(document).click(function(e) {
    if (!$(e.target).closest('#main-header').length) {
      $('#navbar').slideUp(200);
    }
  });


  // ==========================================================
  // FUNCIÓN 2: MODO OSCURO Y CLARO (DARK / LIGHT MODE)
  // ==========================================================
  $('#theme-toggle-btn').click(function() {
    // Alterna la clase theme-dark en la etiqueta body
    $('body').toggleClass('theme-dark');

    // Alterna los iconos de Luna y Sol con animación jQuery
    if ($('body').hasClass('theme-dark')) {
      $('.icon-moon').hide();
      $('.icon-sun').fadeIn(200);
      $(this).attr('title', 'Cambiar a modo claro');
    } else {
      $('.icon-sun').hide();
      $('.icon-moon').fadeIn(200);
      $(this).attr('title', 'Cambiar a modo oscuro');
    }
  });


  // ==========================================================
  // FUNCIÓN 3: FILTRADO DE CANCHAS POR TIPOS Y SUBTIPOS
  // ==========================================================
  let filtroTipoActual = 'all';
  let filtroSubtipoActual = 'all';

  // 3.1 Clic en botones de Tipo de Superficie
  $('.type-btn').click(function() {
    $('.type-btn').removeClass('active');
    $(this).addClass('active');

    filtroTipoActual = $(this).data('type');
    aplicarFiltros();
  });

  // 3.2 Clic en botones de Subtipo de Ambiente
  $('.subtype-btn').click(function() {
    $('.subtype-btn').removeClass('active');
    $(this).addClass('active');

    filtroSubtipoActual = $(this).data('subtype');
    aplicarFiltros();
  });

  // 3.3 Función que evalúa ambas condiciones y anima las tarjetas
  function aplicarFiltros() {
    $('.court-card').each(function() {
      let cardTipo = $(this).data('type');
      let cardSubtipos = $(this).data('subtype') ? $(this).data('subtype').split(' ') : [];

      let coincideTipo = (filtroTipoActual === 'all') || (cardTipo === filtroTipoActual);
      let coincideSubtipo = (filtroSubtipoActual === 'all') || (cardSubtipos.includes(filtroSubtipoActual));

      if (coincideTipo && coincideSubtipo) {
        $(this).fadeIn(300);
      } else {
        $(this).fadeOut(300);
      }
    });
  }

  // 3.4 Botón "Seleccionar" en una tarjeta del catálogo
  $('.btn-select-court').click(function() {
    let courtId = $(this).data('court-id');
    
    // Seleccionar automáticamente la cancha en el dropdown de la sección de reserva
    $('#select-cancha-reserva').val(courtId).trigger('change');

    // Desplazamiento suave hasta el formulario de reserva
    $('html, body').animate({
      scrollTop: $('#booking-section').offset().top - 80
    }, 500);
  });


  // ==========================================================
  // FUNCIÓN 4: FORMULARIO DE RESERVA, VALIDACIONES Y CÁLCULO
  // ==========================================================
  
  // 4.1 Configurar fecha mínima permitida (HOY) para evitar fechas pasadas
  const ahora = new Date();
  const yyyy = ahora.getFullYear();
  const mm = String(ahora.getMonth() + 1).padStart(2, '0');
  const dd = String(ahora.getDate()).padStart(2, '0');
  const fechaHoyFormato = `${yyyy}-${mm}-${dd}`;

  // Establecer valor inicial y atributo min en HTML
  $('#fecha-reserva').attr('min', fechaHoyFormato).val(fechaHoyFormato);

  // Variables de control de horas y precios
  let precioPorHora = 80;
  let horaInicio = 19;
  let horaFin = 20;
  let horasValidas = true;

  // Lista de turnos ocupados fijos (para validar rangos continuos)
  const turnosOcupados = [
    { inicio: 16, fin: 17 },
    { inicio: 20, fin: 21 }
  ];

  // 4.2 Clic en los botones de Turnos Rápidos (.btn-slot)
  $('.btn-slot').click(function() {
    if ($(this).hasClass('ocupado')) {
      let hIni = $(this).data('inicio');
      let hF = $(this).data('fin');
      mostrarAlertaError(`⛔ El turno de las ${hIni}:00 a ${hF}:00 ya se encuentra reservado. Elige otro horario disponible.`);
      return;
    }

    // Remover estado activo de los demás y ponérselo al seleccionado
    $('.btn-slot:not(.ocupado)').removeClass('active-slot');
    $(this).addClass('active-slot');

    // Sincronizar con los selectores de hora inicio y fin
    horaInicio = parseInt($(this).data('inicio'));
    horaFin = parseInt($(this).data('fin'));

    $('#select-inicio').val(horaInicio);
    $('#select-fin').val(horaFin);

    validarHorarios();
    calcularTotalReserva();
    verificarFormularioCompleto();
  });

  // 4.3 Cambio en selectores de Hora Inicio y Fin
  $('#select-inicio, #select-fin').on('change blur', function() {
    horaInicio = parseInt($('#select-inicio').val());
    horaFin = parseInt($('#select-fin').val());

    validarHorarios();
    calcularTotalReserva();
    verificarFormularioCompleto();
  });

  // Función dedicada a validar los horarios
  function validarHorarios() {
    $('#select-inicio, #select-fin').removeClass('input-invalid input-valid');
    $('#err-hours').hide().text('');
    horasValidas = false;

    // Regla 1: Fin debe ser estrictamente mayor a inicio
    if (horaFin <= horaInicio) {
      $('#err-hours').text('⚠️ La hora de fin debe ser posterior a la de inicio (mínimo 1 hora de juego).').slideDown('fast');
      $('#select-inicio, #select-fin').addClass('input-invalid');
      $('.btn-slot').removeClass('active-slot');
      mostrarAlertaError('⚠️ Horario no válido: la hora fin debe ser mayor a la hora de inicio.');
      return false;
    }

    // Regla 2: Verificar si el rango abarca algún turno ocupado
    let tieneTurnoOcupado = false;
    let turnoChocado = '';
    for (let t of turnosOcupados) {
      // Si el intervalo seleccionado se superpone con un turno ocupado
      if (Math.max(horaInicio, t.inicio) < Math.min(horaFin, t.fin)) {
        tieneTurnoOcupado = true;
        turnoChocado = `${t.inicio}:00 a ${t.fin}:00`;
        break;
      }
    }

    if (tieneTurnoOcupado) {
      $('#err-hours').text(`⛔ Tu selección abarca el horario ${turnoChocado}, el cual ya está ocupado.`).slideDown('fast');
      $('#select-inicio, #select-fin').addClass('input-invalid');
      $('.btn-slot').removeClass('active-slot');
      mostrarAlertaError(`⛔ El rango seleccionado incluye turnos ocupados (${turnoChocado}). Elige horas libres.`);
      return false;
    }

    // Horario válido
    horasValidas = true;
    $('#select-inicio, #select-fin').addClass('input-valid');
    $('#err-hours').slideUp('fast');
    $('#booking-alert-error').slideUp('fast');

    // Sincronizar botón rápido si coincide exactamente con 1 turno
    $('.btn-slot').removeClass('active-slot');
    if (horaFin - horaInicio === 1) {
      $(`.btn-slot[data-inicio="${horaInicio}"][data-fin="${horaFin}"]:not(.ocupado)`).addClass('active-slot');
    }

    return true;
  }

  // 4.4 Cambio de Cancha Seleccionada
  $('#select-cancha-reserva').change(function() {
    let optSeleccionada = $(this).find('option:selected');
    precioPorHora = parseInt(optSeleccionada.data('precio')) || 80;

    let nombreCancha = optSeleccionada.text().split('(')[0].trim();
    $('#summary-court').text(nombreCancha);

    calcularTotalReserva();
  });

  // 4.5 Cambio en Adicionales
  $('input[name="add-ball"], input[name="add-vests"], input[name="add-water"]').change(function() {
    calcularTotalReserva();
  });

  // 4.6 Función central de cálculo y actualización en vivo del resumen
  function calcularTotalReserva() {
    let totalHoras = horaFin - horaInicio;

    if (!horasValidas || totalHoras <= 0) {
      $('#summary-hours').text('0 Horas (Horario inválido)');
      $('#summary-time').text('No asignado');
      $('#summary-total').text('0 Bs').css('color', '#e53935');
      return;
    }

    let subtotalCancha = totalHoras * precioPorHora;

    // Sumar adicionales seleccionados
    let totalAdicionales = 0;
    if ($('#add-ball').is(':checked')) totalAdicionales += parseInt($('#add-ball').val());
    if ($('#add-vests').is(':checked')) totalAdicionales += parseInt($('#add-vests').val());
    if ($('#add-water').is(':checked')) totalAdicionales += parseInt($('#add-water').val());

    let granTotal = subtotalCancha + totalAdicionales;

    // Actualizar texto del resumen
    $('#summary-hours').text(`${totalHoras} Hora(s)`);
    $('#summary-time').text(`${horaInicio}:00 a ${horaFin}:00`);

    // Animación jQuery para resaltar el cambio en el monto total (.animate)
    $('#summary-total')
      .text(`${granTotal} Bs`)
      .css('color', '#27ae60')
      .animate({ fontSize: '1.4rem' }, 120)
      .animate({ fontSize: '1.25rem' }, 120);
  }

  // 4.7 Función auxiliar para mostrar alertas de error con slideDown
  function mostrarAlertaError(mensaje) {
    $('#booking-alert-success').hide();
    $('#booking-alert-error').html(mensaje).slideDown('fast');
  }


  // ==========================================================
  // FUNCIONES DE VALIDACIÓN INDIVIDUAL (PARA BLUR / INPUT)
  // ==========================================================

  // Validación de Fecha (No vacía y no en el pasado)
  function validarCampoFecha() {
    let valorFecha = $('#fecha-reserva').val();
    $('#fecha-reserva').removeClass('input-invalid input-valid');
    $('#err-date').hide().text('');

    if (!valorFecha) {
      $('#err-date').text('⚠️ Debes seleccionar una fecha para la reserva.').slideDown('fast');
      $('#fecha-reserva').addClass('input-invalid');
      return false;
    }

    if (valorFecha < fechaHoyFormato) {
      $('#err-date').text('⚠️ No puedes reservar en una fecha pasada. Elige hoy o un día posterior.').slideDown('fast');
      $('#fecha-reserva').addClass('input-invalid');
      return false;
    }

    $('#fecha-reserva').addClass('input-valid');
    return true;
  }

  // Validación de Nombre Completo
  function validarCampoNombre() {
    let nombre = $('#client-name').val().trim();
    let regexNombre = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{3,50}$/;

    $('#client-name').removeClass('input-invalid input-valid');
    $('#err-name').hide().text('');

    if (nombre === '') {
      $('#err-name').text('⚠️ El nombre completo es obligatorio.').slideDown('fast');
      $('#client-name').addClass('input-invalid');
      return false;
    }

    if (!regexNombre.test(nombre)) {
      $('#err-name').text('⚠️ Ingresa un nombre válido (al menos 3 letras, sin números ni símbolos).').slideDown('fast');
      $('#client-name').addClass('input-invalid');
      return false;
    }

    $('#client-name').addClass('input-valid');
    return true;
  }

  // Validación de Celular / WhatsApp
  function validarCampoTelefono() {
    let tel = $('#client-phone').val().trim();
    let regexTel = /^[0-9]{7,10}$/;

    $('#client-phone').removeClass('input-invalid input-valid');
    $('#err-phone').hide().text('');

    if (tel === '') {
      $('#err-phone').text('⚠️ El número de celular / WhatsApp es obligatorio.').slideDown('fast');
      $('#client-phone').addClass('input-invalid');
      return false;
    }

    if (!regexTel.test(tel)) {
      $('#err-phone').text('⚠️ Ingresa un número válido de 7 a 10 dígitos numéricos (ej: 78854844).').slideDown('fast');
      $('#client-phone').addClass('input-invalid');
      return false;
    }

    $('#client-phone').addClass('input-valid');
    return true;
  }

  // Validación de Correo Electrónico
  function validarCampoEmail() {
    let correo = $('#client-email').val().trim();
    let regexEmail = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

    $('#client-email').removeClass('input-invalid input-valid');
    $('#err-email').hide().text('');

    if (correo === '') {
      $('#err-email').text('⚠️ El correo electrónico es obligatorio.').slideDown('fast');
      $('#client-email').addClass('input-invalid');
      return false;
    }

    if (!regexEmail.test(correo)) {
      $('#err-email').text('⚠️ Ingresa un formato de correo válido (ej: usuario@correo.com).').slideDown('fast');
      $('#client-email').addClass('input-invalid');
      return false;
    }

    $('#client-email').addClass('input-valid');
    return true;
  }

  // ==========================================================
  // EVENTOS BLUR / INPUT: VALIDAR AL SALIR DEL CAMPO O TOCARLO
  // ==========================================================
  // Al salir del campo (blur), si no se hizo nada o se dejó mal, se valida de inmediato
  $('#fecha-reserva').on('blur change', function() {
    validarCampoFecha();
    verificarFormularioCompleto();
  });

  $('#client-name').on('blur input', function() {
    validarCampoNombre();
    verificarFormularioCompleto();
  });

  $('#client-phone').on('blur input', function() {
    validarCampoTelefono();
    verificarFormularioCompleto();
  });

  $('#client-email').on('blur input', function() {
    validarCampoEmail();
    verificarFormularioCompleto();
  });

  // ==========================================================
  // ACTIVACIÓN DINÁMICA DEL BOTÓN CUANDO TODO ESTÁ VÁLIDO
  // ==========================================================
  function verificarFormularioCompleto() {
    let fechaOk = validarCampoFechaSilencioso();
    let horasOk = horasValidas;
    let nombreOk = validarCampoNombreSilencioso();
    let telefonoOk = validarCampoTelefonoSilencioso();
    let emailOk = validarCampoEmailSilencioso();

    let todoValido = fechaOk && horasOk && nombreOk && telefonoOk && emailOk;

    let $btn = $('#btn-submit-booking');

    if (todoValido) {
      // Habilitar botón, ponerlo en verde listo para enviar
      $btn
        .prop('disabled', false)
        .removeClass('btn-disabled')
        .addClass('btn-ready')
        .html('<i class="fa-solid fa-circle-check"></i> Confirmar y Reservar en Wally Park');
    } else {
      // Deshabilitar botón y mantenerlo en gris
      $btn
        .prop('disabled', true)
        .removeClass('btn-ready')
        .addClass('btn-disabled')
        .html('<i class="fa-solid fa-lock"></i> Completa los campos para reservar');
    }

    return todoValido;
  }

  // Funciones de validación silenciosa (comprueba estado sin mostrar errores antes de tiempo)
  function validarCampoFechaSilencioso() {
    let f = $('#fecha-reserva').val();
    return f && (f >= fechaHoyFormato);
  }

  function validarCampoNombreSilencioso() {
    let n = $('#client-name').val().trim();
    return /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{3,50}$/.test(n);
  }

  function validarCampoTelefonoSilencioso() {
    let t = $('#client-phone').val().trim();
    return /^[0-9]{7,10}$/.test(t);
  }

  function validarCampoEmailSilencioso() {
    let e = $('#client-email').val().trim();
    return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(e);
  }


  // ==========================================================
  // SUBMIT DEL FORMULARIO DE RESERVA
  // ==========================================================
  $('#reservation-form').submit(function(e) {
    e.preventDefault();

    // Ejecutar todas las validaciones con alerta visible
    let vFecha = validarCampoFecha();
    let vHoras = validarHorarios();
    let vNombre = validarCampoNombre();
    let vTel = validarCampoTelefono();
    let vEmail = validarCampoEmail();

    if (!vFecha || !vHoras || !vNombre || !vTel || !vEmail) {
      mostrarAlertaError('⚠️ Revisa los campos resaltados en rojo antes de proceder.');
      verificarFormularioCompleto();
      return;
    }

    // Si todo es correcto, emitir comprobante exitoso
    let nombreCliente = $('#client-name').val().trim();
    let telefono = $('#client-phone').val().trim();
    let email = $('#client-email').val().trim();
    let cancha = $('#summary-court').text();
    let total = $('#summary-total').text();
    let fecha = $('#fecha-reserva').val();
    let modalidad = $('#wally-category option:selected').text();
    let pago = $('#payment-method option:selected').text();

    $('#booking-alert-error').hide();

    let mensajeExito = `
      <strong>¡Reserva Confirmada en Wally Park! 🏆</strong><br><br>
      👤 Titular: <strong>${nombreCliente}</strong> (WhatsApp: ${telefono})<br>
      📧 Correo: <strong>${email}</strong><br>
      🏟️ Cancha: <strong>${cancha}</strong><br>
      📅 Fecha: <strong>${fecha}</strong> (Horario: ${horaInicio}:00 - ${horaFin}:00)<br>
      🏐 Modalidad: <strong>${modalidad}</strong><br>
      💳 Método de Pago: <strong>${pago}</strong><br>
      💰 Monto Total: <strong>${total}</strong><br><br>
      <em>✅ Tu turno ha quedado asegurado en el sistema central del complejo.</em>
    `;

    $('#booking-alert-success').html(mensajeExito).slideDown(400);

    // Scroll suave hacia la confirmación
    $('html, body').animate({
      scrollTop: $('#booking-alert-success').offset().top - 100
    }, 400);

    // Limpieza tras confirmar
    setTimeout(function() {
      $('#client-name, #client-phone, #client-email, #client-notes').val('');
      $('input, select').removeClass('input-valid input-invalid');
      $('#booking-alert-success').slideUp(500);
      verificarFormularioCompleto();
    }, 6000);
  });

  // Inicialización de la pantalla al cargar
  $('#select-cancha-reserva').trigger('change');
  validarHorarios();
  verificarFormularioCompleto();

});
