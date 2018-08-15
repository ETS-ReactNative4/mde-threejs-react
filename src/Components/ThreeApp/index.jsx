import React, { Component } from 'react';
import threeRender from './threeRender'

import ensayo from './Borradores/ensayos'

class ThreeApp extends Component {

    componentDidMount() {

        threeRender()
        //ensayo()

    }
    

    render() {
        return (
            <div ref="anchor" id="container">
                
            </div>
        );
    }
}

export default ThreeApp;
