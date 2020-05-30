import React from 'react';
import { appStore, webPageStore } from './stores';
import { Provider } from 'mobx-react';
import MainApp from './MainApp';

export default class App extends React.Component{
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Provider appStore={appStore} webPageStore={webPageStore}>
        <MainApp/>
      </Provider>
    )
  }
}

// "main": "node_modules/expo/AppEntry.js", <-- package.json
// import App from '../../App'; <-- expo/AppEntry.js
