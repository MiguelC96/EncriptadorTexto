// ESTE CODIGO ES PARTE DE UN CHALLENGE PARA ALURA LATAM Y ORACLE
// TODAS LAS FUNCIONES REFERENTES A ENCRIPTACION SHA256 SON DE MI AUTORIA Y ES DE USO LIBRE
document.addEventListener("DOMContentLoaded", function () {
    actualizarEstadoBotonDesencriptar(); 

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
//MANEJO DE ALERTAS PARA CONTEDORES DE TEXTO DE ENCRIPTADO: COPIAR,PEGAR,ENCRIPTAR,DESENCRIPTAR
function mostrarAlerta(mensaje, icono) {
    const alerta = document.getElementById('alerta');
    const alertaIcono = document.getElementById('alerta-icono');
    const alertaMensaje = document.getElementById('alerta-mensaje');

    alertaMensaje.textContent = mensaje;
    alertaIcono.src = icono;
    alerta.classList.add('show'); 

    setTimeout(() => {
        alerta.classList.remove('show');
    }, 2000);
}
// OCULTAR ALERTA
function ocultarAlerta() {
    const alerta = document.getElementById('alerta');
    alerta.classList.remove('show');
}
// FUNCION DE ENCRIPTACION CON REMPLAZO DE VOCALES Y EMISION DE HASH SHA256 DE LA PALABRA O TEXTO ENCRIPTADO
async function encriptar() {
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
        mostrarAlerta('Por favor ingrese un texto para encriptar', 'images/warning.png');
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
    mostrarAlerta('Texto encriptado', 'images/encriptado.png');

    // Deshabilita el botón de encriptar y activa el botón de desencriptar
    encriptarBtn.classList.add('disabled');
    desencriptarBtn.disabled = false;
    desencriptarBtn.classList.remove('disabled');

    // Generar el hash del texto de entrada y el texto encriptado
    try {
        const hashHex = await hashString(textValue);
        document.getElementById("hash-texto").value = hashHex;
    } catch (error) {
        console.error("Error al generar el hash:", error);
        mostrarAlerta('Error al generar el hash', 'images/warning.png');
    }
}
// FUNCION PARA GENERAR HASH SHA256 USANDO LIBRERIA CRYPTOJS
function hashString(input) {
    // Genera el hash usando CryptoJS
    return CryptoJS.SHA256(input).toString(CryptoJS.enc.Hex);
}
// FUNCION PARA DESENCRIPTAR TEXTO POR REMPLAZO DE VOCALES A LA INVERSA
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
        mostrarAlerta('Por favor ingrese un texto para desencriptar', 'images/warning.png');
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
    mostrarAlerta('Texto desencriptado', 'images/desencriptar.png');

    // Deshabilita el botón de desencriptar y activa el botón de encriptar
    desencriptarBtn.disabled = true;
    desencriptarBtn.classList.add('disabled');
    encriptarBtn.disabled = false;
    encriptarBtn.classList.remove('disabled');
}
//COPIAR EL TEXTO DEL CONTENEDOR OUTPUT USANDO NAVIGATOR.CLIPBOARD, Y ACTUALIZA BOTONES Y CONTENEDORES AL ESTADO INICIAL
function copiar() {
    const resultText = document.getElementById("output-texto").value.trim();

    // Verifica si hay texto para copiar
    if (resultText === "") {
        mostrarAlerta('No hay texto para copiar', 'images/warning.png');
        return;
    }

    if (navigator.clipboard) {
        navigator.clipboard.writeText(resultText)
            .then(() => {
                mostrarAlerta('Texto copiado', 'images/copiaralerta.png');
                
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
                console.error("Error al copiar texto:", err);
                mostrarAlerta('Error al copiar texto', 'images/warning.png');
            });
    } else {
        console.warn("API Clipboard no soportada");
        mostrarAlerta('API Clipboard no soportada', 'images/warning.png');
    }
}
// FUNCION PARA PEGAR EL TEXTO EN EL CONTENEDOR INPUT USANDO NAVIGATOR.CLIPBOARD
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

                mostrarAlerta('Texto pegado', 'images/pastealerta.png');
            } else {
                mostrarAlerta('Texto no válido para pegar', 'images/warning.png');
            }
        })
        .catch(err => {
            console.error("Error al pegar del portapapeles: ", err);

            let errorMessage;
            if (err.name === 'NotAllowedError') {
                errorMessage = 'No se permite acceder al portapapeles. Asegúrate de que la operación se realice desde una interacción directa del usuario.';
            } else {
                errorMessage = 'Error desconocido al pegar el texto. Por favor, inténtalo de nuevo.';
            }

            mostrarAlerta(errorMessage, 'images/warning.png');
        });
}
//FUNCION PARA VALIDACION DE TEXTO EN CONTENEDORES DE ENCRIPTADO: SOLO MINUSCULAS SIN SIMBOLOS O NUMEROS
function validarTexto(texto) {
    if (typeof texto !== 'string') {
        console.error('El argumento debe ser una cadena de texto');
        return false;
    }

    // Normaliza el texto para separar los caracteres base de sus acentos
    const valorNormalizado = texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

    // Convierte todo el texto a minúsculas y elimina cualquier carácter que no sea una letra o espacio
    const valorLimpiado = valorNormalizado.toLowerCase().replace(/[^a-z\s]/g, "");

    return valorLimpiado.trim().length > 0; // Devuelve verdadero si el texto es válido
}
//INTERACCION DOM PARA EL BOTON DESENCRIPTAR
function actualizarEstadoBotonDesencriptar() {
    const inputTexto = document.getElementById("input-texto");
    const desencriptarBtn = document.getElementById("btn-desencriptar");

    if (inputTexto && desencriptarBtn) {
        desencriptarBtn.disabled = inputTexto.value.trim() === "";
        desencriptarBtn.classList.toggle('disabled', inputTexto.value.trim() === "");
    } else {
        console.error("Elementos de texto o botón no encontrados");
    }
}
// FUNCION PARA FILTRADO EXTRA DEL CONTENEDOR INPUT: SOLO SE PERMITEN MINUSCULAS SIN SIMBOLOS O NUMEROS
function filtrarEntrada(elemento) {
    if (!elemento || !(elemento instanceof HTMLTextAreaElement)) {
        console.error("El argumento debe ser un elemento textarea");
        return;
    }

    // Reemplaza cualquier carácter que no sea una letra minúscula o espacio
    elemento.value = elemento.value.replace(/[^a-z\s]/g, '');
}
// PARA HACER QUE EL FOOTER SOLO SEA VISIBLE CUANDO SE LLEGA AL FINAL DE LA PAGINA
document.addEventListener('scroll', () => {
    const footer = document.querySelector('footer');
    const scrollPosition = window.innerHeight + window.scrollY;
    const documentHeight = document.documentElement.scrollHeight;

    if (scrollPosition >= documentHeight) {
        footer.style.bottom = '0';
    } else {
        footer.style.bottom = '-100px'; 
    }
});