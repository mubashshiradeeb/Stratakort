import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        paper: {
          DEFAULT: "#EEF0EA",
          soft: "#F5F6F1",
          dim: "#E3E6DD",
        },
        ink: {
          DEFAULT: "#14181A",
          soft: "#3A4340",
          faint: "#6B746F",
        },
        brass: {
          DEFAULT: "#B8863F",
          light: "#D3A662",
          dark: "#8F672E",
        },
        forest: {
          DEFAULT: "#33463A",
          light: "#4A6252",
        },
        line: {
          DEFAULT: "#D8DBD1",
          strong: "#C1C6B9",
        },
      },
      fontFamily: {
        display: [
          "Georgia",
          "Iowan Old Style",
          "Palatino Linotype",
          "Palatino",
          "serif",
        ],
        body: [
          "Inter",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Helvetica Neue",
          "Arial",
          "sans-serif",
        ],
        mono: [
          "IBM Plex Mono",
          "SFMono-Regular",
          "Menlo",
          "Consolas",
          "monospace",
        ],
      },
      letterSpacing: {
        widest2: "0.28em",
      },
      boxShadow: {
        // Layered like a real framed print resting on a wall: a tight,
        // close contact shadow under the frame edge, plus a large soft
        // ambient shadow that gives it physical depth.
        poster:
          "0 1px 1px rgba(20,24,26,0.14), 0 8px 16px -10px rgba(20,24,26,0.35), 0 40px 80px -30px rgba(20,24,26,0.5)",
        "poster-lg":
          "0 2px 2px rgba(20,24,26,0.16), 0 14px 24px -12px rgba(20,24,26,0.4), 0 60px 110px -35px rgba(20,24,26,0.55)",
        panel: "0 1px 2px rgba(20,24,26,0.06)",
        // A faint inner bevel where a mat meets glass — used sparingly on
        // the live preview's map/frame boundary.
        bevel: "inset 0 0 0 1px rgba(20,24,26,0.06), inset 0 1px 3px rgba(20,24,26,0.08)",
      },
      backgroundImage: {
        contour:
          "radial-gradient(circle at 30% 20%, rgba(184,134,63,0.08), transparent 45%)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "draw-line": {
          "0%": { strokeDashoffset: "1" },
          "100%": { strokeDashoffset: "0" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.6s cubic-bezier(0.16, 1, 0.3, 1) both",
      },
    },
  },
  plugins: [],
};

export default config;
