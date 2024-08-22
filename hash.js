//SOLO PARA FINES EDUCATIVOS, NO DEBE USARSE PARA OTROS FINES
if (typeof CRC32 === 'undefined') {
    console.error('CRC32 no está definido. Asegúrate de que crc32.js esté cargado correctamente.');
}

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
async function iniciarFuerzaBruta() {
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

    let encontrado = false;
    let combinacionesProbadas = 0;

    async function pruebaContraseñas(prefix) {
        if (prefix.length > maxLongitud) return;

        for (const char of caracteres) {
            const nuevaPrefix = prefix + char;
            combinacionesProbadas++;
            if (combinacionesProbadas % 1000 === 0) {
                estadoOperacion.textContent = `Probadas ${combinacionesProbadas} combinaciones...`;
            }

            let hash;
            switch (hashType) {
                case 'crc32':
                    hash = CRC32.str(nuevaPrefix).toString(16);
                    break;
                case 'sha1':
                    hash = sha1(nuevaPrefix); 
                    break;
                case 'sha256':
                    hash = await hashString(nuevaPrefix, 'SHA-256');
                    break;
                default:
                    hash = '';
            }

            if (hash === hashObjetivo) {
                output.textContent = `¡Hash encontrado! El mensaje es: ${nuevaPrefix}`;
                estadoOperacion.textContent = 'Operación completada.';
                encontrado = true;
                return;
            }
            await pruebaContraseñas(nuevaPrefix);
            if (encontrado) return;
        }
    }

    estadoOperacion.textContent = 'Iniciando búsqueda...';
    await pruebaContraseñas('');
    if (!encontrado) {
        output.textContent = 'No se encontró ninguna coincidencia.';
        estadoOperacion.textContent = 'Operación completada.';
    }
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
});
