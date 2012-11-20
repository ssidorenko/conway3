var T_LENGTH = 10;
var C_SIZE = 100;
var OFFSET = T_LENGTH*C_SIZE/2;
var DEAD = 0;
var ALIVE = 1;
var CAM_DISTANCE = 1500;
var camera, scene, renderer;
var geometry, mesh;
var dead_material, alive_material;

var tensor = new Array(T_LENGTH); // 3 dimensional array containing the cells status

init();
animate();

function init(){
    init_3d();
    init_conways();
}

function init_3d() {

    camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 10000 );

    scene = new THREE.Scene();

    geometry = new THREE.CubeGeometry( C_SIZE, C_SIZE, C_SIZE );
    dead_material = new THREE.MeshBasicMaterial( { color: 0x999999, wireframe: true } );
    alive_material = new THREE.MeshBasicMaterial( { color: 0xff0000 } );


    renderer = new THREE.CanvasRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight );

    document.body.appendChild( renderer.domElement );

}

function animate() {

    // note: three.js includes requestAnimationFrame shim
    requestAnimationFrame( animate );
    var timer = Date.now() * 0.0002;

    camera.position.x = Math.cos( timer ) * CAM_DISTANCE;
    camera.position.y = Math.sin( 2*timer ) * CAM_DISTANCE;
    camera.position.z = Math.sin( 3*timer ) * CAM_DISTANCE;

    camera.lookAt( scene.position );

    draw_tensor();

    renderer.render( scene, camera );
}

function draw_tensor () {
    // Update cell color according to its state
    for(i = 0; i < T_LENGTH; i++) {
        for(j = 0; j < T_LENGTH; j++) {
            for(k = 0; k < T_LENGTH; k++) {
                switch(tensor[i][j][k].state) {
                    case ALIVE: tensor[i][j][k].mesh.material = alive_material; break;
                    case DEAD: tensor[i][j][k].mesh.material = dead_material; break;
                }
            }
        }
    }
}

function update_tensor() {
    // Compute the state of the cells
    for(i = 0; i < T_LENGTH; i++) {
        for(j = 0; j < T_LENGTH; j++) {
            for(k = 0; k < T_LENGTH; k++) {

            }
        }
    }

    // Update the state of all cells
    for(i = 0; i < T_LENGTH; i++) {
        for(j = 0; j < T_LENGTH; j++) {
            for(k = 0; k < T_LENGTH; k++) {
                tensor[i][j][k].state = tensor[i][j][k].next_state 
            }
        }
    }
}

function init_conways() {
    for(i = 0; i < T_LENGTH; i++) {
        tensor[i] = new Array(T_LENGTH);
        for(j = 0; j < T_LENGTH; j++) {
            tensor[i][j] = new Array(T_LENGTH);
            for(k = 0; k < T_LENGTH; k++) {
                tensor[i][j][k] = {};
                tensor[i][j][k].state = DEAD;
                tensor[i][j][k].next_state = DEAD;
                tensor[i][j][k].mesh = new THREE.Mesh(geometry, dead_material);
                tensor[i][j][k].mesh.position = new THREE.Vector3(
                    i*C_SIZE-OFFSET,
                    j*C_SIZE-OFFSET,
                    k*C_SIZE-OFFSET
                );

                scene.add( tensor[i][j][k].mesh);
            }
        }
    }
    tensor[0][0][0].state = ALIVE;
    tensor[0][0][1].state = ALIVE;
    tensor[0][1][0].state = ALIVE;
    tensor[0][1][1].state = ALIVE;
}
