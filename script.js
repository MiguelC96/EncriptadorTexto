// Espera a que todo el contenido del DOM se haya cargado antes de ejecutar la función mostrarAlertaBienvenida
document.addEventListener("DOMContentLoaded", function () {
    mostrarAlertaBienvenida();
});

// Función para mostrar una alerta de bienvenida cuando se carga la página
function mostrarAlertaBienvenida() {
const overlay = document.createElement('div');
    overlay.id = 'overlay'; // Asigna un ID para el overlay
    overlay.className = 'overlay'; // Asigna una clase para aplicar estilos CSS

    // Crear el contenedor de la alerta de bienvenida
    const alerta = document.createElement('div');
    alerta.id = 'alerta-bienvenida'; // Asigna un ID para la alerta
    alerta.className = 'alerta'; // Asigna una clase para aplicar estilos CSS

    // Define el contenido HTML de la alerta
    const contenido = `
        <div class="alerta-contenido">
            <img src="images/alertinicio.png" alt="Bienvenida" class="alerta-imagen">
        </div>
    `;
    alerta.innerHTML = contenido; // Inserta el contenido HTML en el elemento de alerta

    // Añade el overlay y la alerta al cuerpo del documento
    document.body.appendChild(overlay);
    document.body.appendChild(alerta);

    // Cierra la alerta automáticamente después de 5 segundos
    setTimeout(cerrarAlerta, 5000);
}

// Función para cerrar la alerta de bienvenida
function cerrarAlerta() {
    const alerta = document.getElementById('alerta-bienvenida');
    const overlay = document.getElementById('overlay');
    if (alerta) {
        alerta.style.display = 'none'; // Oculta la alerta
    }
    if (overlay) {
        overlay.style.display = 'none'; // Oculta el overlay
    }
}

// Función para mostrar una alerta personalizada con icono y mensaje
function mostrarAlerta(icono, mensaje) {
    const alerta = document.getElementById("alerta");
    const alertaIcono = document.getElementById("alerta-icono");
    const alertaMensaje = document.getElementById("alerta-mensaje");

    if (!alerta || !alertaIcono || !alertaMensaje) {
        console.error("Elementos de alerta no encontrados");
        return;
    }

    alertaIcono.src = icono; // Asigna la fuente del icono de alerta
    alertaMensaje.textContent = mensaje; // Asigna el mensaje de la alerta
    alerta.style.display = "flex"; // Muestra la alerta

    // Oculta la alerta después de 1 segundo
    alertaIcono.onload = () => {
        setTimeout(() => {
            alerta.style.display = "none";
        }, 1000);
    };

    // Muestra un error en la consola si no se pudo cargar el icono
    alertaIcono.onerror = () => {
        console.error("No se pudo cargar el icono de alerta:", icono);
        alerta.style.display = "none";
    };
}

// Función para encriptar el texto ingresado en el textarea
function encriptar() {
    const textInput = document.getElementById("texto");
    const parrafo = document.getElementById("parrafo");
    const encriptarBtn = document.getElementById("encriptar");

    if (!textInput || !parrafo || !encriptarBtn) {
        console.error("Elementos de texto, párrafo o botón no encontrados");
        return;
    }

    const textValue = textInput.value.trim(); // Obtiene el texto ingresado y elimina espacios al principio y al final

    if (textValue === "") {
        mostrarAlerta('images/warning.png', 'Por favor ingrese un texto para encriptar');
        return;
    }

    // Reemplaza las vocales por sus equivalentes encriptados
    const result = textValue
        .replace(/e/g, "enter")
        .replace(/i/g, "imes")
        .replace(/a/g, "ai")
        .replace(/o/g, "ober")
        .replace(/u/g, "ufat");
    parrafo.value = result; // Muestra el texto encriptado en el textarea de salida
    mostrarAlerta('images/encriptado.png', 'Texto encriptado');

    // Deshabilita el botón de encriptar y el de desencriptar
    encriptarBtn.disabled = true;
    encriptarBtn.classList.add('disabled');
    document.getElementById("desencriptar").disabled = true;
    document.getElementById("desencriptar").classList.add('disabled');
}

// Función para desencriptar el texto ingresado en el textarea
function desencriptar() {
    const textInput = document.getElementById("texto");
    const parrafo = document.getElementById("parrafo");
    const desencriptarBtn = document.getElementById("desencriptar");
    const encriptarBtn = document.getElementById("encriptar");

    if (!textInput || !parrafo || !desencriptarBtn || !encriptarBtn) {
        console.error("Elementos de texto, párrafo o botón no encontrados");
        return;
    }

    const textValue = textInput.value.trim();

    if (textValue === "") {
        mostrarAlerta('images/warning.png', 'Por favor ingrese un texto para desencriptar');
        return;
    }

    // Reemplaza las cadenas encriptadas por las vocales originales
    const result = textValue
        .replace(/enter/g, "e")
        .replace(/imes/g, "i")
        .replace(/ai/g, "a")
        .replace(/ober/g, "o")
        .replace(/ufat/g, "u");
    parrafo.value = result; // Muestra el texto desencriptado en el textarea de salida
    mostrarAlerta('images/desencriptar.png', 'Texto desencriptado');

    // Deshabilita el botón de desencriptar y el de encriptar
    encriptarBtn.disabled = true;
    encriptarBtn.classList.add('disabled');
    desencriptarBtn.disabled = true;
    desencriptarBtn.classList.add('disabled');
}

// Función para copiar el texto en el textarea al portapapeles
function copiar() {
    const resultText = document.getElementById("parrafo").value.trim();

    if (resultText === "") {
        mostrarAlerta('images/warning.png', 'No hay texto para copiar');
        return;
    }

    if (navigator.clipboard) {
        navigator.clipboard.writeText(resultText)
            .then(() => {
                mostrarAlerta('images/copiaralerta.png', 'Texto copiado');
                
                // Limpia los campos de texto y restablece el estado de los botones
                document.getElementById("texto").value = "";
                document.getElementById("parrafo").value = "";
                
                const encriptarBtn = document.getElementById("encriptar");
                const desencriptarBtn = document.getElementById("desencriptar");
                const pegarBtn = document.getElementById("pegar");

                if (encriptarBtn) {
                    encriptarBtn.disabled = false;
                    encriptarBtn.classList.remove('disabled');
                }

                if (desencriptarBtn) {
                    desencriptarBtn.disabled = true;
                    desencriptarBtn.classList.add('disabled');
                }

                if (pegarBtn) {
                    pegarBtn.disabled = false;
                    pegarBtn.classList.remove('disabled');
                }
            })
            .catch(err => {
                console.error("Error al copiar al portapapeles: ", err);
                mostrarAlerta('images/warning.png', 'Error al copiar el texto');
            });
    } else {
        mostrarAlerta('images/warning.png', 'El portapapeles no es compatible con este navegador');
    }
}

function validarTexto(textarea) {
    // Obtiene el valor original del textarea
    const valorOriginal = textarea.value;

    // Normaliza el texto para separar los caracteres base de sus acentos
    const valorNormalizado = valorOriginal.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

    // Convierte todo el texto a minúsculas y elimina cualquier carácter que no sea una letra minúscula o un espacio
    const valorFinal = valorNormalizado.toLowerCase().replace(/[^a-z\s]/g, "");

    // Asigna el valor final normalizado y limpio de nuevo al textarea
    textarea.value = valorFinal;
}


// Función para pegar el texto desde el portapapeles al textarea
function pegar() {
    const textInput = document.getElementById("texto");

    if (navigator.clipboard) {
        navigator.clipboard.readText()
            .then(text => {
                textInput.value = text; // Pega el texto en el textarea
                validarTexto(textInput); // Normaliza el texto pegado
                actualizarEstadoBotones(); // Actualiza el estado de los botones
                mostrarAlerta('images/pastealerta.png', 'Texto pegado');
            })
            .catch(err => {
                console.error("Error al leer del portapapeles: ", err);
                mostrarAlerta('images/warning.png', 'Error al pegar el texto');
            });
    } else {
        mostrarAlerta('images/warning.png', 'El portapapeles no es compatible con este navegador');
    }
}

// Función para actualizar el estado de los botones según el texto en el textarea
function actualizarEstadoBotones() {
    const texto = document.getElementById("texto");
    const desencriptarBtn = document.getElementById("desencriptar");
    const encriptarBtn = document.getElementById("encriptar");
    const pegarBtn = document.getElementById("pegar");

    if (texto && desencriptarBtn && encriptarBtn && pegarBtn) {
        const textoEstaVacio = texto.value.trim() === "";

        // Habilitar o deshabilitar el botón de desencriptar y encriptar
        desencriptarBtn.disabled = textoEstaVacio;
        desencriptarBtn.classList.toggle('disabled', textoEstaVacio);

        // Habilitar el botón de pegar solo si hay texto en el portapapeles
        navigator.clipboard.readText().then(text => {
            pegarBtn.disabled = text.trim() === "";
            pegarBtn.classList.toggle('disabled', text.trim() === "");
        }).catch(err => {
            console.error("Error al leer del portapapeles: ", err);
            pegarBtn.disabled = true;
            pegarBtn.classList.add('disabled');
        });
    }
}

// Event listener para validar el texto y actualizar el estado de los botones cuando el usuario escriba en el textarea
document.getElementById("texto").addEventListener("input", function() {
    validarTexto(this);
    actualizarEstadoBotones();
});
