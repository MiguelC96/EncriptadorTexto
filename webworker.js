// Importar librerías desde un CDN
importScripts('https://cdnjs.cloudflare.com/ajax/libs/crc-32/1.2.2/crc32.min.js');
importScripts('https://cdnjs.cloudflare.com/ajax/libs/js-sha1/0.7.0/sha1.min.js');

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
    const { hashObjetivo, hashType, caracteres, maxLongitud } = e.data;

    let encontrado = false;
    let combinacionesProbadas = 0;

    async function pruebaContraseñas(prefix) {
        if (prefix.length > maxLongitud || encontrado) return;

        for (const char of caracteres) {
            const nuevaPrefix = prefix + char;
            combinacionesProbadas++;

            if (combinacionesProbadas % 1000 === 0) {
                self.postMessage({ tipo: 'estado', mensaje: `Probadas ${combinacionesProbadas} combinaciones...` });
                await new Promise(resolve => setTimeout(resolve, 0));  // Pausa para liberar el hilo principal
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
                self.postMessage({ tipo: 'resultado', mensaje: `¡Hash encontrado! El mensaje es: ${nuevaPrefix}` });
                encontrado = true;
                return;
            }
            await pruebaContraseñas(nuevaPrefix);
            if (encontrado) return;
        }
    }

    await pruebaContraseñas('');

    if (!encontrado) {
        self.postMessage({ tipo: 'resultado', mensaje: 'No se encontró ninguna coincidencia.' });
    }
};
