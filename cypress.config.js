const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    testIsolation: false,
    viewportHeight: 982,
    viewportWidth: 1512,
    baseUrl: 'http://www.navigator.ba',
  },
});
