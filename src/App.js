import React, { Component } from 'react';

//FILES
import contentData from './data/contentText.json'
import logoSVG from './Files/mdelogo.svg'

import './App.css';

import ThreeApp from './Components/ThreeApp'

class App extends Component {
  render() {
    return (
      <div className="App">

        <ThreeApp/>

        <div className="pagesHTML">
        
          <div className="intro">
            <div className="logo">
              <img src={ logoSVG } alt="logoMDE"/>
            </div>
            <div className="description">
              { text( contentData.intro ) }
            </div>
          </div>
        
        </div>

        <div className="containerHUD"></div>

      </div>
    );
  }
}

export default App;

const text = (t) => t.split('\n').map(line => <p>{line}</p>)