import React, { Component } from 'react';

import './App.css';

import ThreeApp from './Components/ThreeApp'

class App extends Component {
  render() {
    return (
      <div className="App">

        <ThreeApp/>

        <div className="pagesHTML"></div>

        <div className="containerHUD"></div>

      </div>
    );
  }
}

export default App;
