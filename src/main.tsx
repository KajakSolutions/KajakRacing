import { createRoot } from "react-dom/client";
import "./index.scss";
import App from "./App";

document.addEventListener('DOMContentLoaded', () => {
    const root = createRoot(document.getElementById("root")!);
    root.render(<App />);
});
