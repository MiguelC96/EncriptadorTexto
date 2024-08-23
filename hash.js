let worker;

// Función para mostrar alertas
function mostrarAlertaHash(icono, mensaje) {
    const alerta = document.getElementById('alerta');
    const alertaIcono = document.getElementById('alerta-icono');
    const alertaMensaje = document.getElementById('alerta-mensaje');

    alertaMensaje.textContent = mensaje;
    alertaIcono.src = icono; 
    alerta.classList.add('show'); 
    
    
    setTimeout(ocultarAlertaHash, 5000);
}

function ocultarAlertaHash() {
    const alerta = document.getElementById('alerta');
    alerta.classList.remove('show'); 
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

    
    const minLongitud = 1;
    const maxLongitud = 6;
    const caracteres = 'abcdefghijklmnopqrstuvwxyz'; 

    
    output.textContent = '';
    estadoOperacion.textContent = '';

    //Web Worker
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
        caracteres,
        minLongitud,
        maxLongitud
    });
}

// Función para detener la fuerza bruta
function detenerFuerzaBruta() {
    if (worker) {
        worker.terminate();
        worker = null;
    }
}

// Función para copiar el hash
function copiarhash() {
    const textarea = document.getElementById('hash-texto');
    textarea.select();
    document.execCommand('copy');
    mostrarAlertaHash('images/copiaralerta.png', 'Texto copiado');
}

// Función para pegar el hash
function pegarhash() {
    navigator.clipboard.readText().then(text => {
        document.getElementById('hash-texto').value = text;
        mostrarAlertaHash('images/copiaralerta.png', 'Texto pegado');
    }).catch(err => {
        console.error("Error al pegar del portapapeles: ", err);
        mostrarAlertaHash('images/warning.png', 'Error al pegar el texto. Asegúrate de que la operación sea realizada desde una interacción del usuario.');
    });
}

// Inicializa eventos cuando el DOM esté listo
document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("btn-hashD").addEventListener("click", iniciarFuerzaBruta);
    document.getElementById("btn-copiarhash").addEventListener("click", copiarhash);
    document.getElementById("btn-pegarhash").addEventListener("click", pegarhash);
});
