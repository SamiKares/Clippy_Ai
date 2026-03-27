# 📎 Clippy AI — Electron + LM Studio Overlay

A transparent, always-on-top Windows 95-styled Clippy assistant powered by **Qwen 3.5 9B** running locally via **LM Studio**.

---

## 🚀 Quick Start

### 1. Prerequisites

- [Node.js](https://nodejs.org/) v18+
- [LM Studio](https://lmstudio.ai/) with **Qwen 3.5 9B** downloaded
- Electron (`npm install` handles this)

### 2. Start LM Studio Server

1. Open LM Studio
2. Load the **Qwen 3.5 9B** model (or any OpenAI-compatible model)
3. Go to **Local Server** tab → click **Start Server**
4. Default port: `1234`

### 3. Install & Run

```bash
# Install dependencies
npm install

# Launch Clippy!
npm start
```

---

## 🎛️ Features

| Feature | Details |
|---|---|
| 🪟 Transparent overlay | No window chrome, floats above everything |
| 📌 Always on top | Pinned above all other windows |
| 🖱️ Draggable | Drag the blue title bar anywhere |
| 👁️ Pupil tracking | Clippy's eyes follow your cursor |
| ⌨️ Typewriter text | Responses appear character by character |
| 💬 Conversation memory | Maintains last 10 turns of context |
| ⚡ Quick prompts | One-click buttons for common tasks |
| ⌨️ Keyboard shortcut | `Ctrl+Shift+C` (or `Cmd+Shift+C`) to toggle |

---

## ⚙️ Configuration

In the app's input area you can change:
- **Server URL** — default `http://localhost:1234`
- **Model ID** — default `qwen-3.5-9b` (match what LM Studio shows)

---

## 🗺️ Agentic Roadmap

### Step 1 — Vision (Screenshot context)
```bash
npm install screenshot-desktop
```
```js
const screenshot = require('screenshot-desktop');
const img = await screenshot({ format: 'png' });
// Send as base64 to LM Studio with vision model
```

### Step 2 — Tool Calling (Function calling)
Define tools as JSON schema, pass to the model:
```js
tools: [{
  type: "function",
  function: {
    name: "open_file",
    description: "Open a file on the system",
    parameters: {
      type: "object",
      properties: {
        path: { type: "string" }
      }
    }
  }
}]
```
Qwen 3.5 9B will return structured JSON you can execute via Node.js `fs`, `child_process`, or `shell.openPath()`.

### Step 3 — Voice
```js
// In index.html — Web Speech API (built into Chromium/Electron)
const utterance = new SpeechSynthesisUtterance(reply);
utterance.pitch = 1.4;   // Slightly high-pitched Clippy voice
utterance.rate  = 1.1;
speechSynthesis.speak(utterance);
```

---

## 🏗️ File Structure

```
clippy-electron/
├── main.js          ← Electron main process (window, IPC, shortcuts)
├── preload.js       ← Secure IPC bridge
├── index.html       ← UI, Clippy SVG, CSS, chat logic
├── package.json     ← npm config + electron-builder
└── README.md        ← This file
```

---

## 🎨 Customising the Persona

Edit the `SYSTEM_PROMPT` constant in `index.html`:

```js
const SYSTEM_PROMPT = `You are Clippy... (your custom persona here)`;
```

Ideas:
- **Sarcastic Clippy** — "It looks like you're failing at this. Again."
- **Zen Clippy** — Haiku responses only
- **DevOps Clippy** — Always suggests Docker

---

## 📦 Building a Distributable

```bash
# Windows
npm run build-win

# macOS
npm run build-mac

# Linux
npm run build-linux
```

Outputs appear in the `dist/` folder.

---

## 🐛 Troubleshooting

| Problem | Fix |
|---|---|
| Can't connect to LM Studio | Ensure server is running and port is `1234` |
| Model ID mismatch | Copy exact model ID from LM Studio's server tab |
| Window won't appear | Try `Ctrl+Shift+C` to toggle visibility |
| Transparent window looks wrong | Disable GPU acceleration: add `--disable-gpu` flag |

---

*Built with ❤️ and paperclips*
