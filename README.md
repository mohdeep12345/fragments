# 📦 Fragments Microservice

This is a backend microservice built with Node.js and Express. It follows a modular structure with modern developer tools like ESLint, Prettier, Pino logging, and Nodemon for easier development.

---

## 📁 Project Setup

1. **Clone the repository**

```bash
git clone https://github.com/mohdeep12345/fragments.git
cd fragments
```

2. **Install dependencies**

```bash
npm install
```

---

## ⚙️ Scripts

Here are the available scripts you can run:

### 🧼 `npm run lint`

Runs ESLint to check for code quality and style issues.

```bash
npm run lint
```

> ✔️ Lints all `.js` files inside `./src` using your ESLint config.

---

### 🚀 `npm start`

Starts the server in **production** mode.

```bash
npm start
```

> 🟢 Runs `src/server.js` using plain Node.js (no auto-reload, no debug logging).

---

### 🔁 `npm run dev`

Starts the server in **development mode** with:

- Auto-restart on changes (`nodemon`)
- Verbose logging (`LOG_LEVEL=debug` using `pino`)

```bash
npm run dev
```

> 🔧 This uses `cross-env` to work cross-platform (Windows/macOS/Linux).

---

### 🐞 `npm run debug`

Starts the server in **debug mode**, enabling:

- Auto-restart on changes
- Verbose debug logging
- Debug inspector available on `localhost:9229`

```bash
npm run debug
```

> 🧠 Use this to attach a debugger (e.g., from VS Code).

---

## 🧠 Developer Notes

- Source code lives inside the `src/` folder.
- The server entry point is `src/server.js`.
- Logging uses **Pino** (`pino-http`) for HTTP logs.
- Environment variables can be configured as needed (e.g., `LOG_LEVEL`).
- Use `Prettier` and `ESLint` to maintain clean code.

---

## ✅ Requirements

- Node.js v18 or higher
- npm v9 or higher
- (Windows users): All scripts work cross-platform using `cross-env`

---

## 🛠️ Tools Used

- [Express](https://expressjs.com/)
- [Pino](https://getpino.io/)
- [Nodemon](https://nodemon.io/)
- [ESLint](https://eslint.org/)
- [Prettier](https://prettier.io/)
- [Helmet](https://helmetjs.github.io/)
- [CORS](https://github.com/expressjs/cors)
- [Compression](https://github.com/expressjs/compression)

---

## 📚 Troubleshooting

- If `npm run dev` or `npm run debug` doesn't work on Windows, ensure `cross-env` is installed correctly.
- Use `npm ls` to check for dependency tree issues.
- Port `9229` must be open if debugging.
