import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.118.1/build/three.module.js';

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
import {girlquest_component} from './girlquest_component.js';
import {spatial_grid_controller} from './spatial-grid-controller.js';
import {inventory_controller} from './inventory-controller.js';
import {equip_weapon_component} from './equip-weapon-component.js';
import {attack_controller} from './attacker-controller.js';
import {GLTFLoader} from 'https://cdn.jsdelivr.net/npm/three@0.118.1/examples/jsm/loaders/GLTFLoader.js';
import { Guruquest_component } from './guruquest-component.js';
// import { Erikaquest_component } from './erikaquest-component.js';


const _VS = `
varying vec3 vWorldPosition;

void main() {
  vec4 worldPosition = modelMatrix * vec4( position, 1.0 );
  vWorldPosition = worldPosition.xyz;

  gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`;


const _FS = `
uniform vec3 topColor;
uniform vec3 bottomColor;
uniform float offset;
uniform float exponent;

varying vec3 vWorldPosition;

void main() {
  float h = normalize( vWorldPosition + offset ).y;
  gl_FragColor = vec4( mix( bottomColor, topColor, max( pow( max( h , 0.0), exponent ), 0.0 ) ), 1.0 );
}`;

function babelSays(msg) {
  const babelConvoDiv = document.getElementById('babelConvo');
  babelConvoDiv.innerText = msg;
}

function updateClock(msg) {
  const clockDiv = document.getElementById('clockDiv');
  clockDiv.innerText = msg;
}

// bugfix1. if there are 2 entities in same spot in hashgrid, move one out a lil

class BabelUniverse {
  constructor() {
    this._Initialize();
  }

  _Initialize() {
    this._frame = -100;
    this._clock = 0;
    this._threejs = new THREE.WebGLRenderer({
      antialias: true,
    });
    this._threejs.outputEncoding = THREE.sRGBEncoding;
    this._threejs.gammaFactor = 2.2;
    this._threejs.shadowMap.enabled = true;
    this._threejs.shadowMap.type = THREE.PCFSoftShadowMap;
    this._threejs.setPixelRatio(window.devicePixelRatio);
    this._threejs.setSize(window.innerWidth, window.innerHeight);
    this._threejs.domElement.id = 'threejs';

    document.getElementById('GameDiv').appendChild(this._threejs.domElement);

    window.addEventListener('resize', () => {
      this._OnWindowResize();
    }, false);

    const fov = 60;
    const aspect = 1920 / 1080;
    const near = 1.0;
    const far = 10000.0;
    this._camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    this._camera.position.set(25, 10, 25);

    this._scene = new THREE.Scene();
    this._scene.background = new THREE.Color(0xFFFFFF);
    this._scene.fog = new THREE.FogExp2(0x89b2eb, 0.002);

    let light = new THREE.DirectionalLight(0xFFFFFF, 1.0);
    light.position.set(-10, 500, 10);
    light.target.position.set(0, 0, 0);
    light.castShadow = true;
    light.shadow.bias = -0.001;
    light.shadow.mapSize.width = 4096;
    light.shadow.mapSize.height = 4096;
    light.shadow.camera.near = 0.1;
    light.shadow.camera.far = 1000.0;
    light.shadow.camera.left = 100;
    light.shadow.camera.right = -100;
    light.shadow.camera.top = 100;
    light.shadow.camera.bottom = -100;
    this._scene.add(light);

    this._sun = light;

    const plane = new THREE.Mesh(
        new THREE.PlaneGeometry(1000, 1000, 10, 10),
        new THREE.MeshStandardMaterial({
            color: 0x1e601c,
          }));
    plane.castShadow = false;
    plane.receiveShadow = true;
    plane.rotation.x = -Math.PI / 2;
    this._scene.add(plane);

    this._entityManager = new entity_manager.EntityManager();
    this._grid = new spatial_hash_grid.SpatialHashGrid(
        [[-1000, -1000], [1000, 1000]], [100, 100]);

    this._LoadControllers();
    // this._LoadTower();
    this._LoadTTBL();
    this._LoadGuru();
    this._LoadFoliage();
    this._LoadClouds();
    this._LoadSky();
    this._LoadPlayer();
    

    this._previousRAF = null;
    this._RAF();
    // Create the event
    var event = new CustomEvent("name-of-event", { "detail": "Example of an event" });
    // Dispatch/Trigger/Fire the event
    document.dispatchEvent(event);
  }

  _LoadControllers() {
    const ui = new entity.Entity();
    ui.AddComponent(new ui_controller.UIController());
    this._entityManager.Add(ui, 'ui');
  }

  // enter home planet... 
  // home planet, can have max size 100, 100
  _SetupMap(params) {

  }

  _LoadSky() {
    const hemiLight = new THREE.HemisphereLight(0xFFFFFF, 0xFFFFFFF, 0.6);
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

  _LoadClouds() {
    for (let i = 0; i < 20; ++i) {
      const index = math.rand_int(1, 3);
    const pos = new THREE.Vector3(
        (Math.random() * 2.0 - 1.0) * 500,
        100,
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
      this._entityManager.Add(e, 'cloud_' + i);
      e.SetActive(false);
    }
  }

  _LoadFoliage() {

    const items = ['BirchTree_1.fbx', 'BirchTree_2.fbx', 'BirchTree_3.fbx', 'BirchTree_4.fbx', 'BirchTree_5.fbx', 'BirchTree_Autumn_1.fbx', 'BirchTree_Autumn_2.fbx', 'BirchTree_Autumn_3.fbx', 'BirchTree_Autumn_4.fbx', 'BirchTree_Autumn_5.fbx', 'BirchTree_Dead_1.fbx', 'BirchTree_Dead_2.fbx', 'BirchTree_Dead_3.fbx', 'BirchTree_Dead_4.fbx', 'BirchTree_Dead_5.fbx', 'BirchTree_Dead_Snow_1.fbx', 'BirchTree_Dead_Snow_2.fbx', 'BirchTree_Dead_Snow_3.fbx', 'BirchTree_Dead_Snow_4.fbx', 'BirchTree_Dead_Snow_5.fbx', 'BirchTree_Snow_1.fbx', 'BirchTree_Snow_2.fbx', 'BirchTree_Snow_3.fbx', 'BirchTree_Snow_4.fbx', 'BirchTree_Snow_5.fbx', 'Bush_1.fbx', 'Bush_2.fbx', 'Bush_Snow_1.fbx', 'Bush_Snow_2.fbx', 'BushBerries_1.fbx', 'BushBerries_2.fbx', 'Cactus_1.fbx', 'Cactus_2.fbx', 'Cactus_3.fbx', 'Cactus_4.fbx', 'Cactus_5.fbx', 'CactusFlower_1.fbx', 'CactusFlowers_2.fbx', 'CactusFlowers_3.fbx', 'CactusFlowers_4.fbx', 'CactusFlowers_5.fbx', 'CommonTree_1.fbx', 'CommonTree_2.fbx', 'CommonTree_3.fbx', 'CommonTree_4.fbx', 'CommonTree_5.fbx', 'CommonTree_Autumn_1.fbx', 'CommonTree_Autumn_2.fbx', 'CommonTree_Autumn_3.fbx', 'CommonTree_Autumn_4.fbx', 'CommonTree_Autumn_5.fbx', 'CommonTree_Dead_1.fbx', 'CommonTree_Dead_2.fbx', 'CommonTree_Dead_3.fbx', 'CommonTree_Dead_4.fbx', 'CommonTree_Dead_5.fbx', 'CommonTree_Dead_Snow_1.fbx', 'CommonTree_Dead_Snow_2.fbx', 'CommonTree_Dead_Snow_3.fbx', 'CommonTree_Dead_Snow_4.fbx', 'CommonTree_Dead_Snow_5.fbx', 'CommonTree_Snow_1.fbx', 'CommonTree_Snow_2.fbx', 'CommonTree_Snow_3.fbx', 'CommonTree_Snow_4.fbx', 'CommonTree_Snow_5.fbx', 'Corn_1.fbx', 'Corn_2.fbx', 'Flowers.fbx', 'Grass_2.fbx', 'Grass_Short.fbx', 'Grass.fbx', 'Lilypad.fbx', 'PalmTree_1.fbx', 'PalmTree_2.fbx', 'PalmTree_3.fbx', 'PalmTree_4.fbx', 'PineTree_1.fbx', 'PineTree_2.fbx', 'PineTree_3.fbx', 'PineTree_4.fbx', 'PineTree_5.fbx', 'PineTree_Autumn_1.fbx', 'PineTree_Autumn_2.fbx', 'PineTree_Autumn_3.fbx', 'PineTree_Autumn_4.fbx', 'PineTree_Autumn_5.fbx', 'PineTree_Snow_1.fbx', 'PineTree_Snow_2.fbx', 'PineTree_Snow_3.fbx', 'PineTree_Snow_4.fbx', 'PineTree_Snow_5.fbx', 'Plant_1.fbx', 'Plant_2.fbx', 'Plant_3.fbx', 'Plant_4.fbx', 'Plant_5.fbx', 'Rock_1.fbx', 'Rock_2.fbx', 'Rock_3.fbx', 'Rock_4.fbx', 'Rock_5.fbx', 'Rock_6.fbx', 'Rock_7.fbx', 'Rock_Moss_1.fbx', 'Rock_Moss_2.fbx', 'Rock_Moss_3.fbx', 'Rock_Moss_4.fbx', 'Rock_Moss_5.fbx', 'Rock_Moss_6.fbx', 'Rock_Moss_7.fbx', 'Rock_Snow_1.fbx', 'Rock_Snow_2.fbx', 'Rock_Snow_3.fbx', 'Rock_Snow_4.fbx', 'Rock_Snow_5.fbx', 'Rock_Snow_6.fbx', 'Rock_Snow_7.fbx', 'TreeStump_Moss.fbx', 'TreeStump_Snow.fbx', 'TreeStump.fbx', 'Wheat.fbx', 'Willow_1.fbx', 'Willow_2.fbx', 'Willow_3.fbx', 'Willow_4.fbx', 'Willow_5.fbx', 'Willow_Autumn_1.fbx', 'Willow_Autumn_2.fbx', 'Willow_Autumn_3.fbx', 'Willow_Autumn_4.fbx', 'Willow_Autumn_5.fbx', 'Willow_Dead_1.fbx', 'Willow_Dead_2.fbx', 'Willow_Dead_3.fbx', 'Willow_Dead_4.fbx', 'Willow_Dead_5.fbx', 'Willow_Dead_Snow_1.fbx', 'Willow_Dead_Snow_2.fbx', 'Willow_Dead_Snow_3.fbx', 'Willow_Dead_Snow_4.fbx', 'Willow_Dead_Snow_5.fbx', 'Willow_Snow_1.fbx', 'Willow_Snow_2.fbx', 'Willow_Snow_3.fbx', 'Willow_Snow_4.fbx', 'Willow_Snow_5.fbx', 'WoodLog_Moss.fbx', 'WoodLog_Snow.fbx', 'WoodLog.fbx'];

    for (let i = 0; i < items.length; ++i) {
      // const names = [
      //   'CommonTree',
      //   'BirchTree',
      //   'Willow', 'Grass', 'Rock_Moss'
      // ];
      // const name = names[math.rand_int(0, names.length - 1)];
      // const index = math.rand_int(1, 5);

      const pos = new THREE.Vector3(
          (Math.random() * 2.0 - 1.0) * 500,
          0,
          (Math.random() * 2.0 - 1.0) * 500);

      const e = new entity.Entity();
      e.AddComponent(new gltf_component.StaticModelComponent({
        scene: this._scene,
        resourcePath: './resources/nature/FBX/',
        resourceName: items[i],
        scale: 0.125 + (Math.random() * 2.0 - 1.0) * 0.225,
        emissive: new THREE.Color(0x000000),
        specular: new THREE.Color(0x000000),
        receiveShadow: true,
        castShadow: true,
      }));
      e.AddComponent(
          new spatial_grid_controller.SpatialGridController({grid: this._grid}));
      e.SetPosition(pos);
      this._entityManager.Add(e, 'foliage_' + i);
      e.SetActive(false);
    }
  }

  _LoadGuru() {
    const guru = new entity.Entity();
    guru.AddComponent(new gltf_component.AnimatedModelComponent({
        scene: this._scene,
        resourcePath: './resources/hero/',
        resourceName: 'Ch39_nonPBR.fbx',
        resourceAnimation: 'softpunch.fbx',
        scale: 0.045,
        receiveShadow: true,
        castShadow: true,
    }));
    guru.AddComponent(new spatial_grid_controller.SpatialGridController({
        grid: this._grid,
    }));

    guru.AddComponent(new player_input.PickableComponent());
    guru.AddComponent(new Guruquest_component.GuruQuestComponent());
    
    const randX = -100 + ((Math.random() * 2.0 - 1.0) * 200);
    const randZ = 300 + ((Math.random() * 2.0 - 1.0) * 150);

    // const randX = 10;
    // const randZ  = 10;

    const posGuru = new THREE.Vector3(
      randX
     , 0
     , randZ);

    const posRubble = new THREE.Vector3(
      randX 
     , 10
     , randZ + 1.25);

     const posBabel = new THREE.Vector3(
      10 
     , 0
     , 10);

    guru.SetPosition(posGuru);
    this._entityManager.Add(guru, 'guru');

    this._LoadBabelRubble(posRubble);
    this._LoadBabel(posBabel);

  }

  _LoadBabelRubble(posRubble) {
    const loader = new GLTFLoader();
    loader.load('./resources/scenes/permanent/thing.glb', (gltf) => {
      gltf.scene.scale.set(8, 8, 8);  // 8, 8, 8 for rubble
      gltf.scene.position.y = -3;
      gltf.scene.position.z = posRubble.z;
      gltf.scene.position.x = posRubble.x;

      // gltf.scene.rotation.y = -Math.PI ;

      gltf.scene.traverse(c => {
            c.castShadow = true;
        });
        this._scene.add(gltf.scene);
    });
}

_LoadBabel(posRubble) {
  const loader = new GLTFLoader();
  loader.load('./resources/scenes/permanent/thing.glb', (gltf) => {
    gltf.scene.scale.set(30, 30, 30);  // 8, 8, 8 for rubble
    gltf.scene.position.y = posRubble.y;
    gltf.scene.position.z = posRubble.z;
    gltf.scene.position.x = posRubble.x;

    // gltf.scene.rotation.y = -Math.PI ;

    gltf.scene.traverse(c => {
          c.castShadow = true;
      });
      this._scene.add(gltf.scene);
  });
}

_LoadTTBL() {
  const loader = new GLTFLoader();
  loader.load('./resources/scenes/permanent/ttbl.glb', (gltf) => {
    gltf.scene.scale.set(1, 1, 1);  

    gltf.scene.position.y = 0;
      gltf.scene.position.z = 0;
      gltf.scene.position.x = 0;

    // gltf.scene.rotation.y = -Math.PI ;

    gltf.scene.traverse(c => {
          c.castShadow = true;
      });
      this._scene.add(gltf.scene);
  });
}

  _LoadPlayer() {
    const params = {
      camera: this._camera,
      scene: this._scene,
    };

    const levelUpSpawner = new entity.Entity();
    levelUpSpawner.AddComponent(new level_up_component.LevelUpComponentSpawner({
        camera: this._camera,
        scene: this._scene,
    }));
    this._entityManager.Add(levelUpSpawner, 'level-up-spawner');

    const axe = new entity.Entity();
    axe.AddComponent(new inventory_controller.InventoryItem({
        type: 'weapon',
        damage: 3,
        renderParams: {
          name: 'Axe',
          scale: 0.25,
          icon: 'war-axe-64.png',
        },
    }));
    this._entityManager.Add(axe, 'axe');

    const sword = new entity.Entity();
    sword.AddComponent(new inventory_controller.InventoryItem({
        type: 'weapon',
        damage: 3,
        renderParams: {
          name: 'Sword',
          scale: 0.25,
          icon: 'pointy-sword-64.png',
        },
    }));
    this._entityManager.Add(sword, 'sword');


    
    const girl = new entity.Entity();
    girl.AddComponent(new gltf_component.AnimatedModelComponent({
        scene: this._scene,
        resourcePath: './resources/hero/',
        resourceName: 'peasant_girl.fbx',
        resourceAnimation: 'sigh.fbx',
        scale: 0.035,
        receiveShadow: true,
        castShadow: true,
    }));
    girl.AddComponent(new spatial_grid_controller.SpatialGridController({
        grid: this._grid,
    }));
    girl.AddComponent(new player_input.PickableComponent());

    // so it begins...
    girl.AddComponent(new girlquest_component.GirlQuestComponent());
    girl.SetPosition(new THREE.Vector3(30, 0, 30));
    this._entityManager.Add(girl, 'girl');

    const player = new entity.Entity();

    player.SetPosition(new THREE.Vector3(
      -1500 + (Math.random() * 2 - 1) * 3000,
      1000 + (Math.random() * 2 - 1) * 500,
      -4000 + (Math.random() * 2 - 1) * 3000));

    player.AddComponent(new player_input.BasicCharacterControllerInput(params));
    player.AddComponent(new player_entity.BasicCharacterController(params));
    player.AddComponent(
    new equip_weapon_component.EquipWeapon({anchor: 'RightHandIndex1'}));
    player.AddComponent(new inventory_controller.InventoryController(params));
    player.AddComponent(new health_component.HealthComponent({
        updateUI: true,
        health: 100,
        maxHealth: 100,
        strength: 50,
        wisdom: 5,
        experience: 0,
        level: 1,
    }));
    player.AddComponent(
        new spatial_grid_controller.SpatialGridController({grid: this._grid}));
    player.AddComponent(new attack_controller.AttackController({timing: 0.7}));
    this._entityManager.Add(player, 'player');

    player.Broadcast({
        topic: 'inventory.add',
        value: axe.Name,
        added: false,
    });

    player.Broadcast({
        topic: 'inventory.add',
        value: sword.Name,
        added: false,
    });

    player.Broadcast({
        topic: 'inventory.equip',
        value: sword.Name,
        added: false,
    });

    const camera = new entity.Entity();
    camera.AddComponent(
        new third_person_camera.ThirdPersonCamera({
            camera: this._camera,
            target: this._entityManager.Get('player')}));
    this._entityManager.Add(camera, 'player-camera');

    for (let i = 0; i < 30; ++i) {
      const monsters = [
        {
          resourceName: 'Ghost.fbx',
          resourceTexture: 'Ghost_Texture.png',
        },
        {
          resourceName: 'Alien.fbx',
          resourceTexture: 'Alien_Texture.png',
        },
        {
          resourceName: 'Skull.fbx',
          resourceTexture: 'Skull_Texture.png',
        },
        {
          resourceName: 'GreenDemon.fbx',
          resourceTexture: 'GreenDemon_Texture.png',
        },
        {
          resourceName: 'Cyclops.fbx',
          resourceTexture: 'Cyclops_Texture.png',
        },
        {
          resourceName: 'Cactus.fbx',
          resourceTexture: 'Cactus_Texture.png',
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
          new health_component.HealthComponent({
              health: 50,
              maxHealth: 50,
              strength: 2,
              wisdomness: 2,
              benchpress: 3,
              curl: 1,
              experience: 0,
              level: 1,
              camera: this._camera,
              scene: this._scene,
          }));
      npc.AddComponent(
          new spatial_grid_controller.SpatialGridController({grid: this._grid}));
      npc.AddComponent(new health_bar.HealthBar({
          parent: this._scene,
          camera: this._camera,
      }));
      npc.AddComponent(new attack_controller.AttackController({timing: 0.35}));
      
      // let degOfFreedom = 4;
      // let spawnSeed = 300 + (Math.random() * 2 - 1) * 700
      
      var x = 250 + (Math.random() * 2 - 1) * 250;
      var z = 250 + (Math.random() * 2 - 1) * 250;

      if (i % 4 == 0) { x *= 1; z *= 1; }
      if (i % 4 == 1) { x *= 1; z *= -1; }
      if (i % 4 == 2) { x *= -1; z *= 1; }
      if (i % 4 == 3) { x *= -1; z *= -1; }

      npc.SetPosition(new THREE.Vector3(
      x,
      0,
      z));
      this._entityManager.Add(npc, npc + '_' + i);
    }
  }
d
  _OnWindowResize() {
    this._camera.aspect = window.innerWidth / window.innerHeight;
    this._camera.updateProjectionMatrix();
    this._threejs.setSize(window.innerWidth, window.innerHeight);
  }

  _UpdateSun() {
    const player = this._entityManager.Get('player');
    const pos = player._position;
    var sunpos = new THREE.Vector3(-10, 500, -10);
    this._sun.position.copy(pos);
    this._sun.position.add(new THREE.Vector3(-10, 500, -10));
    this._sun.target.position.copy(pos);
    this._sun.updateMatrixWorld();
    this._sun.target.updateMatrixWorld();
  }

  _RAF() {
    this._frame ++;
    
    // float to int
    if ((this._frame | 0 )% 10800 == 0) this._clock ++;
    //update with babelTimeonce its ready
    // updateClock((this._clock) + " " + (this._frame > 108 ? this._frame /= 108 : this._frame));


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


let _APP = null;
const EnterBabelOption = document.getElementById("EnterBabelOption");
EnterBabelOption.addEventListener('click', () => {
  _APP = new BabelUniverse();
});
