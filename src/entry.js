// import './styles/index.sass'
import App from './javascripts/App.jsx'
import { render } from 'react-dom'
import React from 'react'
// import { createStore } from 'redux'
// import { preset, initialState } from './app/redux/reducers.js'
import { Provider } from 'react-redux'
import config from 'config';

main();

function main() {
  const app = document.createElement('div');
  app.className = 'revolut-app-wrapper';
  document.body.appendChild(app);

  const store={};

  console.log('process.env', process.env);
  console.log('config', config);
  render(
      <Provider store={store}>
        <App/>
      </Provider>,
    app);
}

