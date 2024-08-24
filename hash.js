let workers = [];
let numWorkers = 2;

function iniciarFuerzaBruta() {
    const hashObjetivo = document.getElementById('hash-texto').value.trim();
    const output = document.getElementById('resultado');
    const estadoOperacion = document.getElementById('estado-operacion');
    
    if (!hashObjetivo) {
        output.textContent = 'Por favor, ingrese el hash objetivo.';
        return;
    }

    const longitud = 6; // Longitud fija de 4 letras
    const caracteres = 'abcdefghijklmnopqrstuvwxyz'; 

    output.textContent = '';
    estadoOperacion.textContent = 'Iniciando búsqueda...';

    workers.forEach(worker => worker.terminate());
    workers = [];

    let tareaCompletada = false;
    let tareasRestantes = numWorkers;

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
            }
        };
        workers.push(worker);

        worker.postMessage({
            hashObjetivo,
            caracteres,
            longitud,
            workerId: i,
            numWorkers
        });
    }
}

function detenerFuerzaBruta() {
    workers.forEach(worker => worker.terminate());
    workers = [];
}

function copiarhash() {
    const textarea = document.getElementById('hash-texto');
    textarea.select();
    document.execCommand('copy');
    mostrarAlertaHash('images/copiaralerta.png', 'Texto copiado');
}

function pegarhash() {
    navigator.clipboard.readText().then(text => {
        document.getElementById('hash-texto').value = text;
        mostrarAlertaHash('images/copiaralerta.png', 'Texto pegado');
    }).catch(err => {
        console.error("Error al pegar del portapapeles: ", err);
        mostrarAlertaHash('images/warning.png', 'Error al pegar el texto. Asegúrate de que la operación sea realizada desde una interacción del usuario.');
    });
}

document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("btn-hashD").addEventListener("click", iniciarFuerzaBruta);
    document.getElementById("btn-copiarhash").addEventListener("click", copiarhash);
    document.getElementById("btn-pegarhash").addEventListener("click", pegarhash);
});
