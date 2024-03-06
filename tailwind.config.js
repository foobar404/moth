const plugin = require('tailwindcss/plugin')

/** @type {import('tailwindcss').Config} */
module.exports = {
  plugins: [
    require("daisyui"),
    plugin(function ({ addUtilities }) {
      addUtilities({
        ".top": {
          "align-self": "flex-start",
          "top": 0,
        },
        ".right": {
          "align-self": "flex-end",
          "right": 0,
        },
        ".bottom": {
          "align-self": "flex-end",
          "bottom": 0,
        },
        ".left": {
          "align-self": "flex-start",
          "left": 0,
        },
        ".center": {
          "align-self": "center",
          "left": "50%",
          "transform": "translateX(-50%)",
        },
        ".col": {
          "display": "flex",
          "flex-wrap": "wrap",
          "flex-direction": "column",
          "align-items": "center",
        },
        ".col-top": {
          "display": "flex",
          "flex-wrap": "wrap",
          "flex-direction": "column",

          "align-items": "flex-start",
        },
        ".col-bottom": {
          "display": "flex",
          "flex-wrap": "wrap",
          "flex-direction": "column",

          "align-items": "flex-end",
        },
        ".col-left": {
          "display": "flex",
          "flex-wrap": "wrap",
          "flex-direction": "column",

          "align-items": "flex-start",
        },
        ".col-right": {
          "display": "flex",
          "flex-wrap": "wrap",
          "flex-direction": "column",

          "align-items": "flex-end",
        },
        ".row": {
          "display": "flex",
          "flex-wrap": "wrap",
          "flex-direction": "row",
          "justify-content": "center",
          "align-items": "flex-start",
        },
        ".row-top": {
          "display": "flex",
          "flex-wrap": "wrap",
          "flex-direction": "row",
          "justify-content": "center",
          "align-items": "flex-start",
        },
        ".row-bottom": {
          "display": "flex",
          "flex-wrap": "wrap",
          "flex-direction": "row",
          "justify-content": "center",
          "align-items": "flex-end",
        },
        ".row-left": {
          "display": "flex",
          "flex-wrap": "wrap",
          "flex-direction": "row",
          "justify-content": "flex-start",
          "align-items": "center",
        },
        ".row-right": {
          "display": "flex",
          "flex-wrap": "wrap",
          "flex-direction": "row",
          "justify-content": "flex-end",
          "align-items": "center",
        },
      })
    })
  ],
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
  },
}
