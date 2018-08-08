import React, { Component } from 'react';
import * as three from 'three'

class ThreeApp extends Component {

    componentDidMount() {
        const   width = window.innerWidth,
                height = window.innerHeight
        
        const   scene = new three.Scene(),
                camera = new three.PerspectiveCamera(75, width/height, 0.1, 1000),
                renderer = new three.WebGLRenderer()
                
        renderer.setSize(width, height)
        this.refs.anchor.appendChild(renderer.domElement)

        const   geometry = new three.BoxGeometry(1, 1, 1),
                material = new three.MeshBasicMaterial({ color: 0x00ff00 }),
                cube = new three.Mesh(geometry, material)

        scene.add(cube)

        camera.position.z = 5

        const gameLoop = () => {
            requestAnimationFrame(gameLoop)

            cube.rotation.x += 0.1
            cube.rotation.y += 0.1

            renderer.render(scene, camera)
        }

        gameLoop()
      
    }
    

    render() {
        return (
            <div ref="anchor" >
                
            </div>
        );
    }
}

export default ThreeApp;
