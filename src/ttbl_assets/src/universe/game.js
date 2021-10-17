import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.112.1/build/three.module.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / (2 * window.innerHeight),
0.1, 1000);

const babelDiv = document.getElementById("world-div");

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