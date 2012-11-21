var T_LENGTH = 15;
var C_SIZE = 130;
var OFFSET = T_LENGTH*C_SIZE/2;
var DEAD = 0;
var ALIVE = 1;
var CAM_DISTANCE = 2300;
var SPEED = 6;
var CAM_SPEED = 5;

var MIN_ALIVE_NEIGHBOURS = 2;
var MAX_ALIVE_NEIGHBOURS = 3;

var frame_counter = 0;

var camera, scene, renderer;
var geometry, mesh, light;
var dead_material, alive_material;

var tensor = new Array(T_LENGTH); // 3 dimensional array containing the cells status

window.onload = function () {
    init();
    animate();
}

function init(){
    Detector.addGetWebGLMessage({"parent":document.getElementById("container")});    
    init_3d();
    init_conways();
}

function init_3d() {

    camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 10000 );

    scene = new THREE.Scene();
    light = new THREE.DirectionalLight( 0xffffff, 0.5 );
    light.position.set( 0, 1, 0 );
    scene.add( light );

    geometry = new THREE.CubeGeometry( C_SIZE, C_SIZE, C_SIZE );
    dead_material = new THREE.MeshBasicMaterial( { color: 0xCCCCCC, wireframe: true, transparent: true, opacity: 0.01 } );
    alive_material = new THREE.MeshBasicMaterial( { color: 0x0000FF, transparent: true, opacity: 0.5 } );
    border_alive_material = new THREE.MeshBasicMaterial( { color: 0xFF0000, transparent: true, opacity: 0.5 } );


    renderer = new THREE.WebGLRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight );

    document.getElementById("container").appendChild( renderer.domElement );

}

function animate() {

    // note: three.js includes requestAnimationFrame shim
    requestAnimationFrame( animate );
    var timer = Date.now() * 0.00001 * CAM_SPEED;

    camera.position.x = Math.cos( timer ) * CAM_DISTANCE;
    camera.position.y = Math.sin( 2*timer ) * CAM_DISTANCE;
    camera.position.z = Math.sin( 3*timer ) * CAM_DISTANCE;

    camera.lookAt( scene.position );
    if((frame_counter % SPEED) == 0)
        update_tensor();
    draw_tensor();

    renderer.render( scene, camera );
    frame_counter++;
}

function draw_tensor () {
    // Update cell color according to its state
    each_cell(function(cell,i,j,k) {
        switch(cell.state) {
            case ALIVE: cell.mesh.material = (Math.min(i,j,k) == 0 || Math.max(i,j,k) == T_LENGTH-1) ? border_alive_material : alive_material; break;
            case DEAD: cell.mesh.material = dead_material; break;
        }
    });
}

function update_tensor() {
    // Compute the state of the cells
    each_cell(function(cell,i,j,k) {
        cell.alive_neighbours = 0;
        for(i_ = -1; i_ <= 1; i_++)
            for(j_ = -1; j_ <= 1; j_++)
                for(k_ = -1; k_ <= 1; k_++)
                    if(is_alive(i+i_, j+j_, k+k_))
                        cell.alive_neighbours++;
        if(cell.state == ALIVE) cell.alive_neighbours--;
        if(cell.alive_neighbours >= MIN_ALIVE_NEIGHBOURS && cell.alive_neighbours <= MAX_ALIVE_NEIGHBOURS){
            cell.next_state = ALIVE;
        } else {
            cell.next_state = DEAD;
        }
    });
    // Update the state of all cells
    each_cell(function(cell,i,j,k) {
        cell.state = cell.next_state;
    });
}

function each_cell(fun) {
    for(i = 0; i < T_LENGTH; i++) 
        for(j = 0; j < T_LENGTH; j++) 
            for(k = 0; k < T_LENGTH; k++)
                fun(c(i, j, k), i, j, k);
}

// Returns the cell at (i,j,k)
function c(i,j,k) {
    return tensor[i][j][k]; 
}

// Returns true if the cell at (i,j,k) is alive, false if it is dead or if it doesn't exist
function is_alive(i,j,k) {
    if(Math.min(i,j,k) < 0 || Math.max(i,j,k) >= T_LENGTH)
        return false;
    return c(i,j,k).state == ALIVE;
} 

function init_cell(cell,i,j,k) {
    cell.state = DEAD;
    cell.next_state = DEAD;
    cell.mesh = new THREE.Mesh(geometry, dead_material);
    cell.mesh.position = new THREE.Vector3(
        i*C_SIZE-OFFSET,
        j*C_SIZE-OFFSET,
        k*C_SIZE-OFFSET
    );

    scene.add( cell.mesh);
}

function init_conways() {
    for(i = 0; i < T_LENGTH; i++) {
        tensor[i] = new Array(T_LENGTH);
        for(j = 0; j < T_LENGTH; j++) {
            tensor[i][j] = new Array(T_LENGTH);
            for(k = 0; k < T_LENGTH; k++) {
                tensor[i][j][k] = {};
                init_cell(tensor[i][j][k],i,j,k);
            }
        }
    }
    tensor[0][0][0].state = ALIVE;
    tensor[0][0][1].state = ALIVE;
    tensor[1][0][1].state = ALIVE;
    tensor[0][1][0].state = ALIVE;
    /*
    tensor[0][1][0].state = ALIVE;
    tensor[1][1][0].state = ALIVE;
    tensor[1][1][1].state = ALIVE;
    tensor[1][1][2].state = ALIVE;
    tensor[2][1][1].state = ALIVE;
    tensor[3][1][1].state = ALIVE;
    tensor[3][2][1].state = ALIVE;
    tensor[2][1][3].state = ALIVE;
    tensor[2][1][2].state = ALIVE;
    tensor[2][2][1].state = ALIVE;
    tensor[2][2][2].state = ALIVE;
    tensor[3][2][2].state = ALIVE;
    tensor[3][2][3].state = ALIVE;
    tensor[3][3][2].state = ALIVE;
    tensor[3][3][2].state = ALIVE;
    tensor[3][3][3].state = ALIVE;
    tensor[3][3][3].state = ALIVE;
    */
}
