import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.112.1/build/three.module.js';
import {OrbitControls} from 'https://cdn.jsdelivr.net/npm/three@0.118/examples/jsm/controls/OrbitControls.js';

const enterBabelButton = document.getElementById("enterBabelButton");
const babelDiv = document.getElementById("game-div");

class BabelUniverse {
    constructor() {
        this._Initialize();
    }

    _Initialize() {
        this._threejs = new THREE.WebGLRenderer();
        this._threejs.shadowMap.enabled = true;
        this._threejs.shadowMap.type = THREE.PCFSoftShadowMap;
        this._threejs.setPixelRatio(window.devicePixelRatio);
        this._threejs.setSize(window.innerWidth, window.innerHeight);

        document.body.appendChild(this._threejs.domElement);
        
        window.addEventListener('resize', () => {
            this.onWindowResize(); 
        }, false);

        const fov = 60;
        const aspect = 1920 / 1080;
        const near = 1.0;
        const far = 1000.0;

        this._camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
        this._camera.position.set(75, 20, 0);

        this._scene = new THREE.Scene();

        let light = new THREE.DirectionalLight(0xFFFFFF);
        light.position.set(100, 100, 100);
        light.target.position.set(0,0,0);
        light.castShadow = true;
        light.shadow.bias = -0.01;
        light.shadow.mapSize.width = 2048;
        light.shadow.mapSize.height = 2048;
        light.shadow.camera.near = 1.0;
        light.shadow.camera.far = 500;
        light.shadow.camera.left = 200;
        light.shadow.camera.right = -200;
        light.shadow.camera.top = 200;
        light.shadow.camera.bottom = -200;

        light = new THREE.AmbientLight(0x404040);
        this._scene.add(light);

        const controls = new OrbitControls(
            this._camera, this._threejs.domElement);
        controls.target.set(0,0,0);
        controls.update();

        const loader = new THREE.CubeTextureLoader();
        const texture = loader.load([
            './resources/skycube/posx.jpg',
            './resources/skycube/negx.jpg',
            './resources/skycube/posy.jpg',
            './resources/skycube/negy.jpg',
            './resources/skycube/posz.jpg',
            './resources/skycube/negz.jpg',
        ]);
        this._scene.background = texture;

        const plane = new THREE.Mesh(
            new THREE.PlaneGeometry(100, 100, 1, 1),
            new THREE.MeshStandardMaterial({color: 0xfefefe})
        );

        plane.castShadow = false;
        plane.recieveShadow = true;
        plane.rotation.x = -Math.PI / 2;
        this._scene.add(plane);

        const box = new THREE.Mesh(
            new THREE.BoxGeometry(2, 2, 2),
            new THREE.MeshStandardMaterial({
                color: 0x232323
            })
        );
        
        box.position.set(0, 1, 0);

        this._scene.add(box);

        this._RAF();

    }

    _OnWindowResize() {
        this._camera.aspect = (window.innerWidth > window.innerHeight) ? window.innerWidth / window.innerHeight : window.innerHeight / window.innerWidth;
        this._camera.updateProjectionMatrix();
        this._threejs.setSize(window.innerWidth, window.innerHeight);
    }

    _RAF() {
        requestAnimationFrame(() => {
            this._threejs.render(this._scene, this._camera);
            this._RAF();
        });
    }

}

// entering babel in v1
enterBabelButton.addEventListener('click', enterBabel);

function enterBabel() {

    const babelUniverse = new BabelUniverse();

    // const scene = new THREE.Scene();
    // const camera = new THREE.PerspectiveCamera(75, window.innerWidth / (window.innerHeight),
    // 0.1, 1000);
    
    // enterBabelButton.classList.add("hide");
    // babelDiv.classList.remove("hide");

    // const renderer = new THREE.WebGLRenderer();
    // renderer.setSize(window.innerWidth, window.innerHeight);
    // babelDiv.appendChild(renderer.domElement);
    
    // const geometry = new THREE.BoxGeometry();
    // const material = new THREE.MeshBasicMaterial({color: 0xf00000});
    // const cube = new THREE.Mesh(geometry, material);
    // scene.add(cube);
    
    // console.log("Trying to render world");
    
    // camera.position.z = 5;
    
    // function animate() {
    // requestAnimationFrame(animate);
    // cube.rotation.x += 0.02;
    // cube.rotation.y += 0.01;
    // // console.log("Trying to render world again");
    // renderer.render(scene, camera);
    // // console.log("Rendered");
    
    // }
    
    // animate();
    
}