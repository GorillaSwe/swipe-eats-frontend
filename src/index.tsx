import React from "react"
import { createRoot } from 'react-dom/client';
import App from "./App"
import "./index.css"
import { BrowserRouter } from 'react-router-dom'

const root = document.getElementById("root");

if (root) {
  const rootElement = createRoot(root);
  rootElement.render(
    <React.StrictMode>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </React.StrictMode>
  );
}