import * as THREE from 'three'
import ImprovedNoise from 'improved-noise'
import Stats from 'stats.js'
import OrbitControls from 'three-orbitcontrols'

import medellin_img from '../../Files/medellin-heightmap.jpg'

const appThree2 = () => {

    var container, stats;
    var camera, controls, scene, renderer;
    var mesh, texture;
    var worldWidth = 2000, worldDepth = 2000, segments = 100,
    worldHalfWidth = worldWidth / 2, worldHalfDepth = worldDepth / 2;
    var clock = new THREE.Clock();
    var helper;
    var raycaster = new THREE.Raycaster();
    var mouse = new THREE.Vector2();
    init();
    animate();
    
    function init() {
        container = document.getElementById( 'container' );
        camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 20000 );
        scene = new THREE.Scene();
        scene.background = new THREE.Color( 0xbfd1e5 );
        controls = new OrbitControls(camera);
        controls.target.set( 0.0, 100.0, 0.0 );
        controls.userPanSpeed = 100;

        //var data = generatePlaneFromMap( segments );

        //controls.target.y = data[ worldHalfWidth + worldHalfDepth * worldWidth ] + 500;
        //camera.position.y =  controls.target.y + 2000;
        camera.position.y = 2500;
        camera.position.x = 2000;

        // var geometry = new THREE.PlaneBufferGeometry( worldWidth, worldDepth, segments, segments );
        // geometry.rotateX( - Math.PI / 2 );

        // var vertices = geometry.attributes.position.array;
        // for ( var i = 0, j = 0, l = vertices.length; i < l; i ++, j += 3 ) {
        //     vertices[ j + 1 ] = data[ i ] * 10
        // }

        // geometry.computeFaceNormals();

        // texture = new THREE.CanvasTexture( generateTexture( data, worldWidth, worldDepth ) );
        // texture.wrapS = THREE.ClampToEdgeWrapping;
        // texture.wrapT = THREE.ClampToEdgeWrapping;

        // mesh = new THREE.Mesh( geometry, new THREE.MeshBasicMaterial( { map: texture } ) );
        // scene.add( mesh );

        generatePlaneFromMap( segments )

        var geometry = new THREE.ConeBufferGeometry( 20, 100, 3 );
        geometry.translate( 0, 50, 0 );
        geometry.rotateX( Math.PI / 2 );
        helper = new THREE.Mesh( geometry, new THREE.MeshNormalMaterial() );
        scene.add( helper );
        renderer = new THREE.WebGLRenderer( { antialias: true } );
        renderer.setPixelRatio( window.devicePixelRatio );
        renderer.setSize( window.innerWidth, window.innerHeight );
        container.innerHTML = "";
        container.appendChild( renderer.domElement );
        container.addEventListener( 'mousemove', onMouseMove, false );
        stats = new Stats();
        container.appendChild( stats.dom );
        //
        window.addEventListener( 'resize', onWindowResize, false );
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

    function generatePlaneFromMap( segments ) {
        // var size = width * height, data = new Uint8Array( size ),
        // perlin = new ImprovedNoise(), quality = 1, z = Math.random() * 100;
        // for ( var j = 0; j < 4; j ++ ) {
        //     for ( var i = 0; i < size; i ++ ) {
        //         var x = i % width, y = ~~ ( i / width );
        //         data[ i ] += Math.abs( perlin.noise( x / quality, y / quality, z ) * quality * 1.75 );
        //     }
        //     quality *= 5;
        // }

        
        // return data;
        
        
        let dataSize = segments * segments,
            canvas = document.createElement('canvas'),
            canvasDimention = 600

        let data = new Uint8Array( dataSize )

        canvas.width = canvasDimention;
        canvas.height = canvasDimention;

        let ctx = canvas.getContext('2d');
        let img = new Image();
        img.src = medellin_img;
        img.onload = function () {
            // draw on canvas
            ctx.drawImage(img, 0, 0);
            var pixel = ctx.getImageData(0, 0, canvasDimention, canvasDimention);

            //var geom_terrain = new THREE.PlaneBufferGeometry(width, height, segments, segments);

            var output = []
                
            for (var i = 0; i < dataSize; i++ ) {
                    var x = Math.floor( i/segments )
                    var z = Math.floor( canvasDimention / (segments-1) ) * i                    
                    
                    let yValue = pixel.data[ z * 4 + ( x * 4 * canvasDimention ) ];
                    data[ i ] = -yValue
            }

            var geometry = new THREE.PlaneBufferGeometry( worldWidth, worldDepth, segments-1, segments-1 );
            geometry.rotateX( - Math.PI / 2 );
    
            var vertices = geometry.attributes.position.array;

            for ( var i = 0, j = 0, l = vertices.length; i < l; i ++, j += 3 ) {
                //j+1 index igual a cord Y del vertice
                vertices[ j + 1 ] = data[ i ] * 5
            }
    
            geometry.computeFaceNormals();
            
    
            mesh = new THREE.Mesh( geometry, new THREE.MeshBasicMaterial( { color: 0x00f0a0, wireframe: true } ) );
            scene.add( mesh ); 

        }

    }

    function onMouseMove( event ) {
        mouse.x = ( event.clientX / renderer.domElement.clientWidth ) * 2 - 1;
        mouse.y = - ( event.clientY / renderer.domElement.clientHeight ) * 2 + 1;
        raycaster.setFromCamera( mouse, camera );
        // See if the ray from the camera into the world hits one of our meshes
        var intersects = raycaster.intersectObject( mesh );
        // Toggle rotation bool for meshes that we clicked
        if ( intersects.length > 0 ) {
            helper.position.set( 0, 0, 0 );
            helper.lookAt( intersects[ 0 ].face.normal );
            helper.position.copy( intersects[ 0 ].point );
        }
    }
    function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize( window.innerWidth, window.innerHeight );
    }
}

export default appThree2