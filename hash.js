/*                       SCRIPT PARA DESENCRIPTACION DE HASHES CON SHA256.
 LA LOGICA Y FUNCIONALIDAD DEL CODIGO ES DE MI AUTORIA, Y NO DEBE SER USADO PARA FINES MALICIOSOS.
 NO DEBERIA MODIFICARSE PARA OPERAR A MAS DE 4 CARACTERES POR LIMITACIONES DE HARDWARE Y EVIDENTES CONFLICTOS MORALES
           ******USELO CON RESPONSABILIDAD Y PARA FINES EDUCATIVOS REFERENTES A ENCRIPTACION**   
           CUALQUIER CONSULTA SOBRE ESTE CODIGO ME PUEDE CONTACTAR A : macd5896@gmail.com   */

let workers = [];
let numWorkers = 2;
// MANEJO DE ALERTAS PARA AREA DE HASH: COPIAR,PEGAR,DESENCRIPTAR HASH
function mostrarAlertaHash(icono, mensaje) {
    const alerta = document.getElementById('alerta');
    const alertaIcono = document.getElementById('alerta-icono');
    const alertaMensaje = document.getElementById('alerta-mensaje');

    alertaMensaje.textContent = mensaje;
    alertaIcono.src = icono; 
    alerta.classList.add('show'); 
    
    setTimeout(() => {
        alerta.classList.remove('show');
    }, 3000); 
}
// FUNCION PARA DESENCRIPTAR HASHES SHA256 MAX 4 CARACTERES MINUS, Y MANEJO DE WEBWORKER
function iniciarFuerzaBruta() {
    const hashObjetivo = document.getElementById('hash-texto').value.trim();
    const output = document.getElementById('resultado');
    const estadoOperacion = document.getElementById('estado-operacion');

    if (!hashObjetivo) {
        output.textContent = 'Por favor, ingrese el hash objetivo.';
        return;
    }

    const longitud = 4;
    const caracteres = 'abcdefghijklmnopqrstuvwxyz'; 

    output.textContent = '';
    estadoOperacion.textContent = 'Iniciando búsqueda...';

    workers.forEach(worker => worker.terminate());
    workers = [];

    let tareaCompletada = false;
    let tareasRestantes = numWorkers;

    // Registra el tiempo de inicio
    const startTime = Date.now();

    // Inicializa Web Workers
    for (let i = 0; i < numWorkers; i++) {
        const worker = new Worker('webworker.js');
        
        worker.onmessage = function(e) {
            if (e.data.tipo === 'resultado') {
                if (e.data.mensaje) {
                    output.textContent = e.data.mensaje;
                    estadoOperacion.textContent = 'Operación completada.';
                    tareaCompletada = true;
                    detenerFuerzaBruta();
                } else {
                    tareasRestantes--;
                    if (tareasRestantes === 0 && !tareaCompletada) {
                        estadoOperacion.textContent = 'Hash no encontrado.';
                    }
                }
            } else if (e.data.tipo === 'info') {  // Maneja el mensaje tipo 'info'
                const tiempo = (e.data.tiempo / 1000).toFixed(2);
                const alertaMensaje = `Combinaciones generadas: ${e.data.combinaciones}, Tiempo tomado: ${tiempo} segundos`;
                estadoOperacion.textContent = alertaMensaje;
            }
        };

        workers.push(worker);

        worker.postMessage({
            hashObjetivo,
            caracteres,
            longitud,
            workerId: i,
            numWorkers,
            startTime 
        });
    }
}
// PARA DETENER EL WORKER 
function detenerFuerzaBruta() {
    workers.forEach(worker => worker.terminate());
    workers = [];
}
//COPIAR HASH EN CONTENEDOR HASH
function CopiarHash() {
    const textarea = document.getElementById('hash-texto');
    navigator.clipboard.writeText(textarea.value).then(() => {
        mostrarAlertaHash('images/copiaralerta.png', 'Texto copiado');
    }).catch(err => {
        console.error("Error al copiar al portapapeles: ", err);
        mostrarAlertaHash('images/warning.png', 'Error al copiar el texto.');
    });
}
//PEGAR HASH EN CONTENEDOR HASH,CON VERIFICADOR PARA SHA256
function PegarHash() {
    navigator.clipboard.readText().then(text => {
        // Verifica si el texto es un hash SHA-256 válido
        if (text.length === 64 && /^[a-fA-F0-9]+$/.test(text)) {
            document.getElementById('hash-texto').value = text;
            mostrarAlertaHash('images/copiaralerta.png', 'Texto pegado');
        } else {
            mostrarAlertaHash('images/warning.png', 'Texto no válido. Asegúrate de que sea un hash SHA-256.');
        }
    }).catch(err => {
        console.error("Error al pegar del portapapeles: ", err);
        mostrarAlertaHash('images/warning.png', 'Error al pegar el texto. Asegúrate de que la operación sea realizada desde una interacción del usuario.');
    });
}

document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("btn-hashD").addEventListener("click", iniciarFuerzaBruta);
    document.getElementById("btn-copiarhash").addEventListener("click", CopiarHash);
    document.getElementById("btn-pegarhash").addEventListener("click", PegarHash);
});
