# Online Pet Shop

Fullstack pet store application with a product catalog, category pages, product cards, discount flow, shopping cart, and checkout form. The project is split into a `frontend` built with React/Vite and a `backend` built with Express/Sequelize and a local SQLite database.

## Demo

- Frontend: https://online-pet-shop01.vercel.app/
- Backend: https://online-pet-shop-backend.onrender.com

## Stack

### Frontend

- React 19
- Vite
- React Router DOM
- Redux Toolkit + React Redux
- Axios
- React Hook Form
- Ant Design
- CSS Modules
- ESLint

### Backend

- Node.js
- Express
- Sequelize
- SQLite3
- CORS
- Nodemon

### Deployment

- Vercel for the frontend
- Render for the backend

## Features

- Home page with banners and featured sections
- Categories list and category detail pages
- Product catalog with filtering
- Product detail page
- Sale page and discount request form
- Shopping cart with Redux state
- Order checkout form
- Static image serving from the backend
- REST API integration between frontend and backend

## Project Structure

```text
.
|-- backend/
|   |-- database/
|   |-- public/
|   |-- routes/
|   |-- database.sqlite
|   |-- index.js
|   `-- package.json
|-- frontend/
|   |-- src/
|   |-- vercel.json
|   |-- vite.config.js
|   `-- package.json
`-- README.md
```

## Requirements

Before running the project, install:

- Node.js 18 or newer
- npm 9 or newer

Check versions:

```bash
node -v
npm -v
```

## Installation

Clone the repository and install dependencies separately for each part of the project:

```bash
git clone https://github.com/IrinaTassinari/ONLINE_PET_SHOP.git
cd ONLINE_PET_SHOP
cd backend
npm install
cd ..\frontend
npm install
```

## Environment Variables

The frontend uses `VITE_API_URL` to know where the backend API is running.

Create `frontend/.env`:

```env
VITE_API_URL=http://localhost:3333
```

For production, point it to the deployed backend:

```env
VITE_API_URL=https://online-pet-shop-backend.onrender.com
```

## Run Locally

Open two terminals.

### 1. Start backend

```bash
cd backend
npm run dev
```

The backend starts on `http://localhost:3333`.

Note: the backend currently has no `npm start` script. For a direct launch, you can also use:

```bash
node index.js
```

### 2. Start frontend

```bash
cd frontend
npm run dev
```

Vite will print the local frontend address in the terminal, usually `http://localhost:5173`.

## Available Scripts

### Backend

```bash
npm run dev
node index.js
```

### Frontend

```bash
npm run dev
npm run build
npm run preview
npm run lint
```

## API Overview

Base URL for local development:

```text
http://localhost:3333
```

Main endpoints:

- `GET /categories/all` - get all categories
- `GET /categories/:id` - get products by category
- `GET /products/all` - get all products
- `GET /products/:id` - get a single product
- `POST /sale/send` - send discount request
- `POST /order/send` - send order request


## Deployment

Frontend deployment is configured for Vercel in `frontend/vercel.json`.
Backend can be deployed as a Node.js service on Render.


