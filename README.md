# Grow-A-Garden API

This is the official backend API for Grow-A-Garden, providing real-time data for in-game items, stock, weather, and more. This documentation will guide you through setting up and using the API.

## Features

- **Real-time Data:** Get up-to-the-minute information on item stock, values, and weather.
- **Terminal Dashboard:** A built-in, blessed-based terminal dashboard for monitoring server activity, performance, and settings.
- **Dynamic Configuration:** Easily configure the server through `config.json`.
- **Robust and Performant:** Refactored for better performance, readability, and maintainability with features like caching.

## Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/XanaOG/Grow-A-Garden-API.git
    cd Grow-A-Garden-API-main
    ```

2.  **Install dependencies:**
    Make sure you have [Node.js](httpss://nodejs.org/) installed. Then, run the following command in the project's root directory:
    ```bash
    npm install
    ```

## Usage

You can run the server in two modes:

-   **Production Mode:**
    ```bash
    npm start
    ```
    This will start the server. If the dashboard is enabled in `config.json`, it will be displayed in your terminal.

-   **Development Mode:**
    ```bash
    npm run dev
    ```
    This command uses `nodemon` to automatically restart the server whenever you make changes to the source code, which is ideal for development.

## Configuration

The server can be configured using the `config.json` file in the root directory. If the file does not exist, it will be created with default settings when you first start the server.

-   `IPWhitelist` (boolean): Enable or disable IP whitelisting.
-   `WhitelistedIPs` (array): A list of IP addresses that are allowed to access the API when whitelisting is enabled.
-   `Dashboard` (boolean): Enable or disable the terminal dashboard.
-   `Port` (number): The port the server will run on.
-   `UseGithubMutationData` (boolean): A legacy setting, can be ignored for now.

## API Endpoints

Here is a detailed list of all available API endpoints.

---

### Server Status

-   **Endpoint:** `GET /status`
-   **Description:** A simple health check to verify that the server is running.
-   **Response:**
    ```json
    {
      "status": "ok",
      "uptime": 123.456,
      "timestamp": 1678886400000
    }
    ```

---

### Get Stock

-   **Endpoint:** `GET /api/stock`
-   **Description:** Fetches the current in-game stock for various item categories. Results are cached for 5 minutes.
-   **Response:** A JSON object containing different stock lists (`gearStock`, `eggStock`, etc.) and data on the last seen items.

---

### Get Restock Times

-   **Endpoint:** `GET /api/stock/restock-time`
-   **Description:** Provides detailed countdowns and timestamps for when different item categories will next be restocked.
-   **Response:**
    ```json
    {
      "egg": {
        "timestamp": 1678909800000,
        "countdown": "00h 25m 10s",
        "LastRestock": "12:00 PM",
        "timeSinceLastRestock": "4m ago"
      },
      "gear": { ... },
      "seeds": { ... },
      "cosmetic": { ... },
      "SwarmEvent": { ... }
    }
    ```

---

### Get Weather

-   **Endpoint:** `GET /api/weather`
-   **Description:** Retrieves the current weather statistics from the game. Results are cached for 1 minute.
-   **Response:** A JSON object containing the current weather data.

---

### Get Item Information

-   **Endpoint:** `GET /api/item-info`
-   **Description:** Retrieves detailed information about items and allows for filtering based on different criteria.
-   **Query Parameters:**
    -   `category` or `filter` (string): Filter by item category (e.g., `Fruit`).
    -   `rarity` (string): Filter by item rarity (e.g., `Normal`, `Gold`).
    -   `name` (string): Filter by item name (e.g., `Apple`).
-   **Example:** `/api/item-info?category=Fruit&rarity=Normal`

---

### Calculate Price

-   **Endpoint:** `GET /api/CalculatePrice`
-   **Description:** Calculates the in-game value of a fruit based on its properties.
-   **Query Parameters:**
    -   `Name` (string, **required**): The name of the fruit (e.g., `Apple`).
    -   `Weight` (number, **required**): The weight of the fruit.
    -   `Variant` (string, optional): The fruit's variant (e.g., `Gold`, `Rainbow`). Defaults to `Normal`.
    -   `Mutation` (string, optional): A comma-separated list of mutations (e.g., `Celestial,Pollinated`).
-   **Example:** `/api/CalculatePrice?Name=Apple&Weight=3.1&Variant=Gold&Mutation=Celestial`
-   **Response:**
    ```json
    {
      "value": 12345
    }
    ```

---

## Acknowledgements

This project is a heavily refactored and improved version of the original Grow-A-Garden-API by [3itx](https://github.com/just3itx). 

This improved version is maintained by [XanaOG](https://github.com/XanaOG) and can be found at [github.com/XanaOG/Grow-A-Garden-API](https://github.com/XanaOG/Grow-A-Garden-API).

---