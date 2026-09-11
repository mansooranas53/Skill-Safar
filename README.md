<p align="center">
  <img src="Untitled_design__10_-removebg-preview" width="800">
</p>
<div align="center">

# 🎓 Skill Safar

**An Academia–Industry Collaboration Platform**

*Built for Smart India Hackathon (SIH) 2026*

[![Made with React](https://img.shields.io/badge/Frontend-React%2019-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/Language-TypeScript-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Bundler-Vite-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Firebase](https://img.shields.io/badge/Backend-Firebase-FFCA28?logo=firebase&logoColor=black)](https://firebase.google.com/)
[![Gemini API](https://img.shields.io/badge/AI-Gemini%20API-4285F4?logo=google&logoColor=white)](https://ai.google.dev/)
[![License](https://img.shields.io/badge/License-Unspecified-lightgrey)](#license)

</div>

---

## 📖 Overview

**Skill Safar** is an academia–industry collaboration portal designed to close the gap between educational institutions and hiring organizations. It provides a **master operations backend** that powers:

- 🏫 **Partner institute provisioning** — onboard and manage colleges/institutes on the platform
- 🧩 **Service tier assignment** — configure and assign differentiated service levels to each partner
- 📝 **Deterministic skill assessments** — standardized, repeatable assessments to evaluate candidate capabilities fairly and consistently
- 🤝 **Recruiter matching** — surface the right candidates to recruiters based on verified skill profiles

The application is built as a **Google AI Studio applet**, powered by the **Gemini API** for AI-driven capabilities, with **Firebase** handling authentication, data storage, and security rules.

---

## ✨ Key Features

| Feature | Description |
|---|---|
| **Institute Onboarding** | Streamlined provisioning workflow for adding and managing academic partners |
| **Tiered Service Model** | Flexible tier assignment to differentiate the level of service/access per institute |
| **Deterministic Assessments** | Consistent, bias-resistant skill evaluation logic — same input always yields the same, explainable output |
| **AI-Assisted Matching** | Gemini-powered logic to match assessed candidates with recruiter requirements |
| **Secure Data Layer** | Firestore-backed data storage governed by explicit security rules |
| **Modern, Responsive UI** | Built with React 19, Tailwind CSS, and smooth Framer Motion animations |

---

## 🛠️ Tech Stack

**Frontend**
- [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- [Vite 6](https://vitejs.dev/) — build tool & dev server
- [Tailwind CSS 4](https://tailwindcss.com/) — utility-first styling
- [Framer Motion](https://www.framer.com/motion/) — animations
- [Recharts](https://recharts.org/) — data visualization
- [Lucide React](https://lucide.dev/) — icon set
- [Canvas Confetti](https://www.kirilv.com/canvas-confetti/) — celebratory UI effects

**Backend & Services**
- [Google Gemini API](https://ai.google.dev/) (`@google/genai`) — AI capabilities
- [Firebase](https://firebase.google.com/) — auth, Firestore, and hosting configuration
- [Express](https://expressjs.com/) — lightweight server layer

**Tooling**
- Bun (lockfile) / npm
- TypeScript compiler for type-checking
- ESBuild

---

## 📁 Project Structure

```
Skill-Safar/
├── src/                          # Application source code
├── .env.example                  # Example environment variables
├── firebase-applet-config.json   # Firebase applet configuration
├── firebase-blueprint.json       # Firebase project blueprint
├── firestore.rules               # Firestore security rules
├── index.html                    # Application entry point
├── metadata.json                 # Applet metadata (name, description, capabilities)
├── package.json                  # Dependencies and npm scripts
├── tsconfig.json                 # TypeScript configuration
└── vite.config.ts                # Vite build configuration
```

---

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/) (LTS) or [Bun](https://bun.sh/)
- A **Google Gemini API key** ([get one here](https://ai.google.dev/))
- A **Firebase project** (for Firestore-backed features)

### 1. Clone the repository

```bash
git clone https://github.com/mansooranas53/Skill-Safar.git
cd Skill-Safar
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Copy the example file and fill in your own values:

```bash
cp .env.example .env
```

| Variable | Required | Description |
|---|:---:|---|
| `GEMINI_API_KEY` | ✅ | API key for Gemini calls. In AI Studio, this is auto-injected at runtime, or configured via the **Secrets** panel. |
| `APP_URL` | ✅ | The URL where the applet is hosted (used for self-referential links, OAuth callbacks, and API endpoints). Auto-injected by AI Studio with the Cloud Run service URL when deployed there. |

### 4. Run the development server

```bash
npm run dev
```

The app will be available at **http://localhost:3000**.

---

## 📜 Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Starts the Vite development server on port `3000` |
| `npm run build` | Builds the app for production |
| `npm run preview` | Serves the production build locally for a final check |
| `npm run lint` | Runs `tsc --noEmit` for type-checking |
| `npm run clean` | Removes generated build artifacts (`dist`, `server.js`) |

---

## 🔥 Firebase Configuration

Skill Safar ships with the following Firebase-related files:

- **`firebase-applet-config.json`** — applet-level Firebase configuration
- **`firebase-blueprint.json`** — Firebase project blueprint (services, resources)
- **`firestore.rules`** — Firestore security rules governing data access

Before deploying, create your own Firebase project and update these files with your project's credentials and rules as needed.

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

1. **Fork** the repository
2. **Create** a feature branch
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Commit** your changes
   ```bash
   git commit -m "Add: your feature description"
   ```
4. **Push** to your branch
   ```bash
   git push origin feature/your-feature-name
   ```
5. **Open a Pull Request** describing your changes

Please open an issue first to discuss significant changes.

---

## 📄 License

No license has been specified for this project yet. All rights are reserved by the repository owner unless stated otherwise. Please reach out to the maintainer for usage or contribution terms.

---

## 🙏 Acknowledgements

- Scaffolded from the [`google-gemini/aistudio-repository-template`](https://github.com/google-gemini/aistudio-repository-template)
- Built for **Smart India Hackathon (SIH) 2026**

---

<div align="center">

Made with ❤️ for **SIH 2026**

</div>
