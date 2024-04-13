const createPlugin = require('tailwindcss/plugin.js');


module.exports = createPlugin(function ({ addUtilities }) {
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