document.addEventListener("DOMContentLoaded", function () {
    mostrarAlertaBienvenida();
    actualizarEstadoBotonDesencriptar(); // Verifica el estado del botón al cargar la página

    // Añade un evento para actualizar el estado del botón cada vez que el texto cambia
    document.getElementById("input-texto").addEventListener("input", actualizarEstadoBotonDesencriptar);
    document.getElementById("input-texto").addEventListener("click", actualizarEstadoBotonDesencriptar);
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
    const contenido = `
        <div class="alerta-contenido">
            <img src="images/alertinicio.png" alt="Bienvenida" class="alerta-imagen">
        </div>
    `;
    alerta.innerHTML = contenido; // Inserta el contenido HTML en el elemento de alerta

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

    // Muestra un error en la consola si no se pudo cargar el icono
    alertaIcono.onerror = () => {
        console.error("No se pudo cargar el icono de alerta:", icono);
        alerta.style.display = "none";
    };
}

// Función para encriptar el texto ingresado en el textarea
function encriptar() {
    const textInput = document.getElementById("input-texto");
    const parrafo = document.getElementById("output-texto");
    const encriptarBtn = document.getElementById("btn-encriptar");
    const desencriptarBtn = document.getElementById("btn-desencriptar");

    if (!textInput || !parrafo || !encriptarBtn || !desencriptarBtn) {
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
    parrafo.value = result; 
    mostrarAlerta('images/encriptado.png', 'Texto encriptado');

    // Deshabilita el botón de encriptar y activa el botón de desencriptar
    encriptarBtn.disabled = true;
    encriptarBtn.classList.add('disabled');
    desencriptarBtn.disabled = false;
    desencriptarBtn.classList.remove('disabled');
}

// Función para desencriptar el texto ingresado en el textarea
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

    if (resultText === "") {
        mostrarAlerta('images/warning.png', 'No hay texto para copiar');
        return;
    }

    if (navigator.clipboard) {
        navigator.clipboard.writeText(resultText)
            .then(() => {
                mostrarAlerta('images/copiaralerta.png', 'Texto copiado');
                
                // Limpia los campos de texto y restablece el estado de los botones
                document.getElementById("input-texto").value = "";
                document.getElementById("output-texto").value = "";
                
                const encriptarBtn = document.getElementById("btn-encriptar");
                const desencriptarBtn = document.getElementById("btn-desencriptar");
                const pegarBtn = document.getElementById("btn-pegar");

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

function validarTexto(texto) {

    if (typeof texto !== 'string') {
        console.error('El argumento debe ser una cadena de texto');
        return false;
    }

    // Normaliza el texto para separar los caracteres base de sus acentos
    const valorNormalizado = texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

    // Convierte todo el texto a minúsculas y elimina cualquier carácter que no sea una letra o espacio
    const valorLimpiado = valorNormalizado.toLowerCase().replace(/[^a-z\s]/g, "");

    // Compara el valor limpio con el valor original
    return texto.trim().toLowerCase() === valorLimpiado.trim();
}


// Función para pegar el texto del portapapeles en el textarea
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
            } else {
                mostrarAlerta('images/warning.png', 'Texto no válido para pegar');
            }
        })
        .catch(err => {
            console.error("Error al pegar del portapapeles: ", err);
            mostrarAlerta('images/warning.png', 'Error al pegar el texto. Asegúrate de que la operación sea realizada desde una interacción del usuario.');
        });
}

// Función para actualizar el estado del botón de desencriptar
function actualizarEstadoBotonDesencriptar() {
    const texto = document.getElementById("input-texto").value.trim();
    const botonDesencriptar = document.getElementById("btn-desencriptar");

    if (botonDesencriptar) {
        botonDesencriptar.disabled = texto === "";
        botonDesencriptar.classList.toggle('disabled', texto === "");
    }
}
