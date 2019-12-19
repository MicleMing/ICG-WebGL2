import * as THREE from 'three';

class Tank {
  renderer: THREE.WebGLRenderer;
  scene: THREE.Scene;
  cameras: THREE.Camera[] = [];
  constructor() {
    const canvas = document.getElementById('gl-canvas') as HTMLCanvasElement;
    this.renderer = new THREE.WebGLRenderer({ canvas });
    this.renderer.setClearColor(0xAAAAAA);
    this.renderer.shadowMap.enabled = true;

    this.scene = new THREE.Scene();

    const camera = this.makeCamera();
    camera.position.set(8, 4, 10).multiplyScalar(3);
    camera.lookAt(0, 0, 0);
    this.cameras.push(camera);

    this.render = this.render.bind(this);
  }

  makeCamera(fov: number = 40) {
    const aspect = 2;  // the canvas default
    const zNear = 0.1;
    const zFar = 1000;
    return new THREE.PerspectiveCamera(fov, aspect, zNear, zFar);
  }

  createLights() {
    const light1 = new THREE.DirectionalLight(0xffffff, 1);
    light1.position.set(0, 20, 0);
    this.scene.add(light1);
    light1.castShadow = true;
    light1.shadow.mapSize.width = 2048;
    light1.shadow.mapSize.height = 2048;

    const d = 50;
    light1.shadow.camera.left = -d;
    light1.shadow.camera.right = d;
    light1.shadow.camera.top = d;
    light1.shadow.camera.bottom = -d;
    light1.shadow.camera.near = 1;
    light1.shadow.camera.far = 50;
    light1.shadow.bias = 0.001;

    const light2 = new THREE.DirectionalLight(0xffffff, 1);
    light2.position.set(1, 2, 4);
    this.scene.add(light2);
  }

  createGround() {
    const groundGeometry = new THREE.PlaneBufferGeometry(50, 50);
    const groundMaterial = new THREE.MeshPhongMaterial({ color: 0xCC8866 });
    const groundMesh = new THREE.Mesh(groundGeometry, groundMaterial);
    groundMesh.rotation.x = Math.PI * -.5;
    groundMesh.receiveShadow = true;
    this.scene.add(groundMesh);
  }

  createTank() {
    const carWidth = 4;
    const carHeight = 1;
    const carLength = 8;

    const tank = new THREE.Object3D();
    this.scene.add(tank);

    const bodyGeometry = new THREE.BoxBufferGeometry(carWidth, carHeight, carLength);
    const bodyMaterial = new THREE.MeshPhongMaterial({ color: 0x6688AA });
    const bodyMesh = new THREE.Mesh(bodyGeometry, bodyMaterial);
    bodyMesh.position.y = 1.4;
    bodyMesh.castShadow = true;
    tank.add(bodyMesh);

    const tankCameraFov = 75;
    const tankCamera = this.makeCamera(tankCameraFov);
    tankCamera.position.y = 3;
    tankCamera.position.z = -6;
    tankCamera.rotation.y = Math.PI;
    bodyMesh.add(tankCamera);


    const wheelRadius = 1;
    const wheelThickness = .5;
    const wheelSegments = 6;
    const wheelGeometry = new THREE.CylinderBufferGeometry(
      wheelRadius,     // top radius
      wheelRadius,     // bottom radius
      wheelThickness,  // height of cylinder
      wheelSegments);
    const wheelMaterial = new THREE.MeshPhongMaterial({ color: 0x888888 });
    const wheelPositions = [
      [-carWidth / 2 - wheelThickness / 2, -carHeight / 2, carLength / 3],
      [carWidth / 2 + wheelThickness / 2, -carHeight / 2, carLength / 3],
      [-carWidth / 2 - wheelThickness / 2, -carHeight / 2, 0],
      [carWidth / 2 + wheelThickness / 2, -carHeight / 2, 0],
      [-carWidth / 2 - wheelThickness / 2, -carHeight / 2, -carLength / 3],
      [carWidth / 2 + wheelThickness / 2, -carHeight / 2, -carLength / 3],
    ];
    const wheelMeshes = wheelPositions.map((position) => {
      const mesh = new THREE.Mesh(wheelGeometry, wheelMaterial);
      mesh.position.set(position[0], position[1], 0);
      mesh.rotation.z = Math.PI * .5;
      mesh.castShadow = true;
      bodyMesh.add(mesh);
      return mesh;
    });

    const domeRadius = 2;
    const domeWidthSubdivisions = 12;
    const domeHeightSubdivisions = 12;
    const domePhiStart = 0;
    const domePhiEnd = Math.PI * 2;
    const domeThetaStart = 0;
    const domeThetaEnd = Math.PI * .5;
    const domeGeometry = new THREE.SphereBufferGeometry(
      domeRadius, domeWidthSubdivisions, domeHeightSubdivisions,
      domePhiStart, domePhiEnd, domeThetaStart, domeThetaEnd);
    const domeMesh = new THREE.Mesh(domeGeometry, bodyMaterial);
    domeMesh.castShadow = true;
    bodyMesh.add(domeMesh);
    domeMesh.position.y = .5;

    const turretWidth = .1;
    const turretHeight = .1;
    const turretLength = carLength * .75 * .2;
    const turretGeometry = new THREE.BoxBufferGeometry(
      turretWidth, turretHeight, turretLength);
    const turretMesh = new THREE.Mesh(turretGeometry, bodyMaterial);
    const turretPivot = new THREE.Object3D();
    turretMesh.castShadow = true;
    turretPivot.scale.set(5, 5, 5);
    turretPivot.position.y = .5;
    turretMesh.position.z = turretLength * .5;
    turretPivot.add(turretMesh);
    bodyMesh.add(turretPivot);

    const turretCamera = this.makeCamera();
    turretCamera.position.y = .75 * .2;
    turretMesh.add(turretCamera);

    const targetGeometry = new THREE.SphereBufferGeometry(.5, 6, 3);
    const targetMaterial = new THREE.MeshPhongMaterial({ color: 0x00FF00, flatShading: true });
    const targetMesh = new THREE.Mesh(targetGeometry, targetMaterial);
    const targetOrbit = new THREE.Object3D();
    const targetElevation = new THREE.Object3D();
    const targetBob = new THREE.Object3D();
    targetMesh.castShadow = true;
    this.scene.add(targetOrbit);
    targetOrbit.add(targetElevation);
    targetElevation.position.z = carLength * 2;
    targetElevation.position.y = 8;
    targetElevation.add(targetBob);
    targetBob.add(targetMesh);

    const targetCamera = this.makeCamera();
    const targetCameraPivot = new THREE.Object3D();
    targetCamera.position.y = 1;
    targetCamera.position.z = -2;
    targetCamera.rotation.y = Math.PI;
    targetBob.add(targetCameraPivot);
    targetCameraPivot.add(targetCamera);

    const curve = new THREE.SplineCurve([
      new THREE.Vector2(-10, 0),
      new THREE.Vector2(-5, 5),
      new THREE.Vector2(0, 0),
      new THREE.Vector2(5, -5),
      new THREE.Vector2(10, 0),
      new THREE.Vector2(5, 10),
      new THREE.Vector2(-5, 10),
      new THREE.Vector2(-10, -10),
      new THREE.Vector2(-15, -8),
      new THREE.Vector2(-10, 0),
    ]);

    const points = curve.getPoints(50);
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const material = new THREE.LineBasicMaterial({ color: 0xff0000 });
    const splineObject = new THREE.Line(geometry, material);
    splineObject.rotation.x = Math.PI * .5;
    splineObject.position.y = 0.05;
    this.scene.add(splineObject);

    this.cameras.push(turretCamera, targetCamera, tankCamera);
  }

  render() {
    this.renderer.render(this.scene, this.cameras[0]);
    requestAnimationFrame(this.render);
  }
}

const tank = new Tank();
tank.createGround();
tank.createLights();
tank.createTank();
tank.render();