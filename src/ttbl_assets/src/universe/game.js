import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.118/build/three.module.js';

import {math} from './math.js';
import {gltf_component} from './gltf-component.js';
import {entity} from './entity.js';
import {entity_manager} from './entity-manager.js';
import {spatial_hash_grid} from './spatial-hash-grid.js';
import {spatial_grid_controller} from './spatial-grid-controller.js';
import {third_person_camera} from './third-person-camera.js';

import {player_entity} from './player-entity.js'
import {player_input} from './player-input.js';


import {FBXLoader} from 'https://cdn.jsdelivr.net/npm/three@0.118.1/examples/jsm/loaders/FBXLoader.js';
import {GLTFLoader} from 'https://cdn.jsdelivr.net/npm/three@0.118.1/examples/jsm/loaders/GLTFLoader.js';
import {OrbitControls} from 'https://cdn.jsdelivr.net/npm/three@0.118/examples/jsm/controls/OrbitControls.js';

const enterBabelButton = document.getElementById("enterBabelButton");
const babelDiv = document.getElementById("game-div");  

class BabelUniverse {
    constructor() {
        this._Initialize();
    }

    _Initialize() {

        this._threejs = new THREE.WebGLRenderer({
            antialias: true,
          });
          this._threejs.outputEncoding = THREE.sRGBEncoding;
          this._threejs.gammaFactor = 2.2;
          this._threejs.shadowMap.enabled = true;
          this._threejs.shadowMap.type = THREE.PCFSoftShadowMap;

          this._threejs.setPixelRatio(window.devicePixelRatio);
          this._threejs.setSize(window.innerWidth, window.innerHeight);

        document.body.appendChild(this._threejs.domElement);
        
        window.addEventListener('resize', () => {
            this._OnWindowResize(); 
        }, false);

        const fov = 60;
        const aspect = 1920 / 1080;
        const near = 1.0;
        const far = 1000.0;

        this._camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
        this._camera.position.set(75, 20, 0);

        this._scene = new THREE.Scene();
        this._scene.background = new THREE.Color(0xFFFFFF);
        this._scene.fog = new THREE.FogExp2(0x89b2eb, 0.002);
    
        let light = new THREE.DirectionalLight(0xFFFFFF, 1.0);
        light.position.set(-10, 500, 10);
        light.target.position.set(0, 0, 0);
        light.castShadow = true;
        light.shadow.bias = -0.1;
        light.shadow.mapSize.width = 108;
        light.shadow.mapSize.height = 108;
        light.shadow.camera.near = 0.1;
        light.shadow.camera.far = 1000.0;
        light.shadow.camera.left = 100;
        light.shadow.camera.right = -100;
        light.shadow.camera.top = 100;
        light.shadow.camera.bottom = -100;
        this._scene.add(light);
    
        this._sun = light;

        // light = new THREE.AmbientLight( 0x404040 ); // soft white light
        // this._scene.add(light);

        // const controls = new OrbitControls(
        //     this._camera, this._threejs.domElement);
        // controls.target.set(10,0,0);
        // controls.update();

        const loader = new THREE.CubeTextureLoader();
        const texture = loader.load([
            './resources/skycube/space-posx.jpg',
            './resources/skycube/space-negx.jpg',
            './resources/skycube/space-posy.jpg',
            './resources/skycube/space-negy.jpg',
            './resources/skycube/space-posz.jpg',
            './resources/skycube/space-negz.jpg',
        ]);
        this._scene.background = texture;

        const plane = new THREE.Mesh(
          new THREE.PlaneGeometry(1000, 1000, 10, 10),
          new THREE.MeshStandardMaterial({
              color: 0x1e601c,
            }));

        plane.castShadow = false;
        plane.recieveShadow = true;

        plane.rotation.x = -Math.PI / 2;
        this._scene.add(plane);

        this._mixers = [];
        this._previousRAF = null;    

        this._entityManager = new entity_manager.EntityManager();

    this._grid = new spatial_hash_grid.SpatialHashGrid(
        [[-1000, -1000], [1000, 1000]], [100, 100]);
        
        this._LoadFoliage();
        this._LoadPlayer();
        this._LoadClouds();
        this._LoadBabelRubble();
        this._RAF();
    }


    _LoadPlayer() {
      const params = {
        camera: this._camera,
        scene: this._scene,
      };
  
      const player = new entity.Entity();
      player.AddComponent(new player_input.BasicCharacterControllerInput(params));
      player.AddComponent(new player_entity.BasicCharacterController(params));
      player.AddComponent(
          new spatial_grid_controller.SpatialGridController({grid: this._grid}));
      this._entityManager.Add(player, 'player');
  
  
      const camera = new entity.Entity();
      camera.AddComponent(
          new third_person_camera.ThirdPersonCamera({
              camera: this._camera,
              target: this._entityManager.Get('player')}));
      this._entityManager.Add(camera, 'player-camera');
  
    }


  _LoadFoliage() {
    for (let i = 0; i < 100; ++i) {
      const names = [
          'CommonTree',
          'BirchTree',
          'Willow', 'Grass', 'Rock_Moss'
      ];
      const name = names[math.rand_int(0, names.length - 1)];
      const index = math.rand_int(1, 5);

      const pos = new THREE.Vector3(
          (Math.random() * 2.0 - 1.0) * 500,
          0,
          (Math.random() * 2.0 - 1.0) * 500);

      const e = new entity.Entity();
      e.AddComponent(new gltf_component.StaticModelComponent({
        scene: this._scene,
        resourcePath: './resources/nature/FBX/',
        resourceName: name + '_' + index + '.fbx',
        scale: 0.25,
        emissive: new THREE.Color(0x000000),
        specular: new THREE.Color(0x000000),
        receiveShadow: true,
        castShadow: true,
      }));
      e.AddComponent(
          new spatial_grid_controller.SpatialGridController({grid: this._grid}));
      e.SetPosition(pos);
      this._entityManager.Add(e);
      e.SetActive(false);
    }
  }

    _LoadClouds() {
      for (let i = 0; i < 20; ++i) {
        const index = math.rand_int(1, 3);
      const pos = new THREE.Vector3(
          (Math.random() * 2.0 - 1.0) * 500,
          75 + Math.floor(Math.random() * 100), 
          (Math.random() * 2.0 - 1.0) * 500);
  
        const e = new entity.Entity();
        e.AddComponent(new gltf_component.StaticModelComponent({
          scene: this._scene,
          resourcePath: './resources/nature2/GLTF/',
          resourceName: 'Cloud' + index + '.glb',
          position: pos,
          scale: Math.random() * 5 + 10,
          emissive: new THREE.Color(0x808080),
        }));
        e.SetPosition(pos);
        this._entityManager.Add(e);
        e.SetActive(false);
      }
    }

    _LoadBabelRubble() {
        const loader = new GLTFLoader();
        loader.load('./resources/static/thing.glb', (gltf) => {
          gltf.scene.scale.set(3, 3, 3);  
          gltf.scene.position.y = 8;
          gltf.scene.position.z = 11;
          // gltf.rotation.x = -Math.PI / 2;

          gltf.scene.traverse(c => {
                c.castShadow = true;
            });
            this._scene.add(gltf.scene);
        });
    }
 
    _OnWindowResize() {
        this._camera.aspect = window.innerWidth / window.innerHeight;
        this._camera.updateProjectionMatrix();
        this._threejs.setSize(window.innerWidth, window.innerHeight);
    }

    _UpdateSun() {
      const player = this._entityManager.Get('player');
      const pos = player._position;
  
      this._sun.position.copy(pos);
      this._sun.position.add(new THREE.Vector3(-10, 500, -10));
      this._sun.target.position.copy(pos);
      this._sun.updateMatrixWorld();
      this._sun.target.updateMatrixWorld();
    }

    _RAF() {
      requestAnimationFrame((t) => {
        if (this._previousRAF === null) {
          this._previousRAF = t;
        }
        this._RAF();
        this._threejs.render(this._scene, this._camera);
        this._Step(t - this._previousRAF);
        this._previousRAF = t;
      });
    }

    _Step(timeElapsed) {
      const timeElapsedS = Math.min(1.0 / 30.0, timeElapsed * 0.001);
      this._UpdateSun();
      this._entityManager.Update(timeElapsedS);
    }

}

// entering babel in v1
enterBabelButton.addEventListener('click', enterBabel);

function enterBabel() {
    enterBabelButton.classList.add('hide');
    const babelUniverse = new BabelUniverse();
}