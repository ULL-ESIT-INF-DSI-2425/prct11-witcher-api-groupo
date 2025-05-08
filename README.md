# Practica 07: Gestión del inventario de la Posada del Lobo Blanco

**Nombres de los integrantes:**

- Alberto Antonio Hernandez Hernandez
- Mario Guerra Pérez
- José Javier Ramos Carballo  
  

[![CI Tests](https://github.com/ULL-ESIT-INF-DSI-2425/prct11-witcher-api-groupo/actions/workflows/ci.yml/badge.svg)](https://github.com/ULL-ESIT-INF-DSI-2425/prct11-witcher-api-groupo/actions/workflows/ci.yml)  

[![Coverage Status](https://coveralls.io/repos/github/ULL-ESIT-INF-DSI-2425/prct11-witcher-api-groupo/badge.svg?branch=main)](https://coveralls.io/github/ULL-ESIT-INF-DSI-2425/prct11-witcher-api-groupo?branch=main)  

[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=ULL-ESIT-INF-DSI-2425_prct11-witcher-api-groupo&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=ULL-ESIT-INF-DSI-2425_prct11-witcher-api-groupo)  

## Índice

1. [Introducción](#1-introducción)
2. [Estructura de Ficheros del Proyecto](#2-estructura-de-ficheros-del-proyecto)
3. [Comandos para el funcionamiento de la practica](#3-comandos-para-el-funcionamiento-de-la-practica)
4. [API REST](#4-api-rest-desplegada-en-render)
5. [Conclusiones](#5-conclusiones)
6. [Bibliografía](#6-bibliografía)

# 1. Introducción

En este proyecto en grupo, nos hemos apoyado en la práctica anterior para desplegar con una API REST la gestion del inventario de una de las posadas más reconocibles del mundo de _The Witcher 3_.

Bajo el ambiente de este mundo mágico, nuestro cometido se basó en gestionar, mediante peticiones HTTP a la API REST, a los diferentes agentes que intervenian en el inventario: mercaderes, clientes y bienes, y la gestión de sus compras, ventas y devoluciones.  

# 2. Estructura de Ficheros del Proyecto

## 📂 .github
Contiene los ficheros de configuración de los flujos de trabajo del proyecto.

  - `ci.yml` - Flujo de trabajo de integracion continua de pruebas
  - `coveralls.yml` - Flujo de trabajo relativo a la conexion con Coveralls
  - `sonarqube-cloud.yml` - Flujo de trabajo relativo a la conexion con SonarCloud

## 📂 config
Contiene los ficheros de configuración de los diferentes entornos de trabajo.

  - `.env` - Contiene variables de entornos relativos a la base de datos en remoto
  - `dev.env` - Contiene variables de entornos relativos al trabajo en el desarrollo del proyecto
  - `test.env` - Contiene variables de entornos relativos al trabajo en el desarrollo del test

## 📂 coverage
Contiene los ficheros relativos al proyecto con Coveralls mediante coverage.

## 📂 docs
Contiene los ficheros relativos a la documentación del proyecto.

## 📂 src
Contiene el código fuente principal del proyecto.

### 📂 cli
Interfaz de línea de comandos para interactuar con el sistema.

  - `index.ts` - Programa principal del proyecto.
  - `app.ts` - Contiene la aplicación y los diferentes routers que usa la API.

### 📂 db
Ficheros relativos a la base de datos

  - `mongoose.ts` - Conecta la API a la base de datos de MongoDB

### 📂 enums
Enumeraciones utilizadas en el sistema.

- `locations.ts` - Enumeración de localizaciones disponibles.
- `materials.ts` - Enumeración de materiales disponibles.
- `merchantType.ts` - Enumeración de tipos de mercader disponibles.
- `races.ts` - Enumeración de razas disponibles.
- `transactionType.ts` - Enumeración de tipos de transacciones

### 📂 interfaces
Definición de los documentos del sistema.

- `clientDocument.ts` - Documento que establece las propiedades de los objetos cliente
- `goodDocument.ts` - Documento que establece las propiedades de los objetos bien
- `merchantDocument.ts` - Documento que establece las propiedades de los objetos mercader
- `transactionDocument.ts` - Documento que establece las propiedades de los objetos transación

### 📂 models
Definición de las entidades principales del sistema.

- `clientModel.ts` - Modelo de clientes.
- `goodModel.ts` - Modelo de bienes.
- `merchantModel.ts` - Modelo de mercaderes.
- `transactionModel.ts` - Modelo de ansacciones. 

### 📂 routers
Definición de las operaciones CRUD realizadas sobre las bases de datos.

- `clientsRouter.ts` - Contiene las diferentes operaciones que se realizan sobre los clientes.
- `goodModel.ts` - Contiene las diferentes operaciones que se realizan sobre los bienes.
- `merchantModel.ts` - Contiene las diferentes operaciones que se realizan sobre los mercaderes.
- `transactionModel.ts` - Contiene las diferentes operaciones que se realizan sobre los transacciones. 

### 📂 schemas
Definición de los esquemas de las entidades presentes en la base de datos, incluyendo la configuración y validación de los valores permitidos en sus propiedades.

- `clientSchema.ts` - Establece el esquema de los clientes.
- `goodSchema.ts` - Establece el esquema de los bienes.
- `merchantSchema.ts` - Establece el esquema de los mercaderes.
- `transactionSchema.ts` - Establece el esquema de las transacciones.

## 📂 tests
Pruebas TDD y de integración.

### 📂 routers
Pruebas relativas a los routers.

- `clientsTests.spec.ts` - Pruebas para la base de datos de clientes.
- `goodsTests.spec.ts` - Pruebas para la base de datos de bienes.
- `merchantTests.spec.ts` - Pruebas para la base de datos de mercaderes.
- `transaction.spec.ts` - Pruebas para la base de datos de transacciones.

## Otros Ficheros
Definición de ficheros necesarios para el funcionamiento del proyecto

- `.gitignore` - Archivos y carpetas ignorados por Git.
- `.prettierignore` - Fichero que establece que archivos debe ignorar Prettier
- `.prettierrc` - Ficheros que establece opciones adicionales que debe seguir el Prettier
- `eslint.config.mjs` - Fichero que establece el funcionamiento de la herramienta ESLint
- `package-lock.json` - Fichero que engloba las dependencias del proyecto
- `package.json` - Fichero que engloba la configuracion, los scripts y las dependencias del proyecto.
- `README.md` - Documentación principal del proyecto.
- `sonar-project.properties` - Configuración de propiedades de SonarCloud sobre donde analiza el código.
- `tsconfig.json` - Fichero que contiene la configuración de compilador de typescript.
- `typedoc.json` - Fichero que contiene la configuracion relativa a la herramienta Typedoc


# 3. Comandos para el funcionamiento de la practica

* Instalación de dependencias:
  ```
  npm install
  ```
* Para la ejecución de la **Aplicación de gestión de inventario de la posada El Lobo Blanco**, se deberá usar el comando:
  ```
  npm run start
  ```

* Para la ejecución de las pruebas, se deberá usar el comando:
  ```
  npm run coverage
  ```

* Para la probar el funcionamiento en local:
  ```
  npm run dev
  ```

# 4. API REST desplegada en Render

Esta API REST ha sido desplegada en Render y conectada a un clúster en la nube de MongoDB Atlas. Para poder hacer 
peticiones directamente desde un navegador, se puede hacer uso de un gestor de peticiones como [**Postman**](https://www.postman.com/), que cuenta con una extensión en **_Visual Studio Code_**. 

Para ello, en la extensión de **Postman** use el siguiente enlace:

[https://white-wolf-inn-teamo.onrender.com/](https://white-wolf-inn-teamo.onrender.com/)


# 5. Conclusiones

Gracias a los retos que nos ha supuesto este proyecto, hemos trabajado en como funcionan las API REST, la programación dirigida a eventos, 

# 6. Bibliografía

1. **Enunciado de la práctica:** [https://ull-esit-inf-dsi-2425.github.io/prct12-witcher-api/](https://ull-esit-inf-dsi-2425.github.io/prct12-witcher-api/) 

2. **TSDoc:** [https://tsdoc.org](https://tsdoc.org)

3. **Coveralls:** [https://coveralls.io/github/ULL-ESIT-INF-DSI-2425/prct11-witcher-api-groupo](https://coveralls.io/github/ULL-ESIT-INF-DSI-2425/prct11-witcher-api-groupo)

4. **SonarQube Cloud:** [https://sonarcloud.io/project/overview?id=ULL-ESIT-INF-DSI-2425_prct11-witcher-api-groupo](https://sonarcloud.io/project/overview?id=ULL-ESIT-INF-DSI-2425_prct11-witcher-api-groupo)

5. **API Desplegada:** [https://white-wolf-inn-teamo.onrender.com/](https://white-wolf-inn-teamo.onrender.com/)