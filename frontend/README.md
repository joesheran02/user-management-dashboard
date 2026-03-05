# 👤 User Management Dashboard — Frontend

A production-grade **User Management Dashboard** built with **React 18** and **Ant Design 5**, featuring a dark executive UI theme. Connects to a FeathersJS REST API backed by PostgreSQL.

---

## 🖥️ Preview

> **Frontend:** `http://localhost:3000`  
> **Requires backend running at:** `http://localhost:3030`

---

## ✨ Features

- 📋 **User Table** — Paginated, sortable, with inline name/email search
- ➕ **Add User** — Modal form with full field validation
- ✏️ **Edit User** — Pre-filled modal with active/inactive toggle switch
- 🗑️ **Soft Delete** — Popconfirm → marks user deleted via PATCH, removes from UI instantly
- 🔍 **Gender Filter** — Dropdown to filter by Male / Female / Other / All
- 📊 **Stats Cards** — Live counts for Total, Male, Female, and Active users
- ⏳ **Loading States** — Spinners on all API calls
- ✅ **Toast Notifications** — Success and error messages via Ant Design
- 📱 **Responsive** — Works on desktop and tablet

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 18 |
| UI Library | Ant Design 5 |
| CSS Framework | Bootstrap 5 + Custom CSS |
| HTTP Client | Axios |
| State Management | `useReducer` + Custom Hook |
| Date Formatting | Day.js |
| Fonts | Syne + DM Sans (Google Fonts) |

---

## 📁 Project Structure

```
frontend/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── StatsCards.jsx       # Dashboard statistics overview
│   │   ├── UserFormModal.jsx    # Add / Edit modal with form + active toggle
│   │   └── UsersTable.jsx       # Data table with search, sort, pagination
│   ├── hooks/
│   │   └── useUsers.js          # useReducer-based state management
│   ├── services/
│   │   └── usersApi.js          # Axios API service layer
│   ├── App.jsx                  # Root layout and orchestration
│   ├── App.css                  # Global dark theme styles
│   └── index.js                 # React entry point
├── .env.example
├── .gitignore
└── package.json
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js >= 18
- npm >= 9
- Backend API running (see [backend repo](https://github.com/YOUR_USERNAME/user-management-api))

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/user-management-dashboard.git
cd user-management-dashboard
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment

```bash
cp .env.example .env
```

Edit `.env`:

```env
REACT_APP_API_BASE_URL=http://localhost:3030
```

### 4. Start the development server

```bash
npm start
```

Opens automatically at **http://localhost:3000**

---

## 🔧 Available Scripts

| Script | Description |
|--------|-------------|
| `npm start` | Start development server with hot reload |
| `npm run build` | Create optimised production build |
| `npm test` | Run test suite |

---

## 🌍 Deployment

### Build for production

```bash
npm run build
```

Output will be in the `build/` directory — deploy this to any static host.

### Deploy to Vercel

```bash
npm i -g vercel
vercel --prod
```

Set in Vercel dashboard → Environment Variables:
```
REACT_APP_API_BASE_URL=https://your-backend-url.com
```

### Deploy to Netlify

1. Push this repo to GitHub
2. Connect to Netlify
3. Build command: `npm run build`
4. Publish directory: `build`
5. Environment variable: `REACT_APP_API_BASE_URL=https://your-backend-url.com`

---

## 🔌 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `REACT_APP_API_BASE_URL` | Backend API base URL | `http://localhost:3030` |

---

## 🔗 Related Repository

- 🔧 **Backend:** [user-management-api](https://github.com/YOUR_USERNAME/user-management-api)
