self.importScripts('https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.2.0/crypto-js.min.js');

self.onmessage = function(e) {
    const { hashObjetivo, caracteres, longitud, workerId, numWorkers, startTime } = e.data;

    const combinaciones = generarCombinaciones(caracteres, longitud);
    const resultado = fuerzaBruta(hashObjetivo, combinaciones, longitud, workerId, numWorkers);

    // Enviar el resultado del hash encontrado o no encontrado
    self.postMessage({ tipo: 'resultado', mensaje: resultado });

    // Enviar información adicional sobre el tiempo y combinaciones
    const tiempo = Date.now() - startTime; // Calcula el tiempo transcurrido
    const combinacionesGeneradas = combinaciones.length; // Número total de combinaciones generadas
    self.postMessage({
        tipo: 'info',
        combinaciones: combinacionesGeneradas,
        tiempo: tiempo
    });
};

function fuerzaBruta(hashObjetivo, combinaciones, longitud, workerId, numWorkers) {
    const chunkSize = Math.ceil(combinaciones.length / numWorkers);
    const start = workerId * chunkSize;
    const end = Math.min(start + chunkSize, combinaciones.length);

    for (let i = start; i < end; i++) {
        const combinacion = combinaciones[i];
        const hash = hashString(combinacion);
        if (hash === hashObjetivo) {
            return `¡Hash encontrado! Texto: ${combinacion}`;
        }
    }

    return null; // No encontrado
}

function generarCombinaciones(caracteres, longitud) {
    const combinaciones = [];
    const caracteresArray = caracteres.split('');

    function generarCombinacion(combinacion, profundidad) {
        if (profundidad === longitud) {
            combinaciones.push(combinacion);
            return;
        }
        for (const caracter of caracteresArray) {
            generarCombinacion(combinacion + caracter, profundidad + 1);
        }
    }

    generarCombinacion('', 0);
    return combinaciones;
}

function hashString(input) {
    return CryptoJS.SHA256(input).toString(CryptoJS.enc.Hex);
}
