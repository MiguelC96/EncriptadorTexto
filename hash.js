// Variable para detener la fuerza bruta si es necesario
let stopBruteForce = false;
let worker;

// Función para mostrar alertas
function mostrarAlerta(imagen, mensaje) {
    console.log(mensaje); 
}

// Función para generar el hash basado en la selección
async function hash() {
    if (typeof CRC32 === 'undefined' || typeof sha1 !== 'function') {
        console.error('CRC32 o sha1 no están definidos.');
        mostrarAlerta('images/warning.png', 'Error en las funciones de hash.');
        return;
    }

    const inputText = document.getElementById("input-texto").value.trim();
    const hashOutput = document.getElementById("hash-texto");
    const selectedHashType = document.querySelector('input[name="hash-selector"]:checked').value;

    if (!inputText) {
        mostrarAlerta('images/warning.png', 'Por favor ingrese un texto para generar el hash');
        return;
    }

    try {
        let hashHex;
        switch (selectedHashType) {
            case 'crc32':
                hashHex = CRC32.str(inputText).toString(16); 
                break;
            case 'sha1':
                hashHex = sha1(inputText); 
                break;
            case 'sha256':
                hashHex = await hashString(inputText, 'SHA-256');
                break;
            default:
                mostrarAlerta('images/warning.png', 'Tipo de hash no soportado');
                return;
        }

        hashOutput.value = hashHex;
        mostrarAlerta('images/hash.png', 'Hash generado con éxito');
    } catch (error) {
        console.error("Error al generar el hash:", error);
        mostrarAlerta('images/warning.png', 'Error al generar el hash');
    }
}

// Función para generar hash usando SHA-256
async function hashString(input, algorithm) {
    const encoder = new TextEncoder();
    const data = encoder.encode(input);
    const hashBuffer = await crypto.subtle.digest(algorithm, data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(byte => byte.toString(16).padStart(2, '0')).join('');
}

// Función de fuerza bruta para desencriptar el hash
function iniciarFuerzaBruta() {
    const hashObjetivo = document.getElementById('hash-texto').value.trim();
    const output = document.getElementById('resultado');
    const estadoOperacion = document.getElementById('estado-operacion');
    
    if (!hashObjetivo) {
        output.textContent = 'Por favor, ingrese el hash objetivo.';
        return;
    }

    const caracteres = 'abcdefghijklmnopqrstuvwxyz'; 
    let maxLongitud;
    const hashType = document.querySelector('input[name="hash-selector"]:checked').value;

    switch (hashType) {
        case 'crc32':
            maxLongitud = 8;
            break;
        case 'sha1':
            maxLongitud = 8;
            break;
        case 'sha256':
            maxLongitud = 4;
            break;
        default:
            output.textContent = 'Tipo de hash no soportado.';
            return;
    }

    // Configura el Web Worker
    worker = new Worker('webworker.js');
    worker.onmessage = function(e) {
        if (e.data.tipo === 'estado') {
            estadoOperacion.textContent = e.data.mensaje;
        } else if (e.data.tipo === 'resultado') {
            output.textContent = e.data.mensaje;
            estadoOperacion.textContent = 'Operación completada.';
            if (e.data.mensaje.startsWith('¡Hash encontrado!')) {
                detenerFuerzaBruta();
            }
        }
    };

    estadoOperacion.textContent = 'Iniciando búsqueda...';
    worker.postMessage({
        hashObjetivo,
        hashType,
        caracteres,
        maxLongitud
    });
}

// Función para detener la fuerza bruta
function detenerFuerzaBruta() {
    if (worker) {
        worker.terminate();
        worker = null;
    }
    stopBruteForce = true;
}

// Función para copiar el hash
function copiar() {
    const textarea = document.getElementById('hash-texto');
    textarea.select();
    document.execCommand('copy');
}

// Función para pegar el hash
function pegar() {
    navigator.clipboard.readText().then(text => {
        document.getElementById('hash-texto').value = text;
        mostrarAlerta('images/copiaralerta.png', 'Texto pegado');
    });
}

// Inicializa eventos cuando el DOM esté listo
document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("btn-hash").addEventListener("click", hash);
    document.getElementById("btn-hashD").addEventListener("click", iniciarFuerzaBruta);
    document.getElementById("btn-copiarhash").addEventListener("click", copiar);
    document.getElementById("btn-pegarhash").addEventListener("click", pegar);
    document.getElementById("btn-cancelar").addEventListener("click", detenerFuerzaBruta);
});
