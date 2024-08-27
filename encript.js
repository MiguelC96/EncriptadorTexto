document.addEventListener('DOMContentLoaded', function () {
    // GENERAR CLAVE
    function generarClave(longitud = 16) {
        const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let clave = '';
        for (let i = 0; i < longitud; i++) {
            clave += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
        }
        return clave;
    }
    //COPIAR CLAVE GENERADA
    function copiarClave() {
        const claveTextarea = document.getElementById('clave-valor');
    
        if (!claveTextarea) {
            console.error("Elemento 'clave-valor' no encontrado");
            return;
        }
    
        const clave = claveTextarea.value.trim();
    
        if (clave === "") {
            mostrarAlerta('No hay clave para copiar', 'images/warning.png');
            return;
        }
    
        if (navigator.clipboard) {
            navigator.clipboard.writeText(clave)
                .then(() => {
                    mostrarAlerta('Clave copiada', 'images/copiaralerta.png');
    
                    // Borra el valor del campo de clave
                    claveTextarea.value = "";
                })
                .catch(err => {
                    console.error("Error al copiar clave:", err);
                    mostrarAlerta('Error al copiar clave', 'images/warning.png');
                });
        } else {
            console.warn("API Clipboard no soportada");
            mostrarAlerta('API Clipboard no soportada', 'images/warning.png');
        }
    }
    // ENCRIPTACION AES CON API
    function encriptarAES(texto, clave) {
        try {
            const iv = CryptoJS.lib.WordArray.random(16); // Generar un IV aleatorio
            const encrypted = CryptoJS.AES.encrypt(texto, CryptoJS.enc.Utf8.parse(clave), { iv: iv });
            return iv.toString(CryptoJS.enc.Base64) + ':' + encrypted.toString();
        } catch (error) {
            console.error('Error encriptando con AES:', error);
            alert('Error encriptando con AES.');
            return null;
        }
    }

    // DESENCRIPTAR AES CON API
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
            alert('Error desencriptando con AES.');
            return null;
        }
    }

    // ENCRIPTAR HMAC
    function encriptarHMAC(texto, clave) {
        try {
            return CryptoJS.HmacSHA256(texto, clave).toString(CryptoJS.enc.Hex);
        } catch (error) {
            console.error('Error encriptando con HMAC:', error);
            alert('Error encriptando con HMAC.');
            return null;
        }
    }

    // DESENCRIPTAR HMAC
    function desencriptarHMAC(textoHash, clave) {
        try {
            const hash = CryptoJS.HmacSHA256(textoHash, clave).toString(CryptoJS.enc.Hex);
            return hash;
        } catch (error) {
            console.error('Error desencriptando con HMAC:', error);
            alert('Error desencriptando con HMAC.');
            return null;
        }
    }

    // HASH SHA256 CON SALT
    function generarHash(texto, salt) {
        try {
            const textoConSalt = texto + salt;
            return CryptoJS.SHA256(textoConSalt).toString(CryptoJS.enc.Hex);
        } catch (error) {
            console.error('Error generando hash SHA256:', error);
            alert('Error generando hash SHA256.');
            return null;
        }
    }

    // GENERAR SALT
    function generarSalt(longitud = 16) {
        return CryptoJS.lib.WordArray.random(longitud).toString(CryptoJS.enc.Hex);
    }

    // MUESTRA EL MENU
    function mostrarMenuDesplegable(visible) {
        const menuDesplegable = document.getElementById('menu-desplegable');
        if (visible) {
            menuDesplegable.classList.add('open');
        } else {
            menuDesplegable.classList.remove('open');
        }
    }

    // FUNCIONES DE MANEJO DE MENU
    function manejarMenuDesplegable() {
        const seleccion = document.querySelector('input[name="hash-selector"]:checked');
        if (seleccion) {
            mostrarMenuDesplegable(true);
        } else {
            mostrarMenuDesplegable(false);
        }
    }

    // COPIAR SIN NORMALIZADO
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
                    
                    // Limpia los campos de texto y restablece el estado de los botones
                    const inputTexto = document.getElementById("input-texto");
                    const outputTexto = document.getElementById("output-texto");
                    const encriptarBtn = document.getElementById("btn-encriptar");
                    const desencriptarBtn = document.getElementById("btn-desencriptar");
                    const pegarBtn = document.getElementById("btn-pegar");

                    if (inputTexto) {
                        inputTexto.value = "";
                    } else {
                        console.warn("Elemento 'input-texto' no encontrado");
                    }

                    if (outputTexto) {
                        outputTexto.value = "";
                    } else {
                        console.warn("Elemento 'output-texto' no encontrado");
                    }

                    if (encriptarBtn) {
                        encriptarBtn.disabled = false;
                        encriptarBtn.classList.remove('disabled');
                    } else {
                        console.warn("Elemento 'btn-encriptar' no encontrado");
                    }

                    if (desencriptarBtn) {
                        desencriptarBtn.disabled = true;
                        desencriptarBtn.classList.add('disabled');
                    } else {
                        console.warn("Elemento 'btn-desencriptar' no encontrado");
                    }

                    if (pegarBtn) {
                        pegarBtn.disabled = false;
                        pegarBtn.classList.remove('disabled');
                    } else {
                        console.warn("Elemento 'btn-pegar' no encontrado");
                    }
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

    // PEGAR SIN NORMALIZADO
    function pegar() {
        const inputText = document.getElementById("input-texto");

        if (!inputText) {
            console.error("Elemento input-texto no encontrado");
            return;
        }

        navigator.clipboard.readText()
            .then(text => {
                inputText.value = text; // Permite todos los caracteres
                document.getElementById("btn-encriptar").disabled = false;
                document.getElementById("btn-encriptar").classList.remove('disabled');
                actualizarEstadoBotonDesencriptar();

                mostrarAlerta('Texto pegado', 'images/pastealerta.png');
            })
            .catch(err => {
                console.error("Error al pegar del portapapeles: ", err);

                let errorMessage;
                if (err.name === 'NotAllowedError') {
                    errorMessage = 'No se permite acceder al portapapeles. Asegúrate de que la operación se realice desde una interacción directa del usuario.';
                } else {
                    errorMessage = 'Error desconocido al pegar el texto. Por favor, inténtalo de nuevo.';
                }

                mostrarAlerta(errorMessage, 'images/warning.png');
            });
    }

    // FUNCION ENCRIPTAR SEGUN SELECTOR
    window.encriptarPorSelector = function () {
        const texto = document.getElementById('input-texto').value;
        const seleccion = document.querySelector('input[name="hash-selector"]:checked');
        const outputTexto = document.getElementById('output-texto');
        const hashTexto = document.getElementById('hash-texto');
        const claveTextarea = document.getElementById('clave-valor');
        const hmacHashTextarea = document.getElementById('hmac-hash-valor');
        const valorSeleccionado = seleccion.value;
        let clave;
        let resultado;
        const salt = generarSalt();

        switch (valorSeleccionado) {
            case 'aes':
                clave = generarClave();
                resultado = encriptarAES(texto, clave);
                claveTextarea.value = clave;
                mostrarMenuDesplegable(true); // Mostrar el menú cuando se seleccione AES
                break;
            case 'hmac':
                clave = generarClave();
                resultado = encriptarHMAC(texto, clave);
                claveTextarea.value = clave;
                hmacHashTextarea.value = generarHash(resultado, salt);
                mostrarMenuDesplegable(true); // Mostrar el menú cuando se seleccione HMAC
                break;
            default:
                console.error('Selección de encriptación no válida.');
                alert('Selección de encriptación no válida.');
                return;
        }

        outputTexto.value = resultado;
        hashTexto.value = generarHash(resultado, salt);

        // Actualiza el filtrado basado en la selección
        manejarFiltradoPorSelector();
    };

    // DESENCRIPTAR SEGUN SELECTOR
    window.desencriptarPorSelector = function () {
        const textoEncriptado = document.getElementById('input-texto').value;
        const seleccion = document.querySelector('input[name="hash-selector"]:checked');
        const clave = document.getElementById('clave-valor').value;
        const inputTexto = document.getElementById('input-texto');
        const outputTexto = document.getElementById('output-texto');

        if (seleccion.value === 'aes' && !clave) {
            mostrarMenuDesplegable(true); // Mostrar el menú si la clave no está presente
            alert('Por favor ingrese la clave para desencriptar.');
            return;
        }

        if (seleccion.value === 'aes') {
            const resultado = desencriptarAES(textoEncriptado, clave);
            inputTexto.value = '';
            outputTexto.value = resultado || 'Error al desencriptar.';
            mostrarMenuDesplegable(false); // Ocultar el menú después de desencriptar
        } else {
            alert('Método de desencriptación no válido.');
        }

        // Restablecer el estado de los selectores
        document.querySelectorAll('input[name="hash-selector"]').forEach(radio => radio.checked = false);
    };

    // ACTUALIZAR ESTADO DEL BOTON DE DESENCRIPTAR
    function actualizarEstadoBotonDesencriptar() {
        const inputTexto = document.getElementById('input-texto').value;
        const botonDesencriptar = document.getElementById('btn-desencriptar');
        botonDesencriptar.disabled = inputTexto.trim() === '';
    }

    // MANEJAR FILTRADO SEGUN SELECTOR
    function manejarFiltradoPorSelector() {
        const seleccion = document.querySelector('input[name="hash-selector"]:checked');
        const inputTexto = document.getElementById('input-texto');
        const texto = inputTexto.value;

        if (seleccion && (seleccion.value === 'aes' || seleccion.value === 'hmac')) {
            inputTexto.value = texto; // Permite todos los caracteres
        } else {
            inputTexto.value = texto.toLowerCase().replace(/[^a-z]/g, ''); // Filtrado a solo letras minúsculas
        }
    }

    // EVENTOS DE BOTONES
    document.getElementById('btn-encriptar').addEventListener('click', function () {
        window.encriptarPorSelector();
    });

    document.getElementById('btn-desencriptar').addEventListener('click', function () {
        window.desencriptarPorSelector();
    });

    document.getElementById('btn-copiar').addEventListener('click', function () {
        copiar();
    });

    document.getElementById('btn-pegar').addEventListener('click', function () {
        pegar();
    });

    document.getElementById('copy-key').addEventListener('click', copiarClave);
    
    document.getElementById('menu-toggle').addEventListener('click', function () {
        mostrarMenuDesplegable(false);
    });
    // ACTUALIZAR ESTADO DEL BOTON DE DESENCRIPTAR AL CARGAR
    actualizarEstadoBotonDesencriptar();
});
