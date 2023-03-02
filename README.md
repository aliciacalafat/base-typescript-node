# Instrucciones para crear un nuevo proyecto de Typescript con Node.js

## 1.- Crear un nuevo repositorio en GitHub.
Puedes elegir si crearlo con un `README.md` o no.

## 2.- Clonar el repositorio en local.
### 2.1.- Acceder al directorio donde quieras almacenar el proyecto.
Desde la terminal del orde, ves a la carpeta donde quieras guardar el proyecto. Ejemplo:
```sh
cd \Users\Nitropc\Documents\UOC
```
### 2.2.- Clonar el repositorio en el directorio.
Copiar la url de clonación desde GitHub y utilizar el comando `git clone`:
```sh
git clone https://github.com/aliciacalafat/base-typescript-node.git
```

## 3.- Abrir el proyecto con Visual Studio Code desde la terminal.
```sh
code .\base-typescript-node\
```

## 4.- Inicializar un proyecto de node.js
Para inicializar node.js debemos ejecutar el comando:
```sh
npm init -y
```
Se creará el archivo `package.json`

## 5.- Instalación de Typescript.
Instalación de los siguientes últimos paquetes:
```sh
npm i -D typescript@latest ts-node@latest
```
Se creará el archivo `package-lock.json` y la carpeta `node_modules`

## 6.- Inicializar el fichero de configuración.
Para inicializar el fichero de configuración:
```sh
npx tsc --init
```
Se creará el archivo `tsconfig.json` con los valores por defecto. Para seguir una misma plantilla siempre, podemos modificarlo con los siguientes valores:
```sh
{
      "compilerOptions": {
      ...
      "rootDir":"./src",
      ...,
      "outDir":"./dist",
      ...
      }
}
```
De esta forma, por un lado especificamos la carpeta root de nuestros archivos (`./src`) y por otro especificamos la carpeta output donde se irán todos los archivos que se vayan creando (`./dist`).

## 7.- Fichero de entrada.
Tal y como hemos comentado en el paso anterior, nuestro código principal estará dentro de la carpeta `src`. Por lo tanto nada más empezar, crea la carpeta `src` en el root y dentro deberemos crear el fichero principal `index.ts` con el siguiente contenido:
```sh
async function bootstrap(){
      console.log("kaizoku oni ore wa naru");
}

bootstrap();
```

## 8.- Ejecución del código.
Modificamos el archivo `package.json` para incluir el nombre del autor, en el `main` deberemos indicar la carpeta `dist` y para ejecutar el código deberemos añadir lo siguiente a `scripts`:
```sh
{
      "name": "@alicia/base-typescript-node",
      ...
      "main": "dist/index.js",
      ...
      "scripts": {
            ...
            "dev": "ts-node ./src/index.ts"
      },
      ...
}
```
Con ese nuevo script podremos ejecutar el código con un `npm run dev`.

## 9.- Depuración del código.
Para debugar creamos en el root la carpeta `.vscode` y en su interior creamos el archivo `launch.json` con lo siguiente:
```sh
{
    "configurations":[
        {
            "name": "Launch Service",
            "type": "node",
            "request": "launch",
            "args": ["src/index.ts"],
            "runtimeArgs": ["--nolazy", "-r", "ts-node/register"],
            "sourceMaps": true,
            "cwd": "${workspaceFolder}",
            "protocol": "inspector"            
        }
    ]
}
```
Aahora con un `F5` podremos arrancar el debugger. Poniendo un breakpoint en el `console.log()` debería parar allí.

## 10.- Compilación del código.
Para compilar necesitamos instalar el paquete:
```sh
npm i -D rimraf@latest
```

Ahora deberemos añadir los siguientes `scripts` al archivo `package.json`:
```sh
{
...
  "scripts": {
    ...
    "prebuild": "rimraf ./dist",
    "build": "tsc"
  },
...
}
```
Si escribimos `npm run build` veremos que se crea la carpeta `dist` que contiene el `index.ts`.

## 11.- Archivo de configuración.
Para poder usar la configuración a través de las variables de entorno en un fichero `.env`, es necesario instalar el paquete:
```sh
npm i dotenv@latest
```

Creamos el archivo de configuración `.env` en el root y otro también en el root llamado `.env-example` que contendrá las mismas variables de entorno que el `.env` pero con las variables no seguras (contraseñas, tokens...) sin valor. De esta manera, en el archivo `.gitignore` se ignorará el `.env` pero quien coja el proyecto sabrá a través del `.env-example` que necesita de esas variables para funcionar.

En ambos archivos `.env` y `.env-example` escribimos:
```sh
NODE_ENV=development
```

Para que las variables de entorno se carguen debemos incorporar en el archivo `index.ts` el `import dotenv` y el `dotenv.config()`, de manera que el `index.ts` quede: 
```sh
import dotenv from "dotenv";

dotenv.config();

async function bootstrap(){
    console.log("kaizoku oni ore wa naru");
}

bootstrap();
```

## 12.- Gestión de logs.
Para gestionar los logs que nos indican lo que está ocurriendo, instalaremos las librerías:
```sh
npm install pino
```
```sh
npm i -D pino-pretty
```

Añadimos en el archivo `.env` y en el `.env-example` la variable de entorno:
```sh
LOGGER_LEVEL=debug
```

Creamos un nuevo archivo en la carpeta `src` llamado `logger.ts` con el contenido:
```sh
import pino from "pino";

const isProduction = process.env.NODE_ENV === "production";

const logger = pino({
    level: process.env.LOGGER_LEVEL ?? "info",
    transport:{
        target: isProduction ? "pino" : "pino-pretty",
    }
});

export default logger;
```

Para confirmar que todo funciona correctamente, sustitumos en el archivo `index.ts` el `console.log()` por el siguiente log de pino:
```sh
import dotenv from "dotenv";

dotenv.config();

import logger from "./logger";

async function bootstrap(){
    logger.debug("kaizoku oni ore wa naru");
}

bootstrap();
```

**Nota**: Es importante poner el `import logger` después del `dotenv.config()`, de lo contrario no verás nada en la terminal.

Tras compilar el código con un `npm run dev`, verás algo parecido a:
```sh
[23:08:20.199] DEBUG (6964): kaizoku oni ore wa naru
```

## 13.- Integración con Git.
A través del nuevo archivo `.gitignore` excluiremos todos los archivos y carpetas que no queremos que se suban al repositorio, como el `.env` y las carpetas `node_modules` y `dist`. Para ello creamos en el root el archivo `.gitignore` y escribimos:
```sh
node_modules/
dist/
.env
```

Para subir los cambios al nuevo repositorio, primero nos aseguramos de que estamos en la rama `main`. Si lo estamos perfecto, si estamos en la rama `master` tenemos que ejecutar el comando:
```sh
git checkout -B main
```

Stageamos todos los cambios, ponemos el mensaje `initial project` y creamos el primer `commit`. 
Sincroniza los cambios para realizar un `push` y `pull`.

Por último, sube los campos al nuevo repositorio con el comando:
```sh
git push --set-upstream origin main
```
