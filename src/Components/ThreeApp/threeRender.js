//----IMPORTS: LIBRARIES
import * as Three from 'three'
import OrbitControls from 'three-orbitcontrols'


//----IMPORTS: FILES
import imgMed from '../../Files/heightmap-med.jpg'
import dataScene from '../../data/scene.json'


//----GLOBAL INIT VARIABLES
var camera, controls, scene, renderer, container

    //CAMERA
var fov = 45 ,
    aspectRatio = window.innerWidth / window.innerHeight ,
    near = 1, far = 5000 ,
    camPos = { x: -50, y: 200, z: 500}


//---- Three
const ThreeRender = () => {
    
      init()
      lights()
      scenario( dataScene )
      animate()

}

//---- INIT Three

const init = () => {

    container = document.getElementById( 'container' );

    camera = new Three.PerspectiveCamera( fov,aspectRatio, near, far );
    camera.position.set( camPos.x, camPos.y, camPos.z)

    scene = new Three.Scene();
    scene.background = new Three.Color( 0xbfd1e5 );

    controls = new OrbitControls(camera);

    renderer = new Three.WebGLRenderer( { antialias: true } );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.shadowMap.enabled = true;
    container.innerHTML = "";
    container.appendChild( renderer.domElement );

}

const animate = () => {

    requestAnimationFrame( animate );
    controls.update();
    renderer.render( scene, camera );
        
}

const scenario = data => {

    let textureLoader = new Three.TextureLoader()

    //Textures
    let heightMap = textureLoader.load( imgMed )


    /////////////// MAIN TERRAIN /////////////////

    let terrainGeom = new Three.PlaneBufferGeometry( 1000, 1000, 200, 200 )
    let terrainMtrl = new Three.MeshPhongMaterial( {
        
        color: 0x009900,
        emissive: 0,
        specular: 0,
        shininess: 0,
        displacementMap: heightMap,
        displacementScale: 400,
        displacementBias: 0

    } )
    let terrainMesh = new Three.Mesh( terrainGeom, terrainMtrl )
    terrainGeom.rotateX(- Math.PI / 2)

    scene.add( terrainMesh )


    /////////////// WIREFRAME TERRAIN /////////////////

    let wireframeGeom = new Three.PlaneBufferGeometry( 1000, 1000, 200, 200 )
    let wireframeMtrl = new Three.MeshPhongMaterial( {
        color: 0x9999aa,
        emissive: 0,
        specular: 0,
        shininess: 0,
        wireframe: true,
        displacementMap: heightMap,
        displacementScale: 400,
        displacementBias: 0
    } )
    let wireframeMesh = new Three.Mesh( wireframeGeom, wireframeMtrl )
    wireframeGeom.rotateX(- Math.PI / 2)

    scene.add( wireframeMesh )


    //////////////// MEDELLIN RIVER /////////////////

    let riverGeom = new Three.PlaneBufferGeometry( 1000, 1000, 1, 4 )
    let riverMtrl = new Three.MeshPhongMaterial( {
        color: 0x2222dd,
        emissive: 0,
        specular: 0,
        shininess: 0
    } )
    let riverMesh = new Three.Mesh( riverGeom, riverMtrl )
    riverGeom.rotateX( -Math.PI / 2)
    riverGeom.rotateX( -0.025  )
    riverGeom.translate( 0, 12.9, 0 )

    scene.add( riverMesh )
}

const lights = () => {

    var light = new Three.PointLight();
        light.position.set(0,200,0)
        light.intensity = 1

        scene.add(light);

}

export default ThreeRender;


