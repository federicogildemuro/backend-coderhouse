# Backend para Ecommerce

Este es el backend de un proyecto de ecommerce desarrollado como trabajo final del curso de Programación Backend de Coderhouse.

El mismo utiliza:

- **Node.js**: Es un entorno de ejecución de JavaScript basado en el motor V8 de Google Chrome. Se utiliza para ejecutar código JavaScript del lado del servidor.

- **Express**: Es un framework de aplicaciones web para Node.js que simplifica el proceso de creación de servidores web y APIs.

- **MongoDB y Mongoose**: MongoDB es una base de datos NoSQL orientada a documentos, mientras que Mongoose es una biblioteca de modelado de objetos MongoDB para Node.js. Se utilizan para almacenar y manipular los datos del ecommerce de forma eficiente.

- **File System**: Esta opción de persistencia almacena los datos directamente en el sistema de archivos del servidor.

- **Handlebars**: Es un motor de plantillas que permite generar HTML de forma dinámica basado en templates. Se utiliza para renderizar las vistas del lado del servidor.

- **Socket.IO**: Es una biblioteca JavaScript para aplicaciones web en tiempo real. Permite la comunicación bidireccional en tiempo real entre clientes web y servidores. Se utiliza para el chat entre usuarios.

- **Cookie Parser**: Es una librería de Node.js que analiza las cookies adjuntas a las solicitudes HTTP. Se utiliza para facilitar el manejo de cookies en la autenticación de usuarios y otras funcionalidades relacionadas con la sesión.

- **JSON Web Tokens (JWT)**: Es un estándar abierto (RFC 7519) que define un formato compacto y autónomo para transmitir información de forma segura entre partes como un objeto JSON. Se utiliza para la autenticación y autorización de usuarios.

- **Passport.js**: Es un middleware de autenticación para Node.js que se utiliza en aplicaciones web para autenticar a los usuarios mediante diversas estrategias. Se utiliza junto con las estrategias Local, JWT y GitHub para gestionar la autenticación de usuarios.

- **Multer**: es un middleware de Node.js para el manejo de archivos en formularios HTML. Permite cargar archivos desde el cliente al servidor de manera fácil y segura. Se utilizar para que los usuarios puedan cargar distintos tipos de documentos en su perfil.

- **Bcrypt**: es una biblioteca de cifrado de contraseñas diseñada para almacenar contraseñas de manera segura. Utiliza un algoritmo de hashing irreversible para proteger las contraseñas de los usuarios contra ataques de fuerza bruta y otros intentos de compromiso de seguridad.

- **UUID**: Es una biblioteca que ofrece herramientas para generar Identificadores Únicos Universales (UUIDs), los que se utilizan para la generación de los códigos de los tickets de compra, garantizando la unicidad de cada transacción.

- **Nodemailer**: Es una librería de Node.js que simplifica el proceso de enviar correos electrónicos desde una aplicación Node, que se utiliza para enviar los vínculos de reestablecimiento de contraseñas y tickets de compra.

- **Dotenv**: Es una librería que carga variables de entorno desde un archivo .env en el entorno de ejecución. Se utiliza para cargar configuraciones sensibles de forma segura, sin necesidad de exponerlas en el código fuente.

- **Commander**: Es una librería de Node.js que simplifica la creación de interfaces de línea de comandos (CLI). Se utiliza para definir la persistencia que se utilizará, permitiendo al usuario elegir entre las diferentes opciones de almacenamiento de datos.

- **CORS**: Es un mecanismo de seguridad que permite a los servidores indicar a los navegadores si deben permitir que una solicitud web acceda a recursos de otro dominio. Se utiliza para controlar y autorizar solicitudes HTTP entre diferentes dominios, asegurando un intercambio de datos seguro y controlado.

- **gzip y Brotli**: Son algoritmos de compresión de datos utilizados para reducir el tamaño de los archivos transmitidos a través de la web. Se utilizan para comprimir y descomprimir datos en tiempo de ejecución, mejorando la eficiencia en la transferencia de archivos y el rendimiento del servidor.

- **Winston**: es una biblioteca de registro para Node.js que simplifica la gestión de registros en aplicaciones, la que se utiliza para registrar errores durante la ejecución del programa.

- **Swagger**: es una herramienta de documentación y diseño de APIs que permite describir, producir, consumir y visualizar APIs RESTful de manera interactiva, la que se utiliza con relación a las rutas api/products y api/carts.

- **Nodemon**: es una herramienta que supervisa los cambios en los archivos de tu aplicación Node.js y reinicia automáticamente el servidor cuando se detectan cambios, el cual se utiliza en los scripts de desarrollo.

- **Faker**: es una biblioteca que genera datos falsos para pruebas y desarrollo que resulta de gran utilidad para crear conjuntos de datos de prueba o para poblar una base de datos con datos de muestra.

- **Mocha, Chai y Supertest**: bibliotecas que se utilizan en forma conjunta para pruebas de solicitudes HTTP y validación de las respuestas del servidor, asegurando que las rutas y los controladores funcionen correctamente.

## Requisitos previos

- Node.js instalado en tu sistema. Puedes descargarlo [aquí](https://nodejs.org/).
- Gestor de paquetes npm, que se instala automáticamente con Node.js.

## Instalación

1. Clona este repositorio en tu máquina local:

```bash
git clone https://github.com/federicogildemuro/backend-coderhouse.git
```

2. Navega al directorio del proyecto:

```bash
cd backend-coderhouse
```

3. Instala las dependencias utilizando npm:

```bash
npm install
```

## Configuración

Crea un archivo `.env.prod` o `.env.dev` en el directorio raíz del proyecto según el entorno en que se ejecutará el servidor y configura las variables necesarias. Puedes encontrar un ejemplo de las variables requeridas en el archivo `.env.example`.

## Uso

Para ejecutar el servidor, utiliza el siguiente comando:

```bash
npm start
```

De esta forma se ejecutará en un entorno de producción utilizando la persistencia en MongoDB como base de datos principal. Para otros entornos y tipos de persistencia, puedes utilizar los restantes scripts del archivo `package.json`.

## Endpoints de la API

Aquí puedes encontrar una breve descripción de los endpoints disponibles en la API:

- `/api/sessions`: Endpoint para gestionar las sesiones de usuarios.
- `/api/users`: Endpoint para gestionar usuarios.
- `/api/products`: Endpoint para gestionar productos.
- `/api/carts`: Endpoint para gestionar carritos.

Puedes encontrar una documentación más detallada de la API en la ruta `/api/docs`, donde encontrarás detalles sobre los endpoints disponibles y cómo interactuar con ellos.

## Contribución

¡Las contribuciones son bienvenidas! Si encuentras algún problema o tienes alguna sugerencia, por favor crea un issue o envía un pull request.

## Autor

Este proyecto fue desarrollado por [Federico Gil de Muro](https://github.com/federicogildemuro).

## Licencia

Este proyecto está bajo la licencia MIT. Consulta el archivo `LICENSE` para más detalles.
