import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./main.css";
import { BrowserRouter } from "react-router-dom";

// AI-AGENT CONTEXT: FILE=main | ROLE=Application_Entry_Point | PURPOSE=React_App_Bootstrap_Router_Setup
// AI-NAVIGATION: EXPORT=None (Entry Point)

// AI-LOGICAL-REGION: Type_Definitions
type RootElement = HTMLElement;

// AI-LOGICAL-REGION: Root_Element_Setup
const root = ReactDOM.createRoot(
  document.getElementById("root") as RootElement
);

// AI-LOGICAL-REGION: App_Rendering
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);

// AI-AGENT END OF FILE
