import { defineFontFamilyInput } from "@font-family-input/html";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App";
import "./styles.css";

// Register the <font-family-input> Web Component for the demo section.
defineFontFamilyInput();

const root = document.getElementById("root");
if (!root) throw new Error("Missing #root");
createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
