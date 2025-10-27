# 🍰 BakeApp – Backend

Backend gestionale per pasticcerie realizzato con lo stack **MERN (MongoDB, Express, React, Node.js)**.  
Il sistema gestisce utenti con ruoli differenziati (`ADMIN`, `CUSTOMER`, `EMPLOYEE`, `SUPPLIER`) e copre l’intero ciclo operativo di una pasticceria: ordini, fornitori, ingredienti, prodotti, cataloghi e fatture.

<hr>

## 🚀 Features principali

- **Autenticazione JWT** (login classico + login tramite Google OAuth 2.0)
- **Ruoli e permessi** gestiti con middleware dedicati
- **Gestione utenti completa**
  - Creazione, aggiornamento e rimozione di clienti, dipendenti e fornitori
- **Gestione ordini**
  - Customer Orders & Purchase Orders con referenze a `Product`, `Ingredient` e `Supplier`
- **Gestione magazzino**
  - Ingredienti e prodotti associati a ordini e cataloghi
- **Fatturazione e cataloghi**
  - Invoices & Product catalogs con aggiornamento dinamico dei prezzi
- **File upload & Cloudinary**
  - Integrazione pronta per gestire immagini dei prodotti
- **Documentazione automatica**
  - Swagger generato con `swagger-autogen` e visualizzato con `swagger-ui-express`
- **Sicurezza**
  - Helmet, CORS, validazioni con Joi, e protezione middleware centralizzata
- **Socket.io**
  - Struttura pronta per comunicazioni in tempo reale (es. notifiche o aggiornamenti ordini)

<hr>

## 🧱 Tech Stack

| Tecnologia | Descrizione |
|-------------|-------------|
| **Node.js** | Runtime environment |
| **Express.js** | Web framework per API REST |
| **MongoDB + Mongoose** | Database NoSQL e ODM |
| **JWT (jsonwebtoken)** | Autenticazione e gestione sessioni |
| **Bcrypt** | Hash e validazione password |
| **Nodemailer** | Invio email tramite SMTP |
| **Passport + Google OAuth 2.0** | Autenticazione con Google |
| **Helmet & CORS** | Sicurezza e protezione richieste |
| **Swagger** | Documentazione automatica delle API |
| **Socket.io** | WebSockets per notifiche in tempo reale |
| **Cloudinary + Multer** | Gestione file e upload immagini |
| **dotenv** | Gestione configurazioni ambiente |

<hr>

## ⚙️ Setup & Installazione

### 1️⃣ Clona il progetto

```bash
git clone https://github.com/<tuo-username>/bakeapp-backend.git
cd bakeapp-backend
```

### 2️⃣ Installa le dipendenze

```bash
npm install
```

### 3️⃣ Configura l’ambiente

Crea un file `.env` nella root del progetto con le seguenti variabili:

```env
##################
##### Server #####
##################
PORT=5000

####################
##### Database #####
####################
MONGODB_CONNECTION_URI=your_mongodb_connection_string

######################
##### Cloudinary #####
######################
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

############################
##### Email (SendGrid) #####
############################
EMAIL_HOST=smtp.sendgrid.net
EMAIL_PORT=587
EMAIL_USER=apikey
EMAIL_PASSWORD=your_sendgrid_api_key

#############################
##### JWT (auth tokens) #####
#############################
JWT_SECRET=your_jwt_secret
JWT_EXPIRESIN=30d

########################
##### Google OAuth #####
########################
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_PATH=/api/v1/callback-google

#################
##### Hosts #####
#################
BACKEND_HOST=http://localhost:5000
FRONTEND_HOST=http://localhost:5173
```

<hr>

## 🧩 Avvio del server

In modalità sviluppo:
```bash
npm run start
```

> Usa `nodemon` per riavvii automatici durante lo sviluppo.

Il server sarà disponibile su  
👉 **http://localhost:5000**

<hr>

## 🗂️ Struttura del progetto

```
backend/
├── config/
│   └── db.js
|   └── passport.config.js
│
├── controllers/
│   ├── authController.js
|   ├── catalogController.js
│   ├── customerController.js
│   ├── customerOrderController.js
│   ├── employeeController.js
│   ├── ingredientController.js
│   ├── invoiceController.js
│   ├── productController.js
│   ├── purchaseOrderController.js
│   ├── supplierController.js
│   └── userController.js
│
├── helpers/
│   ├── createError.js
│   ├── jwt.js
│   └── mailer.js
|
├── middlewares/
|   ├── common/
|   |   ├── errorHandler.js
|   |   └── uploadCloudinary.js
│   ├── authMiddleware.js
│   └── roleMiddleware.js
|
├── models/
│   ├── Catalog.js
│   ├── Customer.js
│   ├── CustomerOrder.js
│   ├── Employee.js
│   ├── Ingredient.js
│   ├── Invoice.js
│   ├── Product.js
│   ├── PurchaseOrder.js
│   ├── Supplier.js
│   └── User.js
│
├── routes/
│   ├── authRoutes.js
│   ├── catalogRoutes.js
│   ├── customerOrderRoutes.js
│   ├── customerRoutes.js
│   ├── employeeRoutes.js
│   ├── ingredientRoutes.js
│   ├── invoiceRoutes.js
│   ├── productRoutes.js
│   ├── purchaseOrderRoutes.js
│   ├── supplierRoutes.js
│   └── userRoutes.js
|
├── .env
│
├── server.js
└── package.json
```

<hr>

## 🔐 Ruoli e permessi

| Ruolo | Permessi principali |
|-------|----------------------|
| **ADMIN** | Accesso completo, gestione utenti, cataloghi, fatture |
| **EMPLOYEE** | Gestione ordini clienti e fornitori |
| **SUPPLIER** | Consultazione ordini di fornitura |
| **CUSTOMER** | Creazione e consultazione ordini personali |

<hr>

## 📡 Endpoint principali

Esempi di endpoint REST:

| Metodo | Endpoint | Descrizione |
|--------|-----------|-------------|
| `POST` | `/api/auth/signup` | Registrazione utente |
| `POST` | `/api/auth/login` | Login utente |
| `POST` | `/api/auth/login-google` | Login via Google |
| `GET` | `/api/customers` | Lista clienti (admin only) |
| `GET` | `/api/products` | Lista prodotti disponibili |
| `POST` | `/api/customer-orders` | Creazione ordine cliente |
| `PUT` | `/api/invoices/:id` | Aggiornamento fattura |
| `DELETE` | `/api/catalogs/:id` | Eliminazione catalogo |

<hr>

## 🧪 Middleware & Sicurezza

- `protect`: verifica e decodifica JWT  
- `authorizeRoles`: limita l'accesso in base al ruolo utente  
- `errorHandler`: gestione centralizzata degli errori  
- `helmet`: protezione delle intestazioni HTTP  
- `cors`: abilitazione cross-origin per frontend React  
- `express-validator` + `joi`: validazioni dei dati in ingresso  

<hr>

## 🧠 Swagger Docs

La documentazione delle API viene generata automaticamente con **Swagger Autogen**.  
Avvio automatico al run del server:

```
http://localhost:5000/api/docs
```

<hr>

## 🧰 Dipendenze principali

| Pacchetto | Descrizione |
|------------|-------------|
| `express` | Framework server principale |
| `mongoose` | ODM per MongoDB |
| `jsonwebtoken` | Gestione token JWT |
| `bcrypt` | Cifratura password |
| `nodemailer` | Invio email SMTP |
| `passport`, `passport-google-oauth20` | Login con Google |
| `socket.io` | Comunicazioni in tempo reale |
| `swagger-autogen`, `swagger-ui-express` | Documentazione API |
| `helmet`, `cors` | Sicurezza |
| `multer`, `multer-storage-cloudinary` | Upload file e immagini |
| `cloudinary` | Gestione storage immagini |
| `joi`, `express-validator` | Validazione dati |

<hr>

## 🛠️ Scripts disponibili

| Comando | Descrizione |
|----------|-------------|
| `npm start` | Avvia il server (con Nodemon) |
| `npm test` | Placeholder test script |
| `npm install` | Installa tutte le dipendenze |

<hr>

## 💡 Contributi

1. Fai un fork del repository  
2. Crea un branch (`feature/nome-funzionalità`)  
3. Commit dei cambiamenti  
4. Push e apri una pull request  

<hr>

## 🧾 Licenza

© 2025 **BakeApp** – All rights reserved.
