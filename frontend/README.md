
# 🍰 BakeApp – Frontend

Frontend gestionale per pasticcerie realizzato con **React + Vite + React-Bootstrap**.  
L’app è integrata con il backend MERN e consente la gestione completa di utenti, ordini, prodotti, ingredienti, cataloghi e fatture.  
Include login JWT, autenticazione Google, caricamento immagini su Cloudinary e una UX ottimizzata per ambienti aziendali.

<hr>

## 🚀 Funzionalità principali

- **Autenticazione completa**
  - Login con credenziali o con Google OAuth 2.0
  - Gestione JWT e persistenza sessione
- **Gestione utenti (ADMIN only)**
  - Creazione, modifica, dettaglio e cancellazione utenti
  - Visualizzazione per ruolo (`ADMIN`, `CUSTOMER`, `EMPLOYEE`, `SUPPLIER`)
- **Gestione profilo**
  - Pagina `/me` con informazioni personali
  - Pagina `/settings` con modifica dati e immagine profilo (Cloudinary)
- **Gestione cataloghi e prodotti**
  - Tabella dinamica con categorie e immagini
  - CRUD completo, selezione cataloghi, caricamento immagine
- **Gestione ingredienti**
  - Inserimento e controllo ingredienti indipendenti
- **Gestione ordini e fatture**
  - Customer Order, Purchase Order, Invoice
  - Stampa PDF fattura da UI con layout ottimizzato
- **UX migliorata**
  - Toast e modali SweetAlert2
  - Spinner di caricamento, conferme e notifiche
  - Design coerente e responsive con React-Bootstrap
- **Integrazione Cloudinary**
  - Upload di immagini per utenti e prodotti

<hr>

## 🧱 Tech Stack

| Tecnologia | Descrizione |
|-------------|-------------|
| **React 18** | Libreria UI |
| **Vite** | Dev server e bundler |
| **React-Bootstrap** | Componenti UI responsive |
| **Bootstrap Icons** | Iconografia elegante |
| **Axios** | Chiamate HTTP verso backend |
| **React Router DOM v6** | Routing e protezione pagine |
| **SweetAlert2 + React Content** | Notifiche e modali personalizzate |
| **JWT Decode** | Lettura dei token JWT |
| **Cloudinary Upload** | Gestione immagini utente e prodotti |

<hr>

## ⚙️ Setup & Installazione

### 1️⃣ Clona il progetto

```bash
git clone https://github.com/<fabio-lasalvia>/bakeapp.git
cd frontend
```

### 2️⃣ Installa le dipendenze

```bash
npm install
```

### 3️⃣ Configura le variabili d’ambiente

Crea un file `.env` nella root del progetto con:

```env
######################
##### API CONFIG #####
######################
VITE_BASE_URL=https://bakeapp.onrender.com/api
VITE_GOOGLE_PATH=/api/auth/login-google
```

> In locale puoi usare:
> ```
> VITE_BASE_URL=http://localhost:5000/api
> ```

---

## 🧩 Avvio del progetto

In modalità sviluppo:

```bash
npm run dev
```

Poi apri [http://localhost:5173](http://localhost:5173) nel browser.

---

## 🗂️ Struttura del progetto

```
frontend/
├── public/
│   └── img/                    # Immagini e risorse statiche
│
├── src/
│   ├── components/
|   |   ├──catalogs/            # Gestione cataloghi
│   │   ├── common/             # Modali, alert, spinner, conferme
│   │   ├── customerOrders/     # Gestione ordini clienti
│   │   ├── customers/          # Gestione clienti
│   │   ├── ingredients/        # Gestione ingredienti
│   │   ├── invoices/           # Fatture + stampa PDF
│   │   ├── layout/             # Topbar, Sidebar, Footer, MainLayout
│   │   ├── login/              # Gestione login
│   │   ├── products/           # CRUD prodotti + dettagli
│   │   ├── purchaseOrders/     # Gestione ordini fornitori
│   │   ├── suppliers/          # Gestione fornitori
|   |   └── users/              # CRUD utenti
│   │
│   ├── context/
│   │   └── AuthContext.jsx     # Stato globale autenticazione
|   |
│   ├── data/
│   │   ├── axiosInstance.js
│   │   ├── catalogs.js
│   │   ├── customerOrders.js
│   │   ├── customers.js
│   │   ├── ingredients.js
│   │   ├── invoices.js
│   │   ├── products.js
│   │   ├── purchaseOrders.js
│   │   ├── suppliers.js
│   │   └── users.js
|   |
│   ├── hooks/
│   │   ├── catalogs/           # useIndexCatalogs, ecc.
│   │   ├── common/             # useHandleModal, ecc.
│   │   ├── users/              # useMyProfile, useUpdateMyProfile ecc.
│   │   ├── products/           # useIndexProducts, useDeleteProduct ecc.
│   │   ├── ingredients/        # useIndexIngredients, ecc.
│   │   ├── orders/             # useIndexCustomerOrders, useUpdateOrder ecc.
│   │   └── invoices/           # useIndexInvoices, useCreateInvoice ecc.
│   │
│   ├── pages/
│   │   ├── Catalogs.jsx
│   │   ├── CustomerOrders.jsx
│   │   ├── Home.jsx
│   │   ├── Ingredients.jsx
│   │   ├── InvoicePrint.jsx
│   │   ├── Invoices.jsx
│   │   ├── Login.jsx
│   │   ├── Products.jsx
│   │   ├── Profile.jsx
│   │   ├── PurchaseOrders.jsx
│   │   ├── Settings.jsx
│   │   ├── Suppliers.jsx
│   │   └── Users.jsx
│   │
│   ├── routes/
│   │   └── ProtectedRoute.jsx
│   │
│   ├── App.jsx
│   └── main.jsx
│
└── package.json
```

<hr>

## 🔐 Routing principale

Configurato in `App.jsx`:

| Rotta | Descrizione |
|--------|--------------|
| `/login` | Login utente |
| `/home` | Dashboard principale |
| `/users` | Gestione utenti (solo ADMIN) |
| `/catalogs` | Gestione cataloghi |
| `/products` | Gestione prodotti |
| `/ingredients` | Gestione ingredienti |
| `/customer-orders` | Ordini clienti |
| `/purchase-orders` | Ordini fornitori |
| `/invoices` | Gestione fatture |
| `/print/invoice/:id` | Stampa fattura |
| `/me` | Profilo personale |
| `/settings` | Modifica profilo e avatar |

<hr>

## 💾 Autenticazione

### Login
- Login standard con email/password (`/api/auth/login`)
- Login Google (`/api/auth/login-google`)
- Gestione token JWT con `localStorage`

### Protezione rotte
- `ProtectedRoute.jsx` reindirizza automaticamente al `/login` se l'utente non è autenticato.

### Logout
- Implementato con conferma via SweetAlert2 in `Topbar.jsx`

<hr>

## 🧠 Stato globale (AuthContext)

`AuthContext.jsx` gestisce:
- Stato utente (`user`, `role`, `token`)
- Login, Logout e persistenza con `localStorage`
- Decodifica JWT con `jwt-decode`

<hr>

## ☁️ Upload immagini (Cloudinary)

- Gestito tramite `multer-storage-cloudinary` nel backend  
- Il frontend invia file in `multipart/form-data`
- Fallback automatico a `segnapostoNoImage.png`

<hr>

## 🧾 Stampa fatture

Componente dedicato `InvoicePrint.jsx`:
- Layout ottimizzato per la stampa browser (`window.print()`)
- Logo, dettagli cliente, elenco prodotti e QR code

<hr>

## 🧰 Scripts disponibili

| Comando | Descrizione |
|----------|-------------|
| `npm run dev` | Avvio in modalità sviluppo |
| `npm run build` | Build di produzione |
| `npm install` | Installa le dipendenze |

<hr>

## 🌐 Deploy

### Backend
Deploy su **Render**  
Assicurati che `FRONTEND_HOST` in `.env` backend punti a:
```
https://bake-app.vercel.app
```

### Frontend
Deploy su **Vercel**  
Configura le environment variables:
```
VITE_BASE_URL=https://bakeapp.onrender.com/api
VITE_GOOGLE_PATH=/api/auth/login-google
```

<hr>

## 💡 Suggerimenti

- Usa `refetch()` dei custom hook per aggiornare dati in tempo reale.
- Se noti errori di CORS → aggiorna `cors()` nel backend con:
  ```js
  app.use(cors({
    origin: ["https://bake-app.vercel.app", "http://localhost:5173"],
    credentials: true,
  }));
  ```

<hr>

## 🧾 Licenza

© 2025 **BakeApp** – All rights reserved.
