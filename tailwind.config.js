const plugin = require("tailwindcss/plugin");

/** @type {import('tailwindcss').Config} */
module.exports = {
  plugins: [
    import('@midudev/tailwind-animations').then((module) => module.default),
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
          "primary": "#FF1F5A", // Adopting the bright red from the light theme for vibrant spirit
          "secondary": "#00B3B1", // Bringing in the refreshing teal for a complementary secondary color
          "accent": "#FFD500", // Using the vivid yellow for eye-catching highlights, consistent with the light theme
          "neutral": "#007BB5", // A lighter shade of blue compared to the light theme, for balance in the dark theme
          "base-100": "#2E2E2E", // A softer dark base than deep black, making for a less harsh contrast

          "--rounded-box": "50px", // Matching the light theme's subtly rounded corners
          "--rounded-btn": "50px", // Consistency in button rounding
          "--rounded-badge": "1.25rem", // Unifying badge rounding with the light theme
          "--animation-btn": "0.2s", // Keeping animation timings consistent
          "--animation-input": "0.15s", // Same as the light theme, for cohesion
          "--btn-focus-scale": "0.97", // Aligning the focus scale with the light theme for uniformity
          "--border-btn": "2px solid var(--neutral)", // Adjusted border thickness for coherence
          "--tab-border": "2px solid var(--accent)", // Matching the accent color and border thickness with the light theme
          "--tab-radius": "0.25rem" //
        },
        "atari-light": {
          "primary": "#D11124", // A slightly deeper red, adding a modern twist while staying true to the Atari logo
          "secondary": "#F2C94C", // A lighter golden yellow, for a fresher, modern retro look
          "accent": "#669977", // A softer green, balancing the retro and modern aesthetic
          "neutral": "#2D2D2D", // A slightly lighter dark gray, improving readability without losing depth
          "base-100": "#FAFAFA", // Off-white, softening the overall look for modern sensibilities

          "--rounded-box": "0.2rem", // Slightly rounded edges for a subtle modern touch
          "--rounded-btn": "0.2rem",
          "--rounded-badge": "0.2rem",
          "--animation-btn": "0.25s", // Slightly faster, for a more responsive feel
          "--animation-input": "0.15s",
          "--btn-focus-scale": "0.95", // A more noticeable scale change for focused buttons
          "--border-btn": "2px solid var(--neutral)", // Thicker borders for buttons, enhancing their prominence
          "--tab-border": "3px solid var(--primary)", // Thicker and more pronounced tab borders
          "--tab-radius": "0.2rem" // Sli
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
          "primary": "#5A5A5A", // A slightly darker shade of silver for enhanced contrast against other elements
          "secondary": "#0057B8", // A deeper shade of blue for a more sophisticated look while maintaining vibrancy
          "accent": "#FFC300", // A richer shade of yellow, adding depth to the energetic highlights
          "neutral": "#2E2E2E", // A tad lighter for better contrast and readability against the white background
          "base-100": "#FAFAFA", // A slightly off-white background for reducing glare and enhancing visual comfort

          "--rounded-box": "0.25rem", // Uniformly rounded edges for boxes to soften the overall look slightly
          "--rounded-btn": "0.25rem", // Matching rounded buttons for consistency across interactive elements
          "--rounded-badge": "0.5rem", // Less pronounced rounding for badges to align with the theme's modernity
          "--animation-btn": "0.25s", // A touch slower for a smoother transition effect
          "--animation-input": "0.2s", // Slightly slower to match button animation, creating a cohesive feel
          "--btn-focus-scale": "0.98", // A subtle change in scale to keep focus effect noticeable yet refined
          "--border-btn": "2px solid var(--neutral)", // Thicker borders for a more defined look
          "--tab-border": "3px solid var(--secondary)", // Emphasizing the tab selection with a thicker and colored border
          "--tab-radius": "0.25rem" // Cons
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
          "primary": "#FF8C00", // A slightly deeper orange, adding a modern edge while staying true to the Dreamcast vibe
          "secondary": "#1E90FF", // A more vivid sky blue, enhancing visibility and contrast
          "accent": "#E6E6E6", // A soft off-white, offering a subtle contrast against pure white elements
          "neutral": "#DCDCDC", // A slightly darker shade of grey for improved contrast and depth
          "base-100": "#FAFAFA", // A softer white for the background, reducing glare and enhancing visual comfort

          "--rounded-box": "0.3rem", // Slightly more rounded edges for boxes, aligning with modern design trends
          "--rounded-btn": "0.3rem", // Uniformly rounded buttons for a cohesive look across interactive elements
          "--rounded-badge": "0.75rem", // Moderately rounded badges, providing a balanced appearance
          "--animation-btn": "0.25s", // A smoother transition effect for buttons
          "--animation-input": "0.2s", // A uniform animation speed for inputs, matching the button animation for consistency
          "--btn-focus-scale": "0.99", // A subtle yet noticeable focus effect, enhancing usability without distracting
          "--border-btn": "2px solid var(--neutral)", // Thicker borders for buttons, making them more defined against the background
          "--tab-border": "2px solid var(--secondary)", // A bolder tab border for increased prominence and clarity
          "--tab-radius": "0.3rem" // S
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
          "primary": "#0E6B0E", // A slightly deeper green, enhancing the Xbox's signature color for sophistication
          "secondary": "#404040", // A slightly darker grey, offering better contrast and depth
          "accent": "#E8E8E8", // A softer near-white, reducing the starkness while maintaining brightness
          "neutral": "#CCCCCC", // Medium grey, balancing the contrast between the primary and secondary colors
          "base-100": "#F7F7F7", // A warmer shade of white, offering a more inviting and less clinical backdrop

          "--rounded-box": "0.6rem", // Increasing the rounding for a more modern, friendly appearance
          "--rounded-btn": "0.4rem", // Slightly more rounded buttons for consistency with the box styling
          "--rounded-badge": "1rem", // Reducing the badge rounding for a subtler, more contemporary look
          "--animation-btn": "0.3s", // A smoother animation for buttons, enhancing the user experience
          "--animation-input": "0.25s", // A slightly longer animation for inputs, matching the overall feel
          "--btn-focus-scale": "0.99", // A more subtle focus effect, reducing visual jitters on click
          "--border-btn": "2px solid var(--secondary)", // Using the secondary color for button borders for enhanced contrast
          "--tab-border": "2px solid var(--primary)", // Thicker, more visible borders for tabs to stand out
          "--tab-radius": "0.6rem" // I
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
