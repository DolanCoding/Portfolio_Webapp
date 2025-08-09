// AI-AGENT CONTEXT: FILE=vite.config | ROLE=build_configuration | PURPOSE=vite_build_system_setup_react_plugin_configuration
// AI-DEPENDENCY: vite,@vitejs/plugin-react
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// AI-LOGICAL-REGION: Type_Definitions
type VitePluginConfig = ReturnType<typeof react>;

// AI-LOGICAL-REGION: Build_Configuration
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react() as VitePluginConfig],
});

/*
AI-AGENT CONTEXT: Vite Build Configuration
This file configures Vite build system for the React portfolio frontend.
Defines React plugin, build output directory, and development server settings.
Dependencies: Vite, React plugin, TypeScript support.
*/
