import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.118/build/three.module.js';

import {math} from './math.js';
import {gltf_component} from './gltf-component.js';
import {entity} from './entity.js';
import {entity_manager} from './entity-manager.js';
import {spatial_hash_grid} from './spatial-hash-grid.js';
import {spatial_grid_controller} from './spatial-grid-controller.js';

import {FBXLoader} from 'https://cdn.jsdelivr.net/npm/three@0.118.1/examples/jsm/loaders/FBXLoader.js';
import {GLTFLoader} from 'https://cdn.jsdelivr.net/npm/three@0.118.1/examples/jsm/loaders/GLTFLoader.js';
import {OrbitControls} from 'https://cdn.jsdelivr.net/npm/three@0.118/examples/jsm/controls/OrbitControls.js';

const enterBabelButton = document.getElementById("enterBabelButton");
const babelDiv = document.getElementById("game-div");

class BasicCharacterControllerProxy {
    constructor(animations) {
      this._animations = animations;
    }
  
    get animations() {
      return this._animations;
    }
  };
  

class BasicCharacterController {
  constructor(params) {
    this._Init(params);
  }

  _Init(params) {
    this._params = params;
    this._decceleration = new THREE.Vector3(-0.0005, -0.0001, -5.0);
    this._acceleration = new THREE.Vector3(15, 0.25, 250.0);
    this._velocity = new THREE.Vector3(0, 0, 0);

    this._animations = {};
    this._input = new BasicCharacterControllerInput();

    this._stateMachine = new CharacterFSM(
        new BasicCharacterControllerProxy(this._animations));

    this._LoadModels();
  }

//   "./resources/", "vanguard_t_choonyung.fbx", "./resources/", "Gangnam Style.fbx", new THREE.Vector3(0, 0, -10)
  _LoadModels() {
    const loader = new FBXLoader();
    loader.setPath('./resources/');
    loader.load('vanguard_t_choonyung.fbx', (fbx) => {
      fbx.scale.setScalar(0.15);
      fbx.traverse(c => {
        c.castShadow = true;
      });

      this._target = fbx;
      this._params.scene.add(this._target);

      this._mixer = new THREE.AnimationMixer(this._target);

      this._manager = new THREE.LoadingManager();
      this._manager.onLoad = () => {
        this._stateMachine.SetState('idle');
      };

      const _OnLoad = (animName, anim) => {
        const clip = anim.animations[0];
        const action = this._mixer.clipAction(clip);
  
        this._animations[animName] = {
          clip: clip,
          action: action,
        };
      };

      const loader = new FBXLoader(this._manager);
      loader.setPath('./resources/');
      loader.load('Walking.fbx', (a) => { _OnLoad('walk', a); });
      loader.load('Running.fbx', (a) => { _OnLoad('run', a); });
      loader.load('Weight Shift.fbx', (a) => { _OnLoad('idle', a); });
      loader.load('Gangnam Style.fbx', (a) => { _OnLoad('dance', a); });
    });
  }

  Update(timeInSeconds) {
    if (!this._target) {
      return;
    }

    this._stateMachine.Update(timeInSeconds, this._input);

    const velocity = this._velocity;
    const frameDecceleration = new THREE.Vector3(
        velocity.x * this._decceleration.x,
        velocity.y * this._decceleration.y,
        velocity.z * this._decceleration.z
    );
    frameDecceleration.multiplyScalar(timeInSeconds);
    frameDecceleration.z = Math.sign(frameDecceleration.z) * Math.min(
        Math.abs(frameDecceleration.z), Math.abs(velocity.z));

    velocity.add(frameDecceleration);

    const controlObject = this._target;
    const _Q = new THREE.Quaternion();
    const _A = new THREE.Vector3();
    const _R = controlObject.quaternion.clone();

    const acc = this._acceleration.clone();
    if (this._input._keys.shift) {
      acc.multiplyScalar(2.0);
    }

    if (this._input._keys.forward) {
      velocity.z += acc.z * timeInSeconds;
    }
    if (this._input._keys.backward) {
      velocity.z -= acc.z * timeInSeconds;
    }
    if (this._input._keys.left) {
      _A.set(0, 1, 0);
      _Q.setFromAxisAngle(_A, 4.0 * Math.PI * timeInSeconds * this._acceleration.y);
      _R.multiply(_Q);
    }
    if (this._input._keys.right) {
      _A.set(0, 1, 0);
      _Q.setFromAxisAngle(_A, 4.0 * -Math.PI * timeInSeconds * this._acceleration.y);
      _R.multiply(_Q);
    }

    controlObject.quaternion.copy(_R);

    const oldPosition = new THREE.Vector3();
    oldPosition.copy(controlObject.position);

    const forward = new THREE.Vector3(0, 0, 1);
    forward.applyQuaternion(controlObject.quaternion);
    forward.normalize();

    const sideways = new THREE.Vector3(1, 0, 0);
    sideways.applyQuaternion(controlObject.quaternion);
    sideways.normalize();

    sideways.multiplyScalar(velocity.x * timeInSeconds);
    forward.multiplyScalar(velocity.z * timeInSeconds);

    controlObject.position.add(forward);
    controlObject.position.add(sideways);

    oldPosition.copy(controlObject.position);

    if (this._mixer) {
      this._mixer.update(timeInSeconds);
    }
  }
  };
  
  
class BasicCharacterControllerInput {
    constructor() {
      this._Init();    
    }
  
    _Init() {
      this._keys = {
        forward: false,
        backward: false,
        left: false,
        right: false,
        space: false,
        shift: false,
      };
      document.addEventListener('keydown', (e) => this._onKeyDown(e), false);
      document.addEventListener('keyup', (e) => this._onKeyUp(e), false);
    }
  
    _onKeyDown(event) {
      switch (event.keyCode) {
        case 87: // w
          this._keys.forward = true;
          break;
        case 65: // a
          this._keys.left = true;
          break;
        case 83: // s
          this._keys.backward = true;
          break;
        case 68: // d
          this._keys.right = true;
          break;
        case 32: // SPACE
          this._keys.space = true;
          break;
        case 16: // SHIFT
          this._keys.shift = true;
          break;
      }
    }
  
    _onKeyUp(event) {
      switch(event.keyCode) {
        case 87: // w
          this._keys.forward = false;
          break;
        case 65: // a
          this._keys.left = false;
          break;
        case 83: // s
          this._keys.backward = false;
          break;
        case 68: // d
          this._keys.right = false;
          break;
        case 32: // SPACE
          this._keys.space = false;
          break;
        case 16: // SHIFT
          this._keys.shift = false;
          break;
      }
    }
  };
  
  
  class FiniteStateMachine {
    constructor() {
      this._states = {};
      this._currentState = null;
    }
  
    _AddState(name, type) {
      this._states[name] = type;
    }
  
    SetState(name) {
      const prevState = this._currentState;
      
      if (prevState) {
        if (prevState.Name == name) {
          return;
        }
        prevState.Exit();
      }
  
      const state = new this._states[name](this);
  
      this._currentState = state;
      state.Enter(prevState);
    }
  
    Update(timeElapsed, input) {
      if (this._currentState) {
        this._currentState.Update(timeElapsed, input);
      }
    }
  };
  
  
  class CharacterFSM extends FiniteStateMachine {
    constructor(proxy) {
      super();
      this._proxy = proxy;
      this._Init();
    }
  
    _Init() {
      this._AddState('idle', IdleState);
      this._AddState('walk', WalkState);
      this._AddState('run', RunState);
      this._AddState('dance', DanceState);
    }
  };
  
  
  class State {
    constructor(parent) {
      this._parent = parent;
    }
  
    Enter() {}
    Exit() {}
    Update() {}
  };
  
  
  class DanceState extends State {
    constructor(parent) {
      super(parent);
  
      this._FinishedCallback = () => {
        this._Finished();
      }
    }
  
    get Name() {
      return 'dance';
    }
  
    Enter(prevState) {
      const curAction = this._parent._proxy._animations['dance'].action;
      const mixer = curAction.getMixer();
      mixer.addEventListener('finished', this._FinishedCallback);
  
      if (prevState) {
        const prevAction = this._parent._proxy._animations[prevState.Name].action;
  
        curAction.reset();  
        curAction.setLoop(THREE.LoopOnce, 1);
        curAction.clampWhenFinished = true;
        curAction.crossFadeFrom(prevAction, 0.2, true);
        curAction.play();
      } else {
        curAction.play();
      }
    }
  
    _Finished() {
      this._Cleanup();
      this._parent.SetState('idle');
    }
  
    _Cleanup() {
      const action = this._parent._proxy._animations['dance'].action;
      
      action.getMixer().removeEventListener('finished', this._CleanupCallback);
    }
  
    Exit() {
      this._Cleanup();
    }
  
    Update(_) {
    }
  };
  
  
  class WalkState extends State {
    constructor(parent) {
      super(parent);
    }
  
    get Name() {
      return 'walk';
    }
  
    Enter(prevState) {
      const curAction = this._parent._proxy._animations['walk'].action;
      if (prevState) {
        const prevAction = this._parent._proxy._animations[prevState.Name].action;
  
        curAction.enabled = true;
  
        if (prevState.Name == 'run') {
          const ratio = curAction.getClip().duration / prevAction.getClip().duration;
          curAction.time = prevAction.time * ratio;
        } else {
          curAction.time = 0.0;
          curAction.setEffectiveTimeScale(1.0);
          curAction.setEffectiveWeight(1.0);
        }
  
        curAction.crossFadeFrom(prevAction, 0.5, true);
        curAction.play();
      } else {
        curAction.play();
      }
    }
  
    Exit() {
    }
  
    Update(timeElapsed, input) {
      if (input._keys.forward || input._keys.backward) {
        if (input._keys.shift) {
          this._parent.SetState('run');
        }
        return;
      }
  
      this._parent.SetState('idle');
    }
  };
  
  
  class RunState extends State {
    constructor(parent) {
      super(parent);
    }
  
    get Name() {
      return 'run';
    }
  
    Enter(prevState) {
      const curAction = this._parent._proxy._animations['run'].action;
      if (prevState) {
        const prevAction = this._parent._proxy._animations[prevState.Name].action;
  
        curAction.enabled = true;
  
        if (prevState.Name == 'walk') {
          const ratio = curAction.getClip().duration / prevAction.getClip().duration;
          curAction.time = prevAction.time * ratio;
        } else {
          curAction.time = 0.0;
          curAction.setEffectiveTimeScale(1.0);
          curAction.setEffectiveWeight(1.0);
        }
  
        curAction.crossFadeFrom(prevAction, 0.5, true);
        curAction.play();
      } else {
        curAction.play();
      }
    }
  
    Exit() {
    }
  
    Update(timeElapsed, input) {
      if (input._keys.forward || input._keys.backward) {
        if (!input._keys.shift) {
          this._parent.SetState('walk');
        }
        return;
      }
  
      this._parent.SetState('idle');
    }
  };
  
  
  class IdleState extends State {
    constructor(parent) {
      super(parent);
    }
  
    get Name() {
      return 'idle';
    }
  
    Enter(prevState) {
      const idleAction = this._parent._proxy._animations['idle'].action;
      if (prevState) {
        const prevAction = this._parent._proxy._animations[prevState.Name].action;
        idleAction.time = 0.0;
        idleAction.enabled = true;
        idleAction.setEffectiveTimeScale(1.0);
        idleAction.setEffectiveWeight(1.0);
        idleAction.crossFadeFrom(prevAction, 0.5, true);
        idleAction.play();
      } else {
        idleAction.play();
      }
    }
  
    Exit() {
    }
  
    Update(_, input) {
      if (input._keys.forward || input._keys.backward) {
        this._parent.SetState('walk');
      } else if (input._keys.space) {
        this._parent.SetState('dance');
      }
    }
  };
  

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

        light = new THREE.AmbientLight( 0x404040 ); // soft white light
        this._scene.add(light);

        const controls = new OrbitControls(
            this._camera, this._threejs.domElement);
        controls.target.set(10,0,0);
        controls.update();

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
        this._LoadClouds();
        this._LoadBabelRubble();
        this._LoadAnimatedModel();
        this._RAF();
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
        this._entityManager.Add(e);
        e.SetActive(false);
      }
    }

    _LoadBabelRubble() {
        const loader = new GLTFLoader();
        loader.load('./resources/static/thing.glb', (gltf) => {
          gltf.scene.scale.set(10, 10, 10);  
          gltf.scene.position.y = 11;
          gltf.scene.position.z = 11;

          gltf.scene.traverse(c => {
                c.castShadow = true;
            });
            this._scene.add(gltf.scene);
        });
    }

    _LoadAnimatedModel() {
      const params = {
        camera: this._camera,
        scene: this._scene,
      }
      this._controls = new BasicCharacterController(params);
  
      this._thirdPersonCamera = new ThirdPersonCamera({
        camera: this._camera,
        target: this._controls,
      });
    }
  
    

    _OnWindowResize() {
        this._camera.aspect = window.innerWidth / window.innerHeight;
        this._camera.updateProjectionMatrix();
        this._threejs.setSize(window.innerWidth, window.innerHeight);
    }

    _RAF() {
        // console.log(this._);
        requestAnimationFrame((t) => {
            if (this._previousRAF == null) {
                this._previousRAF = t;
            }

            this._RAF();

            this._threejs.render(this._scene, this._camera);
            this._Step(t - this._previousRAF);
            this._previousRAF = t;
        });
    }

    _Step(timeElapsed) {
        const timeElapsedS = timeElapsed * 0.001;
        if (this._mixers) {
            this._mixers.map(m => m.update(timeElapsedS));
        }

        if (this._controls) {
            this._controls.Update(timeElapsedS);
        }

        this._thirdPersonCamera.Update(timeElapsedS);
    }

}

class ThirdPersonCamera {
  constructor(params) {
    this._params = params;
    this._camera = params.camera;

    this._currentPosition = new THREE.Vector3();
    this._currentLookat = new THREE.Vector3();
  }

  _CalculateIdealOffset() {
    const idealOffset = new THREE.Vector3(-15, 20, -30);
    // console.log(this._params);
    // const rotation = new THREE.Vector3(this._params.target._target.rotation._x,
    //   this._params.target._target.rotation._y,
    //   this._params.target._target.rotation._z);
    const rotation = this._params.target._target.quaternion;
    // console.log(rotation);
    idealOffset.applyQuaternion(rotation);
    idealOffset.add(this._params.target._target.position);
    return idealOffset;
  }

  _CalculateIdealLookat() {
    const idealLookat = new THREE.Vector3(0, 10, 50);
    // const rotation = new THREE.Vector3(this._params.target._target.rotation._x,
    //   this._params.target._target.rotation._y,
    //   this._params.target._target.rotation._z);
    const rotation = this._params.target._target.quaternion;
    // console.log(rotation);
    idealLookat.applyQuaternion(rotation);
    idealLookat.add(this._params.target._target.position);
    return idealLookat;
  }

  Update(timeElapsed) {
    const idealOffset = this._CalculateIdealOffset();
    const idealLookat = this._CalculateIdealLookat();

    // const t = 0.05;
    // const t = 4.0 * timeElapsed;
    const t = 1.0 - Math.pow(0.001, timeElapsed);

    this._currentPosition.lerp(idealOffset, t);
    this._currentLookat.lerp(idealLookat, t);

    this._camera.position.copy(this._currentPosition);
    this._camera.lookAt(this._currentLookat);
  }
}

// entering babel in v1
enterBabelButton.addEventListener('click', enterBabel);

function enterBabel() {
    enterBabelButton.classList.add('hide');
    const babelUniverse = new BabelUniverse();
}