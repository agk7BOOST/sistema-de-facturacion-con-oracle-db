
***

# Sistema de Facturación Transaccional (Full Stack)

Este repositorio contiene una aplicación completa de gestión de facturación que integra un backend robusto en **Java**, una base de datos empresarial **Oracle** y una interfaz moderna en **React**. El proyecto se destaca por implementar un manejo manual de transacciones y procesamiento por lotes para garantizar la integridad de los datos.

## 🏗️ Arquitectura del Proyecto

El proyecto está organizado en tres módulos principales:

* **/backend**: API REST construida con Java y Spring Boot. Implementa el patrón **DAO (Data Access Object)** para separar la lógica de negocio de la persistencia.
* **/frontend**: Aplicación SPA construida con **React**, **TypeScript** y **Tailwind CSS**. Gestiona el estado dinámico de la factura y cálculos en tiempo real.
* **/db**: Scripts DDL para la creación de objetos en Oracle Database (Tablas, Constraints y Relaciones).



## 🛠️ Tecnologías Utilizadas

### Backend
- **Java 17** & **Spring Boot**
- **JDBC**: Conexión directa para optimización de consultas.
- **Oracle JDBC Driver**: Configurado para Oracle 21c (Service Name: `XEPDB1`).
- **Jackson**: Para la serialización eficiente de objetos JSON.

### Frontend
- **React 18** & **Vite**
- **TypeScript**: Tipado estricto para modelos de Factura, Cliente y Detalle.
- **Tailwind CSS**: Estilizado moderno y responsivo.
- **Axios**: Cliente HTTP para comunicación con la API.

### Base de Datos
- **Oracle Database 21c Express Edition**.
- Modelo Relacional con integridad referencial estricta.

## 🌟 Características Destacadas

### 1. Gestión Transaccional Master-Detail
En el archivo `FacturaDAOImpl.java`, se implementa un control manual de transacciones. Esto asegura que la cabecera de la factura y todos sus detalles se inserten como una única unidad atómica. Si falla la inserción de un solo producto, se ejecuta un `rollback` automático.

### 2. Optimización con Batch Processing
Para mejorar el rendimiento al insertar múltiples ítems, el sistema utiliza `psDet.addBatch()` y `psDet.executeBatch()`, reduciendo la carga de red y el procesamiento en el servidor Oracle.

### 3. Mapeo de Datos Corporativos
A diferencia de ejemplos genéricos, este sistema utiliza una estructura de clientes basada en **Razón Social** y **RUC**, adaptada a requerimientos contables reales.



## 🚀 Instalación y Uso

### Requisitos Previos
- JDK 17 o superior.
- Node.js y npm.
- Instancia de Oracle Database (Puerto 1522 configurado).

### Configuración
1.  **Base de Datos**: Ejecuta el script situado en `/db/init_db.sql` dentro de tu herramienta SQL (SQL Developer / SQLcl).
2.  **Backend**:
    - Ajusta las credenciales en `ConexionDB.java`.
    - Ejecuta `./mvnw spring-boot:run`.
3.  **Frontend**:
    - Entra a la carpeta `/frontend`.
    - Ejecuta `npm install` y luego `npm run dev`.

***

