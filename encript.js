// Función para mostrar alertas
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
        const iv = CryptoJS.enc.Base64.parse(parts[0]); // El IV puede ser en formato Base64
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
        const key = CryptoJS.enc.Utf8.parse(clave); // Convertir clave a formato adecuado
        const parts = textoEncriptado.split(':');
        if (parts.length !== 2) {
            throw new Error('Formato del texto encriptado incorrecto.');
        }
        const iv = CryptoJS.enc.Base64.parse(parts[0]); // El IV puede ser en formato Base64
        const encryptedText = parts[1];
        const decrypted = CryptoJS.TripleDES.decrypt(encryptedText, key, { iv: iv });
        return decrypted.toString(CryptoJS.enc.Utf8);
    } catch (error) {
        console.error('Error desencriptando con Triple DES:', error);
        mostrarAlerta('Error desencriptando con Triple DES.', 'images/warning.png');
        return null;
    }
}

// Función para manejar la encriptación según el selector
function encriptarPorSelector() {
    const texto = document.getElementById('input-texto').value;
    const seleccion = document.querySelector('input[name="hash-selector"]:checked');
    const outputTexto = document.getElementById('output-texto');
    const claveTextarea = document.getElementById('clave-valor');
    const hashTexto = document.getElementById('hash-texto');
    const valorSeleccionado = seleccion ? seleccion.value : '';

    let clave;
    let resultado;
    const salt = generarSalt();

    if (valorSeleccionado === 'aes') {
        clave = generarClave();
        resultado = encriptarAES(texto, clave);
        claveTextarea.value = clave;
        mostrarMenuDesplegable(true);
    } else if (valorSeleccionado === 'triple-des') {
        clave = generarClave();
        resultado = encriptarTripleDES(texto, clave);
        claveTextarea.value = clave;
        mostrarMenuDesplegable(true);
    } else {
        mostrarAlerta('Selección de encriptación no válida.', 'images/warning.png');
        return;
    }

    outputTexto.value = resultado;
    hashTexto.value = generarHash(resultado, salt);
}

// Función para manejar la desencriptación según el selector
function desencriptarPorSelector() {
    const textoEncriptado = document.getElementById('input-texto').value;
    const clave = document.getElementById('clave-valor').value;
    const outputTexto = document.getElementById('output-texto');
    const seleccion = document.querySelector('input[name="hash-selector"]:checked');
    const valorSeleccionado = seleccion ? seleccion.value : '';

    if (!clave) {
        mostrarMenuDesplegable(true);
        mostrarAlerta('Por favor ingrese la clave para desencriptar.', 'images/warning.png');
        return;
    }

    let resultado;
    if (valorSeleccionado === 'aes') {
        resultado = desencriptarAES(textoEncriptado, clave);
    } else if (valorSeleccionado === 'triple-des') {
        resultado = desencriptarTripleDES(textoEncriptado, clave);
    } else {
        mostrarAlerta('Selección de desencriptación no válida.', 'images/warning.png');
        return;
    }

    outputTexto.value = resultado || 'Error al desencriptar.';
    mostrarMenuDesplegable(false);
}

// Función para generar un hash (puedes implementar tu propia función si es necesario)
function generarHash(texto, salt) {
    return CryptoJS.SHA256(texto + salt).toString(CryptoJS.enc.Hex);
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

// Función para copiar texto al portapapeles
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
                document.getElementById("input-texto").value = "";
                document.getElementById("output-texto").value = "";
                document.getElementById("btn-encriptar").disabled = false;
                document.getElementById("btn-desencriptar").disabled = true;
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

// Función para pegar texto desde el portapapeles
function pegar() {
    const inputText = document.getElementById("input-texto");
    if (!inputText) {
        console.error("Elemento input-texto no encontrado");
        return;
    }
    navigator.clipboard.readText()
        .then(text => {
            inputText.value = text;
            document.getElementById("btn-encriptar").disabled = false;
        })
        .catch(err => {
            console.error("Error al pegar del portapapeles:", err);
            mostrarAlerta('Error al pegar del portapapeles', 'images/warning.png');
        });
}

// Función para copiar la clave al portapapeles
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
        })
        .catch(err => {
            console.error("Error al copiar clave:", err);
            mostrarAlerta('Error al copiar clave', 'images/warning.png');
        });
}

// Función para actualizar el estado del botón de desencriptar
function actualizarEstadoBotonDesencriptar() {
    const inputTexto = document.getElementById('input-texto').value;
    const botonDesencriptar = document.getElementById('btn-desencriptar');
    botonDesencriptar.disabled = inputTexto.trim() === '';
}

// Eventos de los botones
document.getElementById('btn-encriptar').addEventListener('click', encriptarPorSelector);
document.getElementById('btn-desencriptar').addEventListener('click', desencriptarPorSelector);
document.getElementById('btn-copiar').addEventListener('click', copiar);
document.getElementById('btn-pegar').addEventListener('click', pegar);
document.getElementById('copy-key').addEventListener('click', copiarClave);
document.getElementById('menu-toggle').addEventListener('click', function () {
    mostrarMenuDesplegable(false);
});
