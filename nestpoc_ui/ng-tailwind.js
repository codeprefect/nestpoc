module.exports = {
  configJS: './tailwind.config.js', // This is the js file created by tailwind when it was initialized
  sourceCSS: './src/assets/css/tailwind.css', // This is the css file we created
  outputCSS: './src/styles.scss', // This is the global style file
  sass: true, // False if using css
  purge: false,
  keyframes: false,
  fontFace: false,
  rejected: false,
  whitelist: [],
  whitelistPatterns: [],
  whitelistPatternsChildren: []
};
