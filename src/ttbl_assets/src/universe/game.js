import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.118/build/three.module.js';

import {third_person_camera} from './third-person-camera.js';
import {entity_manager} from './entity-manager.js';
import {player_entity} from './player-entity.js'
import {entity} from './entity.js';
import {gltf_component} from './gltf-component.js';
import {health_component} from './health-component.js';
import {player_input} from './player-input.js';
import {npc_entity} from './npc-entity.js';
import {math} from './math.js';
import {spatial_hash_grid} from './spatial-hash-grid.js';
import {ui_controller} from './ui-controller.js';
import {health_bar} from './health-bar.js';
import {level_up_component} from './level-up-component.js';
import {quest_component} from './quest-component.js';
import {spatial_grid_controller} from './spatial-grid-controller.js';
import {inventory_controller} from './inventory-controller.js';
import {equip_weapon_component} from './equip-weapon-component.js';
import {attack_controller} from './attacker-controller.js';


import {FBXLoader} from 'https://cdn.jsdelivr.net/npm/three@0.118.1/examples/jsm/loaders/FBXLoader.js';
import {GLTFLoader} from 'https://cdn.jsdelivr.net/npm/three@0.118.1/examples/jsm/loaders/GLTFLoader.js';
import {OrbitControls} from 'https://cdn.jsdelivr.net/npm/three@0.118/examples/jsm/controls/OrbitControls.js';

const enterBabelButton = document.getElementById("enterBabelButton");
const uiElement = document.getElementById("game-ui");
const gameDiv = document.getElementById("gameDiv");


const _VS = `
varying vec3 vWorldPosition;
void main() {
  vec4 worldPosition = modelMatrix * vec4( position, 1.0 );
  vWorldPosition = worldPosition.xyz;
  gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.25 );
}`;


const _FS = `
uniform vec3 topColor;
uniform vec3 bottomColor;
uniform float offset;
uniform float exponent;
varying vec3 vWorldPosition;
void main() {
  float h = normalize( vWorldPosition + offset ).y;
  gl_FragColor = vec4( mix( bottomColor, topColor, max( pow( max( h , 0.1), exponent ), 0.0 ) ), 1.0 );
}`;


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

          this._threejs.domElement.id = 'gameDiv';

        document.body.appendChild(this._threejs.domElement);
        
        window.addEventListener('resize', () => {
            this._OnWindowResize(); 
        }, false);

        const fov = 60;
        const aspect = 1920 / 1080;
        const near = 1.0;
        const far = 10000.0;

        this._camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
        this._camera.position.set(5, 20, 0);

        this._scene = new THREE.Scene();
        this._scene.background = new THREE.Color(0xFFFFFF);
        this._scene.fog = new THREE.FogExp2(0x89b2eb, 0.002);
    
        let light = new THREE.DirectionalLight(0xFFFFFF, 1.0);
        light.position.set(-10, 1000, 10);
        light.target.position.set(0, 0, 0);
        light.castShadow = true;
        light.shadow.bias = -0.00002;
        light.shadow.mapSize.width = 4096;
        light.shadow.mapSize.height = 4096;
        light.shadow.camera.near = 0.1;
        light.shadow.camera.far = 10000.0;
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

        // const loader = new THREE.CubeTextureLoader();
        // const texture = loader.load([
        //     './resources/skycube/space-posx.jpg',
        //     './resources/skycube/space-negx.jpg',
        //     './resources/skycube/space-posy.jpg',
        //     './resources/skycube/space-negy.jpg',
        //     './resources/skycube/space-posz.jpg',
        //     './resources/skycube/space-negz.jpg',
        // ]);
        // this._scene.background = texture;

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
        
        this._LoadSky();
        this._LoadFoliage();
        this._LoadPlayer();
        this._LoadClouds();
        this._LoadBabelRubble();
        this._LoadNPC();
        this._RAF();
    }

    _LoadControllers() {
      const ui = new entity.Entity();
      ui.AddComponent(new ui_controller.UIController());
      this._entityManager.Add(ui, 'ui');
    }

    _LoadSky() {
      const lightColor = new THREE.Color(Math.random(), Math.random(), Math.random());
      const hemiLight = new THREE.HemisphereLight( lightColor, 0x080820, 0.3 );

      // const hemiLight = new THREE.HemisphereLight(0xFFFFFF, 0xFFFFFFF, 0.6);
      hemiLight.color.setHSL(0.6, 1, 0.6);
      hemiLight.groundColor.setHSL(0.095, 1, 0.75);

      this._scene.add(hemiLight);
  
      const uniforms = {
        "topColor": { value: new THREE.Color(0x0077ff) },
        "bottomColor": { value: new THREE.Color(0xffffff) },
        "offset": { value: 33 },
        "exponent": { value: 0.6 }
      };
      uniforms["topColor"].value.copy(hemiLight.color);
  
      this._scene.fog.color.copy(uniforms["bottomColor"].value);
  
      const skyGeo = new THREE.SphereBufferGeometry(1000, 32, 15);
      const skyMat = new THREE.ShaderMaterial({
          uniforms: uniforms,
          vertexShader: _VS,
          fragmentShader: _FS,
          side: THREE.BackSide
      });
  
      const sky = new THREE.Mesh(skyGeo, skyMat);
      this._scene.add(sky);
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

      player.AddComponent(
        new equip_weapon_component.EquipWeapon({anchor: 'RightHandIndex1'}));
  
      const camera = new entity.Entity();
      camera.AddComponent(
          new third_person_camera.ThirdPersonCamera({
              camera: this._camera,
              target: this._entityManager.Get('player')}));
      this._entityManager.Add(camera, 'player-camera');

    }

    // for weapons -> https://sketchfab.com/Tedathon/collections/weapons-fantasy

    _LoadNPC() {
      for (let i = 0; i < 30; ++i) {
        const monsters = [
          {
            resourceName: 'diamond.fbx',
            resourceTexture: 'diamond.jpeg',
          },
 
        ];
        const m = monsters[math.rand_int(0, monsters.length - 1)];
  
        const npc = new entity.Entity();
        npc.AddComponent(new npc_entity.NPCController({
            camera: this._camera,
            scene: this._scene,
            resourceName: m.resourceName,
            resourceTexture: m.resourceTexture,
        }));
        npc.AddComponent(
            new spatial_grid_controller.SpatialGridController({grid: this._grid}));
        
        npc.SetPosition(new THREE.Vector3(
            (Math.random() * 2 - 1) * 1000,
            0,
            (Math.random() * 2 - 1) * 1000));

        this._entityManager.Add(npc);
      }
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
      this._sun.position.add(new THREE.Vector3(0, 100, 0));
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
// enterBabelButton.addEventListener('click', enterBabel);

// function enterBabel() {
//     enterBabelButton.classList.add('hide');
//     uiElement.classList.remove("hide");
//     const babelUniverse = new BabelUniverse();
// }

let _APP = null;

window.addEventListener('DOMContentLoaded', () => {
  _APP = new BabelUniverse();
});