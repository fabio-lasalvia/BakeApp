# 🍰 MyBakeApp – Backend

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
git clone https://github.com/<tuo-username>/mybakeapp-backend.git
cd mybakeapp-backend
```

### 2️⃣ Installa le dipendenze

```bash
npm install
```

### 3️⃣ Configura l’ambiente

Crea un file `.env` nella root del progetto con le seguenti variabili:

```env
# Server
PORT=5000
MONGO_URI=mongodb+srv://<user>:<password>@<cluster-url>/<db-name>
JWT_SECRET=your_jwt_secret
JWT_EXPIRESIN=1d

# Mailer
EMAIL_HOST=smtp.yourmailserver.com
EMAIL_PORT=587
EMAIL_USER=your_email@example.com
EMAIL_PASSWORD=your_password

# Cloudinary
CLOUDINARY_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
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
│
├── controllers/
│   ├── authController.js
│   ├── customerController.js
│   ├── employeeController.js
│   ├── supplierController.js
│   ├── customerOrderController.js
│   ├── purchaseOrderController.js
│   ├── ingredientController.js
│   ├── productController.js
│   ├── invoiceController.js
│   └── catalogController.js
│
├── models/
│   ├── User.js
│   ├── Customer.js
│   ├── Employee.js
│   ├── Supplier.js
│   ├── CustomerOrder.js
│   ├── PurchaseOrder.js
│   ├── Ingredient.js
│   ├── Product.js
│   ├── Invoice.js
│   └── Catalog.js
│
├── routes/
│   ├── authRoutes.js
│   ├── customerRoutes.js
│   ├── employeeRoutes.js
│   ├── supplierRoutes.js
│   ├── customerOrderRoutes.js
│   ├── purchaseOrderRoutes.js
│   ├── ingredientRoutes.js
│   ├── productRoutes.js
│   ├── invoiceRoutes.js
│   └── catalogRoutes.js
│
├── middlewares/
│   ├── authMiddleware.js
│   ├── roleMiddleware.js
│   └── errorHandler.js
│
├── helpers/
│   ├── jwt.js
│   ├── mailer.js
│   └── createError.js
│
├── server.js
└── package.json
```

<hr>

## 🔐 Ruoli e permessi

| Ruolo | Permessi principali |
|-------|----------------------|
| **ADMIN** | Accesso completo, gestione utenti, cataloghi, fatture |
| **EMPLOYEE** | Gestione ordini clienti e fornitori, magazzino |
| **SUPPLIER** | Consultazione ordini di fornitura |
| **CUSTOMER** | Creazione e consultazione ordini personali |

<hr>

## 📡 Endpoint principali

Esempi di endpoint REST:

| Metodo | Endpoint | Descrizione |
|--------|-----------|-------------|
| `POST` | `/api/auth/signup` | Registrazione utente |
| `POST` | `/api/auth/login` | Login utente |
| `POST` | `/api/auth/google` | Login via Google |
| `GET` | `/api/customers` | Lista clienti (admin only) |
| `GET` | `/api/products` | Lista prodotti disponibili |
| `POST` | `/api/customer-orders` | Creazione ordine cliente |
| `PUT` | `/api/invoices/:id` | Aggiornamento fattura |
| `DELETE` | `/api/catalogs/:id` | Eliminazione catalogo |

<hr>

## 🧪 Middleware & Sicurezza

- `protect`: verifica e decodifica JWT  
- `authorizeRoles`: limita l’accesso in base al ruolo utente  
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

Distribuito sotto licenza **MIT**.  
© 2025 **BakeApp** – All rights reserved.

