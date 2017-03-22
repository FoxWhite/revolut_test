// import './styles/index.sass'
import App   from './javascripts/App.jsx'
import React from 'react'
import { render }   from 'react-dom'
import { Provider } from 'react-redux'
import config       from 'config';
import store from 'redux/reducers';

main();

function main() {
  const app = document.createElement('div');
  app.className = 'revolut-app-wrapper';
  document.body.appendChild(app);

  render(
      <Provider store={store}>
        <App/>
      </Provider>,
    app);
}

