# 🧠 AstroMind

AstroMind is an immersive, interactive cognitive evaluation web application. It offers quizzes across various disciplines (Mathematics, Science, History, Art, Sports, and Literature) and analyzes your scores to determine your unique cognitive profile based on the Theory of Multiple Intelligences.

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![Build](https://img.shields.io/badge/build-passing-brightgreen.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

---

## 🛠️ Tech Stack

AstroMind is built purely with web standards, relying heavily on modern JavaScript capabilities without the need for hefty frontend frameworks:

*   **Frontend:** HTML5, CSS3, Vanilla JavaScript (ES6+)
*   **3D Graphics:** [Three.js](https://threejs.org/) & GLTFLoader
*   **Data & Storage:** LocalStorage API, Fetch API
*   **Animations:** HTML5 Canvas API

---

## ✨ Key Features

*   🌌 **Interactive 3D Experience:** A responsive, rotating 3D brain model (Three.js) and a dynamic, hand-coded starry background using the Canvas API.
*   🧠 **Cognitive Profiling:** Evaluates test scores to classify your learning style (e.g., *Logical-Mathematical Thinker*, *Visual & Linguistic Creator*, or *Kinesthetic & Contextual Explorer*).
*   ⏱️ **Smart Canvas Timer:** A highly advanced circular exam timer featuring dynamic color changes and a mathematical heartbeat "pulse" effect as time runs out.
*   🛡️ **Anti-Cheat Mechanics:** Utilizes the History API (`pushState`/`popstate`) to prevent users from escaping exams using the back button, and `beforeunload` to prevent accidental page reloads.
*   🔐 **Local Authentication System:** A fully simulated user registration and login flow securely managed via the browser's LocalStorage.
*   🗂️ **Dynamic Content Rendering:** Exam questions are fetched seamlessly from external JSON data and rendered as a Single Page Application (SPA) experience.

---

## 🚀 Getting Started

Since this is a client-side web application, running it locally is incredibly fast and simple!

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/QA-Project.git
cd QA-Project
```

### 2. Run the application

**Using VS Code Live Server**
1. Open the project folder in VS Code.
2. Install the **Live Server** extension.
3. Right-click `index.html` and select **"Open with Live Server"**.

---

## 📂 Project Structure

```text
QA-Project/
 ├── assets/
 │    ├── css/          # Global and component-specific stylesheets
 │    ├── js/           # Core logic, timers, and 3D rendering scripts
 │    ├── images/       # Icons and logos
 │    ├── models/       # 3D .gltf/.bin files for the brain model
 │    └── data/         # questions.json containing all exam data
 ├── pages/
 │    ├── auth/         # Login and Registration pages
 │    └── exams/        # Subject-specific exam pages (math, art, etc.)
 ├── AstroMind_Documentation.md  # In-depth technical documentation
 └── index.html         # Main dashboard and entry point
```

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! 
If you want to contribute:
1. Fork the project.
2. Create your feature branch (`git checkout -b feature/AmazingFeature`).
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4. Push to the branch (`git push origin feature/AmazingFeature`).
5. Open a Pull Request.

## 📝 License

Distributed under the **MIT License**. See `LICENSE` for more information.
