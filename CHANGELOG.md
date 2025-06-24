# Changelog

## v2.0.0 - The Great Refactor

This version represents a complete overhaul of the original API, focusing on stability, performance, maintainability, and developer experience.

### Added
- **Project Restructuring:** Migrated all source code into a `src` directory for better organization.
- **New Modules:** Split the main `Server.js` into separate modules for the server, dashboard (`src/dashboard.js`), logger (`src/logger.js`), and configuration (`src/config.js`).
- **Data Directory:** Created a `data` directory for storing large JSON data files, separating them from the source code.
- **Development Scripts:** Added `npm run dev` script using `nodemon` for automatic server restarts during development.
- **Error Handling:** Implemented global `uncaughtException` and `unhandledRejection` handlers to improve server stability.
- **Documentation:** Created a comprehensive `README.md` with installation instructions, configuration details, and full API documentation.

### Changed
- **Dependencies:** Updated all dependencies, patched security vulnerabilities, and correctly defined `dependencies` and `devDependencies`.
- **API Endpoint Renaming:** Renamed several endpoints for consistency and to follow RESTful conventions (e.g., `/api/stock/GetStock` is now `/api/stock`).
- **Performance:**
  - Added in-memory caching to the `/api/stock` and `/api/weather` endpoints to reduce external API calls and improve response times.
  - Removed on-start file downloads in the `Calculate.js` module, opting for direct local imports.
- **Code Quality & Readability:**
  - Refactored all route files in `src/routes` (formerly `Funcs`) to improve validation, error handling, and code structure.
  - Replaced repetitive code in `GetRestockTime.js` with a data-driven approach.
  - Consolidated duplicate formatting functions in `GetStock.js`.
  - Refactored `FruitDatabase.js` to use an array of objects with named properties instead of arrays of arrays, improving readability in `Calculate.js`.

---

## Original Repository Changelog (pre-v2.0.0)

### v1.1.6
#### Changed
- Made a temp fix to /stock/getstock

### v1.1.5
#### Added
- Calculate Plant Value Module

### v1.1.4
#### Fixed Vulcan API issue :D
- Nice Try Vulcan but if you want to contact me my username is | ijuew | on Discord

### v1.1.3
#### Added Back Weather
- Yippe :D

### v1.1.2
#### Added Hash Check
- This Will Prevent Too much Traffic from senting a lot of request to vulcan api

### v1.1.1
#### Fixed GetStock
- Removed Old Method of Getting Stocks
- Stoled Some other guy Api 🤑

### v1.1.0
#### Added
- Added Proper Error Codes for Weather & GetStock
- Added success to Weather & GetStock

### v1.0
#### Added / Changed
- Added /api/stocks/getstock
- Added /api/stocks/restock-time
- Added /api/getweather
- Added /api/item-info
- Added IP Whitelisted
- Added Changeable port
- Added Dashboard You can disable it if you don't like it or want to use it through servers
