
// Función auxiliar para SHA-256
async function hashString(input, algorithm) {
    const encoder = new TextEncoder();
    const data = encoder.encode(input);
    const hashBuffer = await crypto.subtle.digest(algorithm, data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(byte => byte.toString(16).padStart(2, '0')).join('');
}

// Evento que maneja los mensajes del hilo principal
self.onmessage = async function (e) {
    const { hashObjetivo, hashType, caracteres, minLongitud, maxLongitud } = e.data;

    let encontrado = false;
    let combinacionesProbadas = 0;
    const startTime = performance.now();  // Captura el tiempo de inicio

    async function pruebaContraseñas(prefix) {
        if (prefix.length > maxLongitud || encontrado) return;

        // Comprobar si la longitud actual está dentro del rango permitido
        if (prefix.length >= minLongitud) {
            for (const char of caracteres) { 
                const nuevaPrefix = prefix + char;
                combinacionesProbadas++;

                if (combinacionesProbadas % 1000 === 0) {
                    const elapsedTime = (performance.now() - startTime) / 1000;  // Calcula el tiempo transcurrido en segundos
                    self.postMessage({ tipo: 'estado', mensaje: `Probadas ${combinacionesProbadas} combinaciones... Tiempo transcurrido: ${elapsedTime.toFixed(2)} segundos` });
                    await new Promise(resolve => setTimeout(resolve, 0));  // Pausa para liberar el hilo principal
                }

                let hash;
                if (hashType === 'sha256') {
                    hash = await hashString(nuevaPrefix, 'SHA-256');
                } else {
                    // Tipo de hash no soportado
                    hash = '';
                }

                if (hash === hashObjetivo) {
                    const elapsedTime = (performance.now() - startTime) / 1000;  // Calcula el tiempo transcurrido en segundos
                    self.postMessage({ tipo: 'resultado', mensaje: `¡Hash encontrado! El mensaje es: ${nuevaPrefix}. Tiempo total: ${elapsedTime.toFixed(2)} segundos` });
                    encontrado = true;
                    return;
                }
                await pruebaContraseñas(nuevaPrefix);
                if (encontrado) return;
            }
        } else {
            for (const char of caracteres) {
                await pruebaContraseñas(prefix + char);
                if (encontrado) return;
            }
        }
    }

    await pruebaContraseñas('');

    if (!encontrado) {
        const elapsedTime = (performance.now() - startTime) / 1000;  // Calcula el tiempo transcurrido en segundos
        self.postMessage({ tipo: 'resultado', mensaje: `No se encontró ninguna coincidencia. Tiempo total: ${elapsedTime.toFixed(2)} segundos` });
    }
};
