document.addEventListener("DOMContentLoaded", function () {
    // Inicializa el estado del botón de desencriptar
    actualizarEstadoBotonDesencriptar();

    const inputTexto = document.getElementById("input-texto");
    if (inputTexto) {
        inputTexto.addEventListener("input", function(event) {
            filtrarEntrada(event.target);
            actualizarEstadoBotonDesencriptar();
        });
        inputTexto.addEventListener("click", function(event) {
            filtrarEntrada(event.target);
            actualizarEstadoBotonDesencriptar();
        });
    } else {
        console.error("Elemento 'input-texto' no encontrado");
    }
});
//ACTUALIZA LA PAGINA CON CLICK AL LOGO
document.addEventListener('DOMContentLoaded', () => {
    const logo = document.getElementById('logo');
    
    if (logo) {
        logo.addEventListener('click', () => {
        
            window.location.reload();
        });
    }
});
//MANEJO DE MODAL PARA MOSTRAR INFO
// Obtener el modal
var modal = document.getElementById("infoModal");

// Obtener el botón que abre el modal
var btn = document.getElementById("infoBtn");

// Obtener el elemento <span> que cierra el modal
var span = document.getElementsByClassName("close")[0];

// Cuando el usuario hace clic en el botón, se abre el modal
btn.onclick = function() {
    modal.style.display = "block";
}

// Cuando el usuario hace clic en <span> (x), se cierra el modal
span.onclick = function() {
    modal.style.display = "none";
}

// Cuando el usuario hace clic fuera del modal, se cierra el modal
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}
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

// FUNCION PARA GENERAR HASH SHA256
function generarHash(texto, usarSalt = false) {
    try {
        const salt = usarSalt ? generarSalt() : '';
        return CryptoJS.SHA256(texto + salt).toString(CryptoJS.enc.Hex);
    } catch (error) {
        console.error('Error generando hash SHA256:', error);
        alert('Error generando hash SHA256.');
        return null;
    }
}
// Función para generar una clave aleatoria
function generarClave(longitud = 16) {
    const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let clave = '';
    for (let i = 0; i < longitud; i++) {
        clave += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
    }
    return clave;
}

// Función para generar un salt aleatorio
function generarSalt(longitud = 16) {
    return CryptoJS.lib.WordArray.random(longitud).toString(CryptoJS.enc.Hex);
}

// Función para encriptar usando AES
function encriptarAES(texto, clave) {
    try {
        const iv = CryptoJS.lib.WordArray.random(16); // Generar un IV aleatorio
        const encrypted = CryptoJS.AES.encrypt(texto, CryptoJS.enc.Utf8.parse(clave), { iv: iv });
        return iv.toString(CryptoJS.enc.Base64) + ':' + encrypted.toString();
    } catch (error) {
        console.error('Error encriptando con AES:', error);
        mostrarAlerta('Error encriptando con AES.', 'images/warning.png');
        return null;
    }
}

// Función para desencriptar usando AES
function desencriptarAES(textoEncriptado, clave) {
    try {
        const key = CryptoJS.enc.Utf8.parse(clave); // Convertir clave a formato adecuado
        const parts = textoEncriptado.split(':');
        if (parts.length !== 2) {
            throw new Error('Formato del texto encriptado incorrecto.');
        }
        const iv = CryptoJS.enc.Base64.parse(parts[0]);
        const encryptedText = parts[1];
        const decrypted = CryptoJS.AES.decrypt(encryptedText, key, { iv: iv });
        return decrypted.toString(CryptoJS.enc.Utf8);
    } catch (error) {
        console.error('Error desencriptando con AES:', error);
        mostrarAlerta('Error desencriptando con AES.', 'images/warning.png');
        return null;
    }
}

// Función para encriptar usando Triple DES
function encriptarTripleDES(texto, clave) {
    try {
        const iv = CryptoJS.lib.WordArray.random(8); // Generar un IV aleatorio para Triple DES
        const encrypted = CryptoJS.TripleDES.encrypt(texto, CryptoJS.enc.Utf8.parse(clave), { iv: iv });
        return iv.toString(CryptoJS.enc.Base64) + ':' + encrypted.toString();
    } catch (error) {
        console.error('Error encriptando con Triple DES:', error);
        mostrarAlerta('Error encriptando con Triple DES.', 'images/warning.png');
        return null;
    }
}

// Función para desencriptar usando Triple DES
function desencriptarTripleDES(textoEncriptado, clave) {
    try {
        const key = CryptoJS.enc.Utf8.parse(clave); 
        const parts = textoEncriptado.split(':');
        if (parts.length !== 2) {
            throw new Error('Formato del texto encriptado incorrecto.');
        }
        const iv = CryptoJS.enc.Base64.parse(parts[0]); 
        const encryptedText = parts[1];
        const decrypted = CryptoJS.TripleDES.decrypt(encryptedText, key, { iv: iv });
        return decrypted.toString(CryptoJS.enc.Utf8);
    } catch (error) {
        console.error('Error desencriptando con Triple DES:', error);
        mostrarAlerta('Error desencriptando con Triple DES.', 'images/warning.png');
        return null;
    }
}
// Función para mostrar u ocultar el menú desplegable
function mostrarMenuDesplegable(visible) {
    const menuDesplegable = document.getElementById('menu-desplegable');
    if (visible) {
        menuDesplegable.classList.add('open');
    } else {
        menuDesplegable.classList.remove('open');
    }
}

// FUNCION DE ENCRIPTACION
function encriptar() {
    // Obtiene elementos
    const textInput = document.getElementById("input-texto");
    const parrafo = document.getElementById("output-texto");
    const encriptarBtn = document.getElementById("btn-encriptar");
    const metodoSeleccionado = document.querySelector('input[name="hash-selector"]:checked');

    // Verifica que los elementos existen
    if (!textInput || !parrafo || !encriptarBtn || !metodoSeleccionado) {
        console.error("No se encontraron uno o más elementos necesarios en el DOM");
        mostrarAlerta('Error al acceder a los elementos de la página.', 'images/error.png');
        return;
    }

    const textValue = textInput.value.trim();
    if (textValue === "") {
        mostrarAlerta('Por favor ingrese un texto para encriptar', 'images/warning.png');
        return;
    }

    let textoEncriptado;
    let clave;

    switch (metodoSeleccionado.value) {
        case 'aes':
            clave = generarClave(); // Generar clave automáticamente
            document.getElementById("clave-valor").value = clave; 
            textoEncriptado = encriptarAES(textValue, clave);
            mostrarMenuDesplegable(true);
            break;
        case 'triple-des':
            clave = generarClave(); // Generar clave automáticamente
            document.getElementById("clave-valor").value = clave; 
            textoEncriptado = encriptarTripleDES(textValue, clave);
            mostrarMenuDesplegable(true);
            break;
        case 'default':
        default:
            // Método por defecto de alura
            textoEncriptado = textValue
                .replace(/e/g, "enter")
                .replace(/i/g, "imes")
                .replace(/a/g, "ai")
                .replace(/o/g, "ober")
                .replace(/u/g, "ufat");
            break;
    }

    // Verificar si la encriptación fue exitosa
    if (textoEncriptado) {
        parrafo.value = textoEncriptado;
        mostrarAlerta('Texto encriptado', 'images/encriptado.png');

        // Muestra el hash si es necesario
        const hashTexto = metodoSeleccionado.value === 'default' ? 
            generarHash(textValue) : 
            generarHash(textoEncriptado);
        document.getElementById("hash-texto").value = hashTexto;
    } else {
        mostrarAlerta('Error durante la encriptación', 'images/error.png');
    }

    // Habilita el botón de desencriptar y desactiva el botón de encriptar
    document.getElementById('btn-desencriptar').disabled = false;
    encriptarBtn.classList.add('disabled');
}

// FUNCION PARA DESENCRIPTAR
function desencriptar() {
    // Obtiene elementos
    const inputTexto = document.getElementById("input-texto");
    const outputTexto = document.getElementById("output-texto");
    const desencriptarBtn = document.getElementById("btn-desencriptar");
    const metodoSeleccionado = document.querySelector('input[name="hash-selector"]:checked');

    // Verificar que los elementos existen
    if (!inputTexto || !outputTexto || !desencriptarBtn || !metodoSeleccionado) {
        console.error("No se encontraron uno o más elementos necesarios en el DOM");
        mostrarAlerta('Error al acceder a los elementos de la página.', 'images/error.png');
        return;
    }

    const textoEncriptado = inputTexto.value.trim();
    if (textoEncriptado === "") {
        mostrarAlerta('Por favor ingrese el texto encriptado en el área de entrada', 'images/warning.png');
        return;
    }

    let textoDesencriptado;
    let clave;

    switch (metodoSeleccionado.value) {
        case 'aes':
            clave = document.getElementById("clave-valor").value.trim(); // Obtener clave del text key
            if (!clave) {
                mostrarAlerta('Por favor ingrese una clave para AES', 'images/warning.png');
                mostrarMenuDesplegable(true);
                return;
            }
            textoDesencriptado = desencriptarAES(textoEncriptado, clave);
            mostrarMenuDesplegable(true);
            break;
        case 'triple-des':
            clave = document.getElementById("clave-valor").value.trim(); // Obtener clave del text key
            if (!clave) {
                mostrarAlerta('Por favor ingrese una clave para Triple DES', 'images/warning.png');
                mostrarMenuDesplegable(true);
                return;
            }
            textoDesencriptado = desencriptarTripleDES(textoEncriptado, clave);
            mostrarMenuDesplegable(true);
            break;
        case 'default':
        default:
            // Método por defecto
            textoDesencriptado = textoEncriptado
                .replace(/enter/g, "e")
                .replace(/imes/g, "i")
                .replace(/ai/g, "a")
                .replace(/ober/g, "o")
                .replace(/ufat/g, "u");
            break;
    }

    // Verificar si la desencriptación fue exitosa
    if (textoDesencriptado !== undefined) {
        outputTexto.value = textoDesencriptado;
        mostrarAlerta('Texto desencriptado', 'images/desencriptar.png');
    } else {
        mostrarAlerta('Error durante la desencriptación', 'images/error.png');
    }

    // Habilita el botón de encriptar y desactiva el botón de desencriptar
    document.getElementById('btn-encriptar').disabled = false;
    desencriptarBtn.disabled = true;
    desencriptarBtn.classList.add('disabled');
    mostrarMenuDesplegable(false);
}

// FUNCION PARA COOPIAR EL KEY DENTRO DEL MENU DESPLEGABLE
function copiarClave() {
    const claveTextarea = document.getElementById('clave-valor');
    if (claveTextarea.value.trim() === "") {
        mostrarAlerta('No hay clave para copiar', 'images/warning.png');
        return;
    }
    navigator.clipboard.writeText(claveTextarea.value)
        .then(() => {
            mostrarAlerta('Clave copiada', 'images/copiaralerta.png');
            claveTextarea.value = ""; 
            mostrarMenuDesplegable(false);
        })
        .catch(err => {
            console.error("Error al copiar clave:", err);
            mostrarAlerta('Error al copiar clave', 'images/warning.png');
        });
}
//COPIAR EL TEXTO DEL CONTENEDOR OUTPUT USANDO NAVIGATOR.CLIPBOARD, Y ACTUALIZA BOTONES Y CONTENEDORES AL ESTADO INICIAL
function copiar() {
    const resultText = document.getElementById("output-texto").value.trim();

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
            inputText.value = text; // Permite todos los caracteres
            document.getElementById("btn-encriptar").disabled = false;
            document.getElementById("btn-encriptar").classList.remove('disabled');
            actualizarEstadoBotonDesencriptar();

            mostrarAlerta('Texto pegado', 'images/pastealerta.png');
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

// FUNCION PARA VALIDAR TEXTO
function validarTexto(texto) {
    const seleccion = document.querySelector('input[name="hash-selector"]:checked');
    
    // Si 'aes' o 'triple-des' están seleccionados, desactiva la validación
    if (seleccion && (seleccion.value === 'aes' || seleccion.value === 'triple-des')) {
        return true; // Permite cualquier texto cuando 'aes' o 'triple-des' están seleccionados
    }

    // Verifica que el argumento sea una cadena de texto
    if (typeof texto !== 'string') {
        console.error('El argumento debe ser una cadena de texto');
        return false;
    }

    // Normaliza el texto para separar los caracteres base de sus acentos
    const valorNormalizado = texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

    // Convierte todo el texto a minúsculas y elimina cualquier carácter que no sea una letra o espacio
    const valorLimpiado = valorNormalizado.toLowerCase().replace(/[^a-z\s]/g, "");

    // Devuelve verdadero si el texto tiene longitud mayor a 0, es decir, no está vacío
    return valorLimpiado.trim().length > 0;
}

// FUNCION PARA ACTUALIZAR ESTADO DEL BOTON DESENCRIPTAR
function actualizarEstadoBotonDesencriptar() {
    const inputTexto = document.getElementById("input-texto");
    const desencriptarBtn = document.getElementById("btn-desencriptar");
    
    if (inputTexto && desencriptarBtn) {
        desencriptarBtn.disabled = !validarTexto(inputTexto.value.trim());
    } else {
        console.error("Elementos de texto o botón no encontrados");
    }
}
// FUNCION PARA FILTRADO EXTRA DEL CONTENEDOR INPUT: SOLO SE PERMITEN MINUSCULAS SIN SIMBOLOS O NUMEROS
function filtrarEntrada(elemento) {
    const seleccion = document.querySelector('input[name="hash-selector"]:checked');

    // Si 'aes' o 'triple-des' están seleccionados, permite todos los caracteres
    if (seleccion && (seleccion.value === 'aes' || seleccion.value === 'triple-des')) {
        return;
    }

    // Reemplaza cualquier carácter que no sea una letra minúscula o espacio
    elemento.value = elemento.value.replace(/[^a-z\s]/g, '');
}
document.getElementById('copy-key').addEventListener('click', copiarClave);
document.getElementById('menu-toggle').addEventListener('click', function() {
    mostrarMenuDesplegable(false);
});

const textareas = document.querySelectorAll('textarea');
textareas.forEach(textarea => {
    textarea.addEventListener('input', filtrarEntrada);
});