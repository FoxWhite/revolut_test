# Application task for Revolut

## Usage:

First, you need to install the dependency packages via `npm install` or `yarn`.

### Available Scripts

In the project directory, you can run:

#### `npm run devserver `

Starts a development server (using webpack-dev-server) on `http://localhost:8080/`


#### `npm run build `

Bundles assets and all the things to _public/_ dir.

## About:

I chose [Open exchange rates](https://openexchangerates.org/) as a data source for currency exchange rates. They provide a free (yet somewhat limited) API to get the data we need. Despite the free access plan only provides a basic data structure, there's a [nice little currency conversion library](https://openexchangerates.github.io/money.js/) by the very same team. As it works seamlessly with the API response and suits our needs perfectly, this is what I chose as the main tool for currency conversion.