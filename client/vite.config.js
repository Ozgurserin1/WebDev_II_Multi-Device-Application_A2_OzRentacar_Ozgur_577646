import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

const developmentCsp = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data:",
  "font-src 'self'",
  "connect-src 'self' ws://localhost:*",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'"
].join("; ");

const previewCsp = [
  "default-src 'self'",
  "script-src 'self'",
  "style-src 'self'",
  "img-src 'self' data:",
  "font-src 'self'",
  "connect-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'"
].join("; ");

export default defineConfig({
  plugins: [react()],
  server: {
    headers: {
      "Content-Security-Policy": developmentCsp
    },
    proxy: {
      "/api": "http://localhost:3000"
    }
  },
  preview: {
    headers: {
      "Content-Security-Policy": previewCsp
    }
  }
});
