document.addEventListener("DOMContentLoaded", function () {
    mostrarAlertaBienvenida();
});

function mostrarAlertaBienvenida() {
    const alerta = document.createElement('div');
    alerta.id = 'alerta-bienvenida';
    alerta.className = 'alerta';

    const contenido = `
        <div class="alerta-contenido">
            <img src="images/alertinicio.png" alt="Bienvenida" class="alerta-imagen">
        </div>
    `;
    alerta.innerHTML = contenido;
    document.body.appendChild(alerta);

    // Cierra la alerta automáticamente después de 4 segundos
    setTimeout(cerrarAlerta, 1800);
}

function cerrarAlerta() {
    const alerta = document.getElementById('alerta-bienvenida');
    if (alerta) {
        alerta.style.display = 'none';
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
    const textInput = document.getElementById("texto");
    const parrafo = document.getElementById("parrafo");
    const encriptarBtn = document.getElementById("encriptar");

    if (!textInput || !parrafo || !encriptarBtn) {
        console.error("Elementos de texto, párrafo o botón no encontrados");
        return;
    }

    const textValue = textInput.value.trim();

    if (textValue === "") {
        mostrarAlerta('images/warning.png', 'Por favor ingrese un texto para encriptar');
        return;
    }

    const result = textValue
        .replace(/e/g, "enter")
        .replace(/i/g, "imes")
        .replace(/a/g, "ai")
        .replace(/o/g, "ober")
        .replace(/u/g, "ufat");
    parrafo.value = result;
    mostrarAlerta('images/encriptado.png', 'Texto encriptado');

    // Deshabilitar el botón de encriptar después de la encriptación
    encriptarBtn.disabled = true;
    encriptarBtn.classList.add('disabled');
    
    // Deshabilitar el botón de desencriptar hasta que se limpie el texto
    document.getElementById("desencriptar").disabled = true;
    document.getElementById("desencriptar").classList.add('disabled');
}

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

    const result = textValue
        .replace(/enter/g, "e")
        .replace(/imes/g, "i")
        .replace(/ai/g, "a")
        .replace(/ober/g, "o")
        .replace(/ufat/g, "u");
    parrafo.value = result;
    mostrarAlerta('images/desencriptar.png', 'Texto desencriptado');

    // Habilitar el botón de encriptar después de desencriptar
    encriptarBtn.disabled = true;
    encriptarBtn.classList.add('disabled');
    
    // Deshabilitar el botón de desencriptar después de desencriptar
    desencriptarBtn.disabled = true;
    desencriptarBtn.classList.add('disabled');
}

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
                
                // Limpiar campos y restablecer el estado de los botones
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
    const valorOriginal = textarea.value;
    const valorNormalizado = valorOriginal.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    const valorFinal = valorNormalizado.toLowerCase().replace(/[^a-z\s]/g, "");
    textarea.value = valorFinal;
}

function pegar() {
    const textInput = document.getElementById("texto");

    if (navigator.clipboard) {
        navigator.clipboard.readText()
            .then(text => {
                textInput.value = text;
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

// Event listener para actualizar el estado de los botones en función del textarea
document.getElementById("texto").addEventListener("input", function() {
    validarTexto(this);
    actualizarEstadoBotones();
});
