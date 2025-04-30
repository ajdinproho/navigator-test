# Navigator Test

This project contains automated tests for the Navigator.ba web application using Cypress testing framework.

## Project Overview

The test suite covers various functionalities of the Navigator.ba application including:
- Basic page navigation and UI verification
- Search functionality for streets and places
- Map interactions
- Localization (Bosnian and English)
- Responsive design verification for different viewports
- Form submissions and API interactions

## Prerequisites

Before running the tests, make sure you have the following installed:
- [Node.js](https://nodejs.org/) (v16 or higher recommended)
- npm (comes with Node.js)
- One of the following browsers (for headed testing):
  - Google Chrome
  - Mozilla Firefox
  - Microsoft Edge

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/ajdinproho/navigator-test.git
   ```

2. Navigate to the project directory:
   ```
   cd navigator-test
   ```

3. Install the dependencies:
   ```
   npm install
   ```

## Running Tests

The project includes several npm scripts to run the tests in different ways:

### Open Cypress Test Runner (Interactive Mode)

To open the Cypress Test Runner for interactive testing:

```
npm run cypress:open
```

This opens the Cypress dashboard where you can select specific test files to run and watch them execute in real-time.

### Run All Tests Headlessly

To run all tests in headless mode (default browser):

```
npm test
```

### Run Tests in Specific Browsers

Run tests using Google Chrome:
```
npm run chrome
```

Run tests using Mozilla Firefox:
```
npm run firefox
```

Run tests using Microsoft Edge:
```
npm run edge
```

## Test Structure

The test suite consists of two main test files:

- [smokeTest.cy.js](cypress/e2e/smokeTest.cy.js) - Basic smoke tests verifying core functionality
- [navigatorTests.cy.js](cypress/e2e/navigatorTests.cy.js) - More detailed tests for specific features

### Helper Files

- [selectors.js](cypress/helpers/selectors.js) - Contains CSS selectors used across test files
- [commands.js](cypress/support/commands.js) - Contains custom Cypress commands

## Configuration

The Cypress configuration can be found in [cypress.config.js](cypress.config.js). Key settings include:

- `testIsolation: false` - Tests run in sequence without reloading between each test
- Viewport dimensions set to 1512x982 by default

## Notes

- When running visual/responsive tests, results may vary depending on the monitor resolution
- Some tests include specific waits (`cy.wait(500)`) to handle application state transitions
- The mobile viewport test is skipped by default as Cypress doesn't perfectly simulate mobile devices