import * as THREE from 'three'
import Stats from 'stats.js'
import OrbitControls from 'three-orbitcontrols'

import medellin_img from '../../../Files/heightmap-med.jpg'

import MAP from './sceneObjects.js'


const ensayo= () => {

    var container, stats;
    var camera, controls, scene, renderer;

    var fov = 45,
        aspectRatio = window.innerWidth / window.innerHeight,
        near = 1,
        far = 20000
    
    init();
    animate();
    
    function init() {
        container = document.getElementById( 'container' );
        camera = new THREE.PerspectiveCamera( fov,aspectRatio, near, far );

        scene = new THREE.Scene();
        scene.background = new THREE.Color( 0xbfd1e5 );

        controls = new OrbitControls(camera);

        camera.position.z = 0;
        camera.position.x = 0;
        camera.position.y = 1000;
        
        // var planeGeom = new THREE.PlaneBufferGeometry(500, 500, 50, 50)
        // planeGeom.rotateX( - Math.PI / 2)

        // let planeDisMap = new THREE.TextureLoader().load(medellin_img)
        // var planeMtrl = new THREE.MeshPhongMaterial( {
        //     color: 0x558833,
        //     //map: planeDisMap,
        //     displacementMap: planeDisMap,
        //     displacementScale: 200,
        //     displacementBias: 0,
        //     //flatShading: true,
        //     shininess: 0
        // } )
        // var planeMap = new THREE.Mesh(planeGeom, planeMtrl)

        // planeGeom.computeVertexNormals();
        // planeGeom.computeFaceNormals();
        // planeGeom.computeBoundingBox();

        // scene.add(planeMap)

        SceneContent()


        var light = new THREE.DirectionalLight();
            light.position.set(1000,200,1000);
            light.lookAt(scene.position)
            light.castShadow = true
            scene.add(light);

        var light = new THREE.PointLight();
            light.position.set(0,200,0)
            light.intensity = 1
            scene.add(light);

        


        renderer = new THREE.WebGLRenderer( { antialias: true } );
        renderer.setPixelRatio( window.devicePixelRatio );
        renderer.setSize( window.innerWidth, window.innerHeight );
        renderer.shadowMap.enabled = true;
        container.innerHTML = "";
        container.appendChild( renderer.domElement );
        stats = new Stats();
        container.appendChild( stats.dom );

    }
    function animate() {
        requestAnimationFrame( animate );
        render();
        stats.update();
    }
    function render() {
        controls.update();
        renderer.render( scene, camera );
    }

   


/////////// FUNCTIONS ///////////////////////////////
    function SceneContent() {

        const planeMaterial = new THREE.MeshBasicMaterial({
            //specular: 0xff0000,         // Specular color of the material (light)
            color: 0xaaaa00           // Geometry color in hexadecimal
            //emissive: 0x0000ff,         // Emissive color of the material (dark)
            //shininess: 1,              // How shiny the specular highlight is
        });
        
        
        // Create a geometry with N segments.
        let segments = {w:700, h:700}
        const planeGeometry = new THREE.PlaneGeometry(30, 60, segments.w, segments.h);
        planeGeometry.rotateX( - Math.PI / 2)

        getHeightFromMap( segments, planeMaterial )
        
        
        //Move the vertices by random.
        planeGeometry.vertices.map(function (vertex) {
            vertex.x += -.5 + Math.random() / 10;
            vertex.y += -.5 + Math.random() / 2;
            vertex.z += -.5 + Math.random() / 5;
            return vertex;
        });
        
        
        // Update geometry.
        planeGeometry.computeFaceNormals();
        
        // Create plane
        const plane = new THREE.Mesh(planeGeometry, planeMaterial);
        
        // Create a wireframe
        const wireframeMaterial = new THREE.MeshBasicMaterial({
            color: 0xFF4E50,
            wireframe: true
        });
        const wireframe = new THREE.Mesh(planeGeometry, wireframeMaterial);
        //   scene.add(wireframe);
        //   scene.add(plane);

    }
    function getHeightFromMap (segments, material) {

        let [x , z] = [segments.w, segments.h],
            canvas = document.createElement('canvas'),
            cSize = {w: x, h: z},
            img = new Image(),
            dataSize = cSize.w * cSize.h,
            data = new Uint8ClampedArray( dataSize );

        canvas.width = cSize.w;
        canvas.height = cSize.h;

        let ctx = canvas.getContext('2d');
        img.src = medellin_img; //Image Reference
        img.onload = function () {
            // draw on canvas
            ctx.drawImage(img, 0, 0, x, z);
            let pixel = ctx.getImageData(0, 0, cSize.w, cSize.h);

            for (let i = 0; i < dataSize; i ++) {
                let yValue = pixel.data[ i * 4 ]
                data[i] = yValue
            }            

            const plane2Geometry = new THREE.PlaneBufferGeometry(5000, 5000, x -1, z-1);
            var vertices = plane2Geometry.attributes.position.array;
            console.log(vertices);
            plane2Geometry.rotateX( - Math.PI / 2 );

            for ( var i = 0, j = 0, l = vertices.length; i < l; i ++, j += 3 ) {
                //j+1 index igual a cord Y del vertice
                vertices[ j + 1 ] = pixel.data[ i * 4] * 3.5
            }
            
            console.log(data.length, vertices.length );

             // Update geometry.
            plane2Geometry.computeFaceNormals();
            
            // Create plane
            const plane = new THREE.Mesh(plane2Geometry, material);
            scene.add(plane);

        }


    }

}

export default ensayo