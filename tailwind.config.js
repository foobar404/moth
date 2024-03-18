const plugin = require("tailwindcss/plugin");


/** @type {import('tailwindcss').Config} */
module.exports = {
  plugins: [
    require("daisyui"),
    plugin(function ({ addUtilities }) {
      addUtilities({
        ".top": {
          "top": 0,
          "left": "50%",
          "transform": "translateX(-50%)",
        },
        ".right": {
          "right": 0,
          "top": "50%",
          "transform": "translateY(-50%)",
        },
        ".bottom": {
          "bottom": 0,
          "left": "50%",
          "transform": "translateX(-50%)",
        },
        ".left": {
          "left": 0,
          "top": "50%",
          "transform": "translateY(-50%)",
        },
        ".center": {
          "left": "50%",
          "top": "50%",
          "transform": "translateY(-50%) translateX(-50%)",
        },
        ".col": {
          "display": "flex",
          "flex-direction": "column",
          "align-items": "center",
        },
        ".col-top": {
          "display": "flex",
          "flex-direction": "column",
          "align-items": "flex-start",
        },
        ".col-bottom": {
          "display": "flex",
          "flex-direction": "column",
          "align-items": "flex-end",
        },
        ".col-left": {
          "display": "flex",
          "flex-direction": "column",
          "align-items": "flex-start",
        },
        ".col-right": {
          "display": "flex",
          "flex-direction": "column",
          "align-items": "flex-end",
        },
        ".col-between": {
          "display": "flex",
          "flex-direction": "column",
          "align-items": "center",
        },
        ".col-around": {
          "display": "flex",
          "flex-direction": "column",
          "align-items": "center",
        },
        ".col-evenly": {
          "display": "flex",
          "flex-direction": "column",
          "align-items": "center",
        },
        ".row": {
          "display": "flex",
          "flex-direction": "row",
          "justify-content": "center",
          "align-items": "center",
        },
        ".row-top": {
          "display": "flex",
          "flex-direction": "row",
          "justify-content": "center",
          "align-items": "flex-start",
        },
        ".row-bottom": {
          "display": "flex",
          "flex-direction": "row",
          "justify-content": "center",
          "align-items": "flex-end",
        },
        ".row-left": {
          "display": "flex",
          "flex-direction": "row",
          "justify-content": "flex-start",
          "align-items": "center",
        },
        ".row-right": {
          "display": "flex",
          "flex-direction": "row",
          "justify-content": "flex-end",
          "align-items": "center",
        },
        "row-between": {
          "display": "flex",
          "flex-direction": "row",
          "justify-content": "space-between",
          "align-items": "center",
        },
        "row-around": {
          "display": "flex",
          "flex-direction": "row",
          "justify-content": "space-around",
          "align-items": "center",
        },
        "row-evenly": {
          "display": "flex",
          "flex-direction": "row",
          "justify-content": "space-evenly",
          "align-items": "center",
        }
      })
    })
  ],
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        bounce200: 'bounce 1s infinite 200ms',
        bounce400: 'bounce 1s infinite 400ms',
      }
    },
  },
  daisyui: {
    themes: [
      {
        "light": {
          "primary": "#ff6384", // Vibrant pink, for a lively and energetic primary color
          "secondary": "#ffcd56", // Bright yellow, ensuring a cheerful and vibrant secondary color
          "accent": "#36a2eb", // Bright blue for a striking accent color
          "neutral": "#455a64", // Deep slate for text and neutral elements, offering contrast
          "base-100": "#ffffff", // White background, keeping the design light and airy

          "--rounded-box": "1rem",
          "--rounded-btn": "0.5rem",
          "--rounded-badge": "1.9rem",
          "--animation-btn": "0.25s",
          "--animation-input": "0.2s",
          "--btn-focus-scale": "0.95",
          "--border-btn": "1px",
          "--tab-border": "1px",
          "--tab-radius": "0.5rem",
        },
        "dark": {
          "primary": "#ff6b81", // Deep, vibrant pink, offering warmth and energy
          "secondary": "#ffc658", // Golden yellow, for a rich and vibrant secondary hue
          "accent": "#4bc0c0", // Teal for a refreshing accent, balancing warmth with coolness
          "neutral": "#9e9e9e", // Mid-grey for neutral elements, to contrast against the dark background
          "base-100": "#303030", // Dark charcoal, serving as a rich backdrop for vibrant colors

          "--rounded-box": "1rem",
          "--rounded-btn": "0.5rem",
          "--rounded-badge": "1.9rem",
          "--animation-btn": "0.25s",
          "--animation-input": "0.2s",
          "--btn-focus-scale": "0.95",
          "--border-btn": "1px",
          "--tab-border": "1px",
          "--tab-radius": "0.5rem",
        },
        "luna-moth": {
          "primary": "#c6e377", // Soft, luminescent green inspired by the moth's wings
          "secondary": "#f2f2f2", // Soft white, mimicking the moth's subtle body color
          "accent": "#a4de95", // Slightly brighter green for accent pieces
          "neutral": "#495057", // Medium grey for text, providing earthy contrast
          "base-100": "#ffffff", // White background for a light, airy feel

          "--rounded-box": "1rem",
          "--rounded-btn": "0.5rem",
          "--rounded-badge": "1.9rem",
          "--animation-btn": "0.25s",
          "--animation-input": "0.2s",
          "--btn-focus-scale": "0.95",
          "--border-btn": "1px",
          "--tab-border": "1px",
          "--tab-radius": "0.5rem",
        },
        "hawk-moth": {
          "primary": "#987654", // Muted brown, inspired by the moth's wing color
          "secondary": "#d2b48c", // Tan, reflecting the underwing
          "accent": "#c19a6b", // Light brown for accents, mimicking the moth's body
          "neutral": "#363636", // Dark grey for strong, grounded contrast
          "base-100": "#f0ebe5", // Off-white background, for a warm, inviting base

          "--rounded-box": "1rem",
          "--rounded-btn": "0.5rem",
          "--rounded-badge": "1.9rem",
          "--animation-btn": "0.25s",
          "--animation-input": "0.2s",
          "--btn-focus-scale": "0.95",
          "--border-btn": "1px",
          "--tab-border": "1px",
          "--tab-radius": "0.5rem",
        },
        "atlas-moth": {
          "primary": "#cc8e35", // Warm orange, drawing from the moth's vibrant wing spots
          "secondary": "#a67b5b", // Rich tan, inspired by the moth's overall tone
          "accent": "#f4c430", // Saffron yellow for bright accents
          "neutral": "#4e4039", // Deep, earthy brown for neutral elements
          "base-100": "#fafaf6", // Soft, pale background to complement the warm tones

          "--rounded-box": "1rem",
          "--rounded-btn": "0.5rem",
          "--rounded-badge": "1.9rem",
          "--animation-btn": "0.25s",
          "--animation-input": "0.2s",
          "--btn-focus-scale": "0.95",
          "--border-btn": "1px",
          "--tab-border": "1px",
          "--tab-radius": "0.5rem",
        },
        "emperor-moth": {
          "primary": "#806517", // Dark gold, inspired by the eye spots on the wings
          "secondary": "#40916c", // Rich green, reflecting the moth's natural habitat
          "accent": "#e9c46a", // Amber for a striking contrast and vibrancy
          "neutral": "#283618", // Dark green, grounding the palette with depth
          "base-100": "#edf2f4", // Light grey background, for balance and neutrality

          "--rounded-box": "1rem",
          "--rounded-btn": "0.5rem",
          "--rounded-badge": "1.9rem",
          "--animation-btn": "0.25s",
          "--animation-input": "0.2s",
          "--btn-focus-scale": "0.95",
          "--border-btn": "1px",
          "--tab-border": "1px",
          "--tab-radius": "0.5rem",
        },
      },
      "cupcake",
      "bumblebee",
      "emerald",
      "corporate",
      "synthwave",
      "retro",
      "cyberpunk",
      "valentine",
      "halloween",
      "garden",
      "forest",
      "aqua",
      "lofi",
      "pastel",
      "fantasy",
      "wireframe",
      "black",
      "luxury",
      "dracula",
      "cmyk",
      "autumn",
      "business",
      "acid",
      "lemonade",
      "night",
      "coffee",
      "winter",
      "dim",
      "nord",
      "sunset",
    ],
  },
}
