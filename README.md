<h1>ENCRIPTADOR DE TEXTO CHALLENGE DE ALURA LATAM Y ORACLE NEXT EDUCATION</h1>

# Proyecto de Encriptación y Desencriptación con AES y Triple DES

Este proyecto proporciona una interfaz para encriptar y desencriptar textos usando los algoritmos AES y Triple DES, además de un método de encriptación por defecto basado en reemplazos de texto simples. El sistema incluye un manejo de claves y un hash SHA256 de los textos encriptados para mayor seguridad.

## Características

- **Encriptación y Desencriptación con AES**: Encripta textos usando AES con claves generadas automáticamente y permite desencriptar usando la misma clave.
- **Encriptación y Desencriptación con Triple DES**: Similar a AES, pero utilizando el algoritmo Triple DES.
- **Método de Encriptación por Defecto**: Un método simple que reemplaza vocales con patrones específicos.
- **Generación de Clave y Salt**: Las claves se generan automáticamente y los salts se utilizan para fortalecer los hashes SHA256.(solo para aes y triple des)
- **Manejo de Menú Desplegable**: Permite ingresar la clave para desencriptar cuando se seleccionan los métodos AES o Triple DES.
- **Manejo de Alertas**: Notifica al usuario sobre el estado de las operaciones con mensajes emergentes.
- **Copiar y Pegar Texto**: Funciones para copiar y pegar texto en los campos de entrada y salida.
- **Desencriptación de Hashes SHA-256:** Desencripta hashes de hasta 4 caracteres en minúsculas mediante fuerza bruta.
- **Uso de Web Workers:** Distribuye la carga de trabajo entre múltiples hilos (workers) para maximizar el rendimiento.
- **Alertas y Notificaciones:** El sistema proporciona feedback en tiempo real sobre el progreso de la operación, tiempo estimado y combinaciones generadas.
- 
## 📂 Estructura del Proyecto:
- **index.html:** Contiene la interfaz de usuario.
- **hash.js:** Script que maneja la funcion de fuerza bruta y desencriptacion de sha256, la interfaz de usuario, la comunicación con los Web Workers y las alertas.
- **webworker.js:** Script que ejecuta la lógica de fuerza bruta en paralelo mediante Web Workers.
- **script.js:** Script principal, maneja de encriptacion y desencriptacion de textos con remplazo de vocales, AES y TRIPLE DES, interfaz de usuario, botones copiar y pegar, normalizacion y validacion de texto, generador de sha256 con o sin salt.
- **Styles.css: ** Todo el diseño, y el diseño responsive.
  
## Requisitos

- Navegador web moderno compatible con JavaScript.
- [CryptoJS](https://cryptojs.gitbook.io/docs/) - Biblioteca JavaScript para encriptación.

## Instalación

1. Clona el repositorio o descarga los archivos.
2. Incluye la biblioteca CryptoJS en tu proyecto. Puedes hacerlo añadiendo el siguiente script en tu archivo HTML:

    ```html
    <script src="https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.1.1/crypto-js.min.js"></script>
    ```

3. Asegúrate de que los archivos `script.js` ,`hash.js` y `webworker.js` estén vinculados correctamente en tu archivo HTML.

## Uso

### Encriptación

1. Ingresa el texto a encriptar en el área de entrada (`input-texto`).
2. Selecciona el método de encriptación (AES, Triple DES, o el método por defecto).
3. Haz clic en el botón **Encriptar**. 
4. El texto encriptado aparecerá en el área de salida (`output-texto`).
5. Si seleccionaste AES o Triple DES, la clave utilizada se mostrará en el campo de clave (`clave-valor`) dentro del menú desplegable.

### Desencriptación

1. Ingresa el texto encriptado en el área de entrada (`input-texto`).
2. Selecciona el método de desencriptación correspondiente.
3. Si es necesario, ingresa la clave en el menú desplegable.
4. Haz clic en el botón **Desencriptar**.
5. El texto desencriptado se mostrará en el área de salida (`output-texto`).

### Copiar y Pegar

- **Copiar Clave**: Usa el botón dentro del menú desplegable para copiar la clave al portapapeles y limpiar el campo de la clave.
- **Copiar Texto**: Los botones de copiar permiten copiar el texto del área de entrada o salida.
- **Pegar Texto**: Los botones de pegar permiten pegar el texto desde el portapapeles a las áreas de entrada o salida.

## Funciones Principales

### `encriptarAES(texto, clave)`

Encripta un texto usando el algoritmo AES.

- **Parámetros**:
  - `texto`: El texto que se desea encriptar.
  - `clave`: La clave utilizada para la encriptación.

### `desencriptarAES(textoEncriptado, clave)`

Desencripta un texto encriptado con AES.

- **Parámetros**:
  - `textoEncriptado`: El texto encriptado.
  - `clave`: La clave utilizada para la desencriptación.

### `encriptarTripleDES(texto, clave)`

Encripta un texto usando el algoritmo Triple DES.

- **Parámetros**:
  - `texto`: El texto que se desea encriptar.
  - `clave`: La clave utilizada para la encriptación.

### `desencriptarTripleDES(textoEncriptado, clave)`

Desencripta un texto encriptado con Triple DES.

- **Parámetros**:
  - `textoEncriptado`: El texto encriptado.
  - `clave`: La clave utilizada para la desencriptación.

### `generarHash(texto, usarSalt)`

Genera un hash SHA256 del texto proporcionado.

- **Parámetros**:
  - `texto`: El texto sobre el cual se generará el hash.
  - `usarSalt`: Indica si se debe usar un salt aleatorio.

### `mostrarAlerta(mensaje, icono)`

Muestra una alerta con un mensaje y un ícono.

- **Parámetros**:
  - `mensaje`: El mensaje a mostrar.
  - `icono`: Ruta al ícono que se mostrará en la alerta.

🚀 Uso de desencriptador de SHA256:

1. **Ingrese el Hash SHA-256:** Coloca el hash objetivo de hasta 4 caracteres en minúsculas en el campo correspondiente.
2. **Ejecutar Fuerza Bruta:** Presiona el botón "Desencriptar" para iniciar el proceso de desencriptación.
3. **Copiar y Pegar Hashes:** Usa los botones de copiar y pegar para manejar los hashes fácilmente.

📜 Notas Importantes
- **No modificar para operar con más de 4 caracteres:** Por limitaciones de hardware y razones éticas, este código está diseñado para operar únicamente con combinaciones de hasta 4 caracteres.
5. **Úsalo con responsabilidad y solo con fines educativos.

## Manejo de Errores
- El sistema maneja errores comunes como la falta de entrada, errores en la desencriptación debido a claves incorrectas, y alertas visuales para guiar al usuario.
- Se utilizan mensajes de error y advertencias que se muestran mediante la función `mostrarAlerta`.

## Contribuciones

Las contribuciones son bienvenidas. Si deseas contribuir, sigue estos pasos:

1. Haz un fork del proyecto.
2. Crea tu rama de características (`git checkout -b feature/AmazingFeature`).
3. Haz commit de tus cambios (`git commit -m 'Add some AmazingFeature'`).
4. Haz push a la rama (`git push origin feature/AmazingFeature`).
5. Abre un Pull Request.

## Licencia

Este proyecto está bajo la licencia MIT - consulta el archivo [LICENSE](LICENSE) para más detalles.

¡Gracias por usar este proyecto de encriptación y desencriptación!


