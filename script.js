document.addEventListener("DOMContentLoaded", function () {
    mostrarAlertaBienvenida();
    actualizarEstadoBotonDesencriptar(); // Verifica el estado del botón al cargar la página

    // Añade eventos para actualizar el estado del botón cada vez que el texto cambia
    const inputTexto = document.getElementById("input-texto");
    inputTexto.addEventListener("input", actualizarEstadoBotonDesencriptar);
    inputTexto.addEventListener("click", actualizarEstadoBotonDesencriptar);
});

function mostrarAlertaBienvenida() {
    const overlay = document.createElement('div');
    overlay.id = 'overlay';
    overlay.className = 'overlay';

    // Crear el contenedor de la alerta de bienvenida
    const alerta = document.createElement('div');
    alerta.id = 'alerta-bienvenida';
    alerta.className = 'alerta';

    // Define el contenido HTML de la alerta
    alerta.innerHTML = `
        <div class="alerta-contenido">
            <img src="images/alertinicio.png" alt="Bienvenida" class="alerta-imagen">
        </div>
    `;

    document.body.appendChild(overlay);
    document.body.appendChild(alerta);

    setTimeout(cerrarAlerta, 3000);
}

function cerrarAlerta() {
    const alerta = document.getElementById('alerta-bienvenida');
    const overlay = document.getElementById('overlay');
    if (alerta) {
        alerta.style.display = 'none';
    }
    if (overlay) {
        overlay.style.display = 'none';
    }
}

function mostrarAlerta(icono, mensaje) {
    const alerta = document.getElementById("alerta");
    const alertaIcono = document.getElementById("alerta-icono");
    const alertaMensaje = document.getElementById("alerta-mensaje");

    if (!alerta || !alertaIcono || !alertaMensaje) {
        console.error("Elementos de alerta no encontrados");
        return;
    }

    alertaIcono.src = icono;
    alertaMensaje.textContent = mensaje;
    alerta.style.display = "flex";

    alertaIcono.onload = () => {
        setTimeout(() => {
            alerta.style.display = "none";
        }, 1000);
    };

    alertaIcono.onerror = () => {
        console.error("No se pudo cargar el icono de alerta:", icono);
        alerta.style.display = "none";
    };
}

function encriptar() {
    const textInput = document.getElementById("input-texto");
    const parrafo = document.getElementById("output-texto");
    const encriptarBtn = document.getElementById("btn-encriptar");
    const desencriptarBtn = document.getElementById("btn-desencriptar");

    if (!textInput || !parrafo || !encriptarBtn || !desencriptarBtn) {
        console.error("Elementos de texto, párrafo o botón no encontrados");
        return;
    }

    const textValue = textInput.value.trim();

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
    parrafo.value = result;
    mostrarAlerta('images/encriptado.png', 'Texto encriptado');

    // Deshabilita el botón de encriptar y activa el botón de desencriptar
    encriptarBtn.disabled = true;
    encriptarBtn.classList.add('disabled');
    desencriptarBtn.disabled = false;
    desencriptarBtn.classList.remove('disabled');
}

function desencriptar() {
    const textInput = document.getElementById("input-texto");
    const parrafo = document.getElementById("output-texto");
    const desencriptarBtn = document.getElementById("btn-desencriptar");
    const encriptarBtn = document.getElementById("btn-encriptar");

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
    parrafo.value = result;
    mostrarAlerta('images/desencriptar.png', 'Texto desencriptado');

    // Deshabilita el botón de desencriptar y activa el botón de encriptar
    desencriptarBtn.disabled = true;
    desencriptarBtn.classList.add('disabled');
    encriptarBtn.disabled = false;
    encriptarBtn.classList.remove('disabled');
}

// Función para copiar el texto en el textarea al portapapeles
function copiar() {
    const resultText = document.getElementById("output-texto").value.trim();

    // Verifica si hay texto para copiar
    if (resultText === "") {
        mostrarAlerta('images/warning.png', 'No hay texto para copiar');
        return;
    }

    if (navigator.clipboard) {
        navigator.clipboard.writeText(resultText)
            .then(() => {
                mostrarAlerta('images/copiaralerta.png', 'Texto copiado');
                
                // Limpia los campos de texto y restablece el estado de los botones
                const inputTexto = document.getElementById("input-texto");
                const outputTexto = document.getElementById("output-texto");
                const encriptarBtn = document.getElementById("btn-encriptar");
                const desencriptarBtn = document.getElementById("btn-desencriptar");
                const pegarBtn = document.getElementById("btn-pegar");

                if (inputTexto) {
                    inputTexto.value = "";
                } else {
                    console.warn("Elemento 'input-texto' no encontrado");
                }

                if (outputTexto) {
                    outputTexto.value = "";
                } else {
                    console.warn("Elemento 'output-texto' no encontrado");
                }

                if (encriptarBtn) {
                    encriptarBtn.disabled = false;
                    encriptarBtn.classList.remove('disabled');
                } else {
                    console.warn("Elemento 'btn-encriptar' no encontrado");
                }

                if (desencriptarBtn) {
                    desencriptarBtn.disabled = true;
                    desencriptarBtn.classList.add('disabled');
                } else {
                    console.warn("Elemento 'btn-desencriptar' no encontrado");
                }

                if (pegarBtn) {
                    pegarBtn.disabled = false;
                    pegarBtn.classList.remove('disabled');
                } else {
                    console.warn("Elemento 'btn-pegar' no encontrado");
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

function validarTexto(texto) {
    if (typeof texto !== 'string') {
        console.error('El argumento debe ser una cadena de texto');
        return false;
    }

    // Normaliza el texto para separar los caracteres base de sus acentos
    const valorNormalizado = texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

    // Convierte todo el texto a minúsculas y elimina cualquier carácter que no sea una letra o espacio
    const valorLimpiado = valorNormalizado.toLowerCase().replace(/[^a-z\s]/g, "");

  
    return texto.trim().toLowerCase() === valorLimpiado.trim();
}


function pegar() {
    const inputText = document.getElementById("input-texto");

    if (!inputText) {
        console.error("Elemento input-texto no encontrado");
        return;
    }

    navigator.clipboard.readText()
        .then(text => {
            if (validarTexto(text)) {
                inputText.value = text;
                document.getElementById("btn-encriptar").disabled = false;
                document.getElementById("btn-encriptar").classList.remove('disabled');
                actualizarEstadoBotonDesencriptar();

                // Muestra la alerta de texto pegado
                mostrarAlerta('images/pastealerta.png', 'Texto pegado'); // Ajusta la ruta de la imagen y el mensaje según sea necesario
            } else {
                mostrarAlerta('images/warning.png', 'Texto no válido para pegar');
            }
        })
        .catch(err => {
            console.error("Error al pegar del portapapeles: ", err);
            mostrarAlerta('images/warning.png', 'Error al pegar el texto. Asegúrate de que la operación sea realizada desde una interacción del usuario.');
        });
}

function actualizarEstadoBotonDesencriptar() {
    const texto = document.getElementById("input-texto").value.trim();
    const botonDesencriptar = document.getElementById("btn-desencriptar");

    if (botonDesencriptar) {
        botonDesencriptar.disabled = texto === "";
        botonDesencriptar.classList.toggle('disabled', texto === "");
    }
}
function filtrarEntrada(textarea) {
    const texto = textarea.value;

    // Permite solo letras minúsculas
    const textoFiltrado = texto.replace(/[^a-z]/g, "");
    textarea.value = textoFiltrado;
}

document.addEventListener("DOMContentLoaded", function () {
    mostrarAlertaBienvenida();
    actualizarEstadoBotonDesencriptar(); // Verifica el estado del botón al cargar la página

    // Añade eventos para actualizar el estado del botón cada vez que el texto cambia
    const inputTexto = document.getElementById("input-texto");
    inputTexto.addEventListener("input", function() {
        filtrarEntrada(inputTexto);
        actualizarEstadoBotonDesencriptar();
    });
    inputTexto.addEventListener("click", function() {
        filtrarEntrada(inputTexto);
        actualizarEstadoBotonDesencriptar();
    });
});


