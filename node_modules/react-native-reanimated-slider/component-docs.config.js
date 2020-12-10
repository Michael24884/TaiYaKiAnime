// import path from "path";

module.exports = {
  port: 1234,
  pages: [
    { type: "component", file: "./src/Ballon.js", group: "s" },
    { type: "component", file: "./src/Slider.js", group: "s" }
  ],
  output: "./docs"
};
