
import { createRoot } from "react-dom/client"
import App from "./App"
import "./index.css"
import React from "react"

const root = document.getElementById("root")
if (root) {
  createRoot(root).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  )
}
