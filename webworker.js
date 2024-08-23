self.onmessage = async function (e) {
    const { hashObjetivo, caracteres, minLongitud, maxLongitud } = e.data;

    console.log('Hash objetivo recibido en el worker:', hashObjetivo); // Verificar el valor del hashObjetivo

    let encontrado = false;
    let combinacionesProbadas = 0;
    const startTime = performance.now();

    async function pruebaContraseñas(prefix) {
        if (prefix.length > maxLongitud || encontrado) return;

        if (prefix.length >= minLongitud) {
            for (const char of caracteres) {
                const nuevaPrefix = prefix + char;
                combinacionesProbadas++;

                if (combinacionesProbadas % 1000 === 0) {
                    const elapsedTime = (performance.now() - startTime) / 1000;
                    self.postMessage({ tipo: 'estado', mensaje: `Probadas ${combinacionesProbadas} combinaciones... Tiempo transcurrido: ${elapsedTime.toFixed(2)} segundos` });
                    await new Promise(resolve => setTimeout(resolve, 0)); // Ceder el control para no bloquear el worker
                }

                let hash;
                try {
                    hash = await hashString(nuevaPrefix, 'SHA-256');
                } catch (error) {
                    console.log(`Error al generar el hash: ${error.message}`); // Log para depurar errores de generación de hash
                    self.postMessage({ tipo: 'resultado', mensaje: 'Error al generar el hash: ' + error.message });
                    return;
                }

                if (hash === hashObjetivo) {
                    const elapsedTime = (performance.now() - startTime) / 1000;
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
        const elapsedTime = (performance.now() - startTime) / 1000;
        self.postMessage({ tipo: 'resultado', mensaje: `No se encontró ninguna coincidencia. Tiempo total: ${elapsedTime.toFixed(2)} segundos` });
    }
};

async function hashString(input, algorithm) {
    const encoder = new TextEncoder();
    const data = encoder.encode(input);
    const hashBuffer = await crypto.subtle.digest(algorithm, data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(byte => byte.toString(16).padStart(2, '0')).join('');
}
