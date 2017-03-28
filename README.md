# Application task for Revolut

## Usage:

First, you need to install the dependency packages via `npm install` or `yarn`.

### Available Scripts

In the project directory, you can run:

#### `npm run devserver `

Starts a development server (using webpack-dev-server) on `http://localhost:8080/`


#### `npm run build `

Bundles assets and all the things to _public/_ dir. (minified production build)

#### `npm run typecheck `

Initiates flow typecheck. Flow coverage is small, basically for demo purpose.

#### `npm run test `

Runs Jest tests.

## About:

[Demo](https://foxwhite.github.io/revolut_test/public/) 

While doing this task, I tried to balance between demonstrating my technical skills and knowledge on the one hand, and not overcomplicating things (this being a small project) on the other.

I chose [Open exchange rates](https://openexchangerates.org/) as a data source for currency exchange rates. They provide a free (yet somewhat limited) API to get the data we need. Despite the free access plan only provides a basic data structure, there's a [nice little currency conversion library](https://openexchangerates.github.io/money.js/) by the very same team. As it works seamlessly with the API response and suits our needs perfectly, this is what I chose as the main tool for currency conversion.

We need to update the rates data every 30 seconds. To implement the polling I chose to use `redux-thunk` and handle all the polling timer logic in the component. There are pros and cons to that. Here, as the component lifecycle is not too complicated, I guess it's fine. In larger projects though I'd consider using some more complex tools that allow to handle async actions better than `thunks` do.

Inputs are of types 'number'. I find their behaviour not ideal at all but I chose them so save time on input digit-only validation.

For storing accounts data in localStorage I just use some helpers. There are some nice libs like [localForage](https://github.com/localForage/localForage) but I thought for a project like this it'd be an overkill.
