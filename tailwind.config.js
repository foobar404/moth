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
        ".top-left": {
          "top": 0,
          "left": 0,
        },
        ".top-right": {
          "top": 0,
          "right": 0,
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
        ".bottom-left": {
          "bottom": 0,
          "left": 0,
        },
        ".bottom-right": {
          "bottom": 0,
          "right": 0,
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
        ".row-between": {
          "display": "flex",
          "flex-direction": "row",
          "justify-content": "space-between",
          "align-items": "center",
        },
        ".row-around": {
          "display": "flex",
          "flex-direction": "row",
          "justify-content": "space-around",
          "align-items": "center",
        },
        ".row-evenly": {
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
        "n64-light": {
          "primary": "#E60012", // Classic red, reminiscent of the Nintendo logo and N64 accents
          "secondary": "#0058A6", // Deep blue, representing the cool tones of the N64 branding
          "accent": "#009E60", // Vibrant green, for lively accents, reflecting the colorful gaming experiences
          "neutral": "#A5A5A5", // Medium grey, for text and neutral elements, ensuring readability and contrast
          "base-100": "#bfbbbc", // Clean white background, keeping the design light and engaging

          "--rounded-box": "10px",
          "--rounded-btn": "10px",
          "--rounded-badge": "1rem",
          "--animation-btn": "0.3s",
          "--animation-input": "0.25s",
          "--btn-focus-scale": "0.98",
          "--border-btn": "2px solid var(--neutral)",
          "--tab-border": "1px solid var(--neutral)",
          "--tab-radius": "0.25rem"
        },
        "n64-dark": {
          "primary": "#E57373", // Soft red, providing warmth against the dark backdrop
          "secondary": "#64B5F6", // Lighter blue, for a subtle glow in the dark theme
          "accent": "#FFF176", // Bright yellow, standing out vibrantly
          "neutral": "#B0BEC5", // Light blue-grey, for legible text and neutral elements
          "base-100": "#263238", // Dark slate grey, offering a sleek, modern look

          "--rounded-box": "0.25rem",
          "--rounded-btn": "0.15rem",
          "--rounded-badge": "1rem",
          "--animation-btn": "0.3s",
          "--animation-input": "0.25s",
          "--btn-focus-scale": "0.98",
          "--border-btn": "2px solid var(--neutral)",
          "--tab-border": "1px solid var(--accent)",
          "--tab-radius": "0.25rem"
        },
        "gbc-light": {
          "primary": "#FF1F5A", // Bright red, capturing the vibrant spirit of Game Boy Color games
          "secondary": "#00B3B1", // Teal, for a refreshing secondary color that complements the red
          "accent": "#FFD500", // Vivid yellow, for eye-catching highlights and interactive elements
          "neutral": "#005A9C", // Deep blue, offering a solid base for text and detailed UI elements
          "base-100": "#FFFFFF", // Classic white, ensuring a bright and clean backdrop for contrast

          "--rounded-box": "50px", // Subtly rounded corners to soften the overall look
          "--rounded-btn": "50px",
          "--rounded-badge": "1.25rem",
          "--animation-btn": "0.2s",
          "--animation-input": "0.15s",
          "--btn-focus-scale": "0.97",
          "--border-btn": "2px solid var(--neutral)",
          "--tab-border": "2px solid var(--accent)",
          "--tab-radius": "0.25rem"
        },
        "gbc-dark": {
          "primary": "#1B5E20", // Dark green, evoking the dense colors of Game Boy Color games at night
          "secondary": "#4CAF50", // Vibrant green, standing out against the dark theme
          "accent": "#CDDC39", // Lime green, for highlighted elements
          "neutral": "#C0CA33", // Olive green, ensuring text and details are soft yet readable
          "base-100": "#1E1E1E", // Deep black, for a modern twist on retro gaming

          "--rounded-box": "0rem",
          "--rounded-btn": "0rem",
          "--rounded-badge": "0rem",
          "--animation-btn": "0.2s",
          "--animation-input": "0.15s",
          "--btn-focus-scale": "0.95",
          "--border-btn": "1px solid var(--neutral)",
          "--tab-border": "1px solid var(--accent)",
          "--tab-radius": "0rem"
        },
        "atari-light": {
          "primary": "#E41E20", // Bright red, iconic to the Atari logo
          "secondary": "#F2B705", // Golden yellow, for a retro look and feel
          "accent": "#5E8C6A", // Forest green, providing a contrast reminiscent of classic Atari game covers
          "neutral": "#333333", // Dark gray, ensuring legibility and depth
          "base-100": "#FFFFFF", // Crisp white, offering a clean backdrop

          "--rounded-box": "0rem", // Square edges, reflecting the angular Atari console and joystick design
          "--rounded-btn": "0rem",
          "--rounded-badge": "0rem",
          "--animation-btn": "0.3s",
          "--animation-input": "0.2s",
          "--btn-focus-scale": "0.97",
          "--border-btn": "1px solid var(--neutral)",
          "--tab-border": "2px solid var(--primary)",
          "--tab-radius": "0rem"
        },
        "atari-dark": {
          "primary": "#FF6347", // Tomato red, vibrant against the dark theme
          "secondary": "#FFD700", // Bright gold, adding a luxurious touch
          "accent": "#66CDAA", // Medium aquamarine, for a pop of color
          "neutral": "#BDBDBD", // Light gray, for clear text on a dark background
          "base-100": "#121212", // Deep black, for a sleek, modern dark mode

          "--rounded-box": "0rem",
          "--rounded-btn": "0rem",
          "--rounded-badge": "0rem",
          "--animation-btn": "0.25s",
          "--animation-input": "0.15s",
          "--btn-focus-scale": "0.95",
          "--border-btn": "1px solid var(--neutral)",
          "--tab-border": "2px solid var(--accent)",
          "--tab-radius": "0rem"
        },
        "snes-light": {
          "primary": "#5C5CFF", // Bright blue, reminiscent of the SNES logo
          "secondary": "#FFD700", // Golden yellow, evoking the colorful buttons of the controller
          "accent": "#FF6565", // Soft red, for highlights and interactive elements
          "neutral": "#4F4F4F", // Medium gray, balancing the bright colors for text and UI
          "base-100": "#FFFFFF", // Pure white, serving as a clean, neutral backdrop

          "--rounded-box": "0.5rem",
          "--rounded-btn": "0.25rem",
          "--rounded-badge": "1.5rem",
          "--animation-btn": "0.2s",
          "--animation-input": "0.15s",
          "--btn-focus-scale": "0.98",
          "--border-btn": "2px solid var(--neutral)",
          "--tab-border": "1px solid var(--secondary)",
          "--tab-radius": "0.25rem"
        },
        "snes-dark": {
          "primary": "#787AFF", // Lavender blue, softer for the dark theme
          "secondary": "#FFC700", // Saturated yellow, standing out in the dark setting
          "accent": "#FF8A8A", // Warm red, ensuring elements pop against the dark
          "neutral": "#A0A0A0", // Lighter gray, for contrast and readability
          "base-100": "#1E1E1E", // Off-black, modern and sleek for dark mode enthusiasts

          "--rounded-box": "0.5rem",
          "--rounded-btn": "0.25rem",
          "--rounded-badge": "1.5rem",
          "--animation-btn": "0.2s",
          "--animation-input": "0.15s",
          "--btn-focus-scale": "0.98",
          "--border-btn": "2px solid var(--neutral)",
          "--tab-border": "1px solid var(--accent)",
          "--tab-radius": "0.25rem"
        },
        "genesis-light": {
          "primary": "#6B6B6B", // Metallic silver, reflecting the console's futuristic design
          "secondary": "#0072CE", // Bright Sega blue, vibrant and eye-catching
          "accent": "#FFD400", // Electric yellow, for energetic highlights
          "neutral": "#333333", // Dark gray, for readable text
          "base-100": "#FFFFFF", // Pure white, offering a clean and modern background

          "--rounded-box": "0.2rem",
          "--rounded-btn": "0.1rem",
          "--rounded-badge": "1rem",
          "--animation-btn": "0.2s",
          "--animation-input": "0.15s",
          "--btn-focus-scale": "0.97",
          "--border-btn": "1px solid var(--neutral)",
          "--tab-border": "2px solid var(--primary)",
          "--tab-radius": "0.2rem"
        },
        "genesis-dark": {
          "primary": "#8A8A8A", // Lighter silver, stands out against dark backgrounds
          "secondary": "#3392FF", // Sky blue, luminous in the dark theme
          "accent": "#FFEA00", // Brighter yellow, capturing attention
          "neutral": "#BDBDBD", // Light gray, ensuring legibility
          "base-100": "#121212", // Deep black, sleek and modern

          "--rounded-box": "0.2rem",
          "--rounded-btn": "0.1rem",
          "--rounded-badge": "1rem",
          "--animation-btn": "0.2s",
          "--animation-input": "0.15s",
          "--btn-focus-scale": "0.97",
          "--border-btn": "1px solid var(--neutral)",
          "--tab-border": "2px solid var(--accent)",
          "--tab-radius": "0.2rem"
        },
        "playstation-light": {
          "primary": "#003087", // Deep PlayStation blue, classic and distinguished
          "secondary": "#0070D1", // Brighter blue, for a dynamic contrast
          "accent": "#E60012", // Vibrant red, echoing the iconic PlayStation logo
          "neutral": "#4D4D4D", // Medium gray, balancing the bright colors for text
          "base-100": "#FFFFFF", // Crisp white background, clean and inviting

          "--rounded-box": "0.5rem",
          "--rounded-btn": "0.3rem",
          "--rounded-badge": "1.5rem",
          "--animation-btn": "0.25s",
          "--animation-input": "0.2s",
          "--btn-focus-scale": "0.98",
          "--border-btn": "2px solid var(--neutral)",
          "--tab-border": "1px solid var(--secondary)",
          "--tab-radius": "0.3rem"
        },
        "playstation-dark": {
          "primary": "#0051BA", // Slightly lighter blue, maintaining brand identity
          "secondary": "#0088FC", // Vivid sky blue, for standout elements
          "accent": "#FF2942", // Brighter red, ensuring visibility and vibrance
          "neutral": "#9E9E9E", // Silver gray, for clear text and details
          "base-100": "#1A1A1A", // Almost black, for deep contrast and modern flair

          "--rounded-box": "0.5rem",
          "--rounded-btn": "0.3rem",
          "--rounded-badge": "1.5rem",
          "--animation-btn": "0.25s",
          "--animation-input": "0.2s",
          "--btn-focus-scale": "0.98",
          "--border-btn": "2px solid var(--neutral)",
          "--tab-border": "1px solid var(--accent)",
          "--tab-radius": "0.3rem"
        },
        "dreamcast-light": {
          "primary": "#F7981D", // Bright orange, reminiscent of the Dreamcast logo
          "secondary": "#209CEE", // Sky blue, for a vibrant contrast
          "accent": "#FFFFFF", // Pure white, capturing the console's casing
          "neutral": "#E1E1E1", // Light grey, for background and UI elements
          "base-100": "#FFFFFF", // White background, reflecting the Dreamcast's innovative spirit

          "--rounded-box": "0.25rem",
          "--rounded-btn": "0.25rem",
          "--rounded-badge": "1rem",
          "--animation-btn": "0.2s",
          "--animation-input": "0.15s",
          "--btn-focus-scale": "0.98",
          "--border-btn": "1px solid var(--neutral)",
          "--tab-border": "1px solid var(--secondary)",
          "--tab-radius": "0.25rem"
        },
        "dreamcast-dark": {
          "primary": "#F7981D", // Bright orange, stands out against dark themes
          "secondary": "#209CEE", // Sky blue, for luminous details
          "accent": "#FFFFFF", // White, for stark contrast and focus
          "neutral": "#606060", // Medium grey, ensuring legibility
          "base-100": "#121212", // Deep black, for a sleek and modern look

          "--rounded-box": "0.25rem",
          "--rounded-btn": "0.25rem",
          "--rounded-badge": "1rem",
          "--animation-btn": "0.2s",
          "--animation-input": "0.15s",
          "--btn-focus-scale": "0.98",
          "--border-btn": "1px solid var(--neutral)",
          "--tab-border": "1px solid var(--accent)",
          "--tab-radius": "0.25rem"
        },
        "xbox-light": {
          "primary": "#107C10", // Vibrant Xbox green, for a dynamic and energetic feel
          "secondary": "#3A3A3A", // Dark grey, providing a strong contrast
          "accent": "#F2F2F2", // Almost white, for highlights and UI elements
          "neutral": "#D0D0D0", // Light grey, for background and less prominent UI
          "base-100": "#FFFFFF", // White, ensuring a bright and clean interface

          "--rounded-box": "0.5rem",
          "--rounded-btn": "0.3rem",
          "--rounded-badge": "1.5rem",
          "--animation-btn": "0.25s",
          "--animation-input": "0.2s",
          "--btn-focus-scale": "0.98",
          "--border-btn": "2px solid var(--neutral)",
          "--tab-border": "1px solid var(--secondary)",
          "--tab-radius": "0.5rem"
        },
        "xbox-dark": {
          "primary": "#107C10", // Bright Xbox green, glowing against dark backgrounds
          "secondary": "#707070", // Lighter grey, for contrast and depth
          "accent": "#E5E5E5", // Soft white, for key highlights
          "neutral": "#A5A5A5", // Medium grey, balancing the dark theme for readability
          "base-100": "#1E1E1E", // Almost black, for a deep, immersive experience

          "--rounded-box": "0.5rem",
          "--rounded-btn": "0.3rem",
          "--rounded-badge": "1.5rem",
          "--animation-btn": "0.25s",
          "--animation-input": "0.2s",
          "--btn-focus-scale": "0.98",
          "--border-btn": "2px solid var(--neutral)",
          "--tab-border": "1px solid var(--accent)",
          "--tab-radius": "0.5rem"
        }
      },
    ],
  },
}
