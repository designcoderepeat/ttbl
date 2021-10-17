import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.112.1/build/three.module.js';

const enterBabelButton = document.getElementById("enterBabelButton");
const babelDiv = document.getElementById("game-div");

// entering babel in v1
enterBabelButton.addEventListener('click', enterBabel);

function enterBabel() {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / (window.innerHeight),
    0.1, 1000);
    
    enterBabelButton.classList.add("hide");
    babelDiv.classList.remove("hide");

    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    babelDiv.appendChild(renderer.domElement);
    
    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshBasicMaterial({color: 0xf00000});
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);
    
    console.log("Trying to render world");
    
    camera.position.z = 5;
    
    function animate() {
    requestAnimationFrame(animate);
    cube.rotation.x += 0.02;
    cube.rotation.y += 0.01;
    // console.log("Trying to render world again");
    renderer.render(scene, camera);
    // console.log("Rendered");
    
    }
    
    animate();
    
}