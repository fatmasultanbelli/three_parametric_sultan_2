//IMPORT MODULES
import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import GUI from 'lil-gui';

//CONSTANT & VARIABLES
let width = window.innerWidth;
let height = window.innerHeight;
//-- GUI PAREMETERS
var gui;
const parameters = {
  resolutionX: 6, // Set the resolution to 6 for a hexagon
  rotationX: 100
}

//-- SCENE VARIABLES
var scene;
var camera;
var renderer;
var container;
var control;
var ambientLight;
var directionalLight;

//-- GEOMETRY PARAMETERS
// Create an empty array for storing all the hexagons
let sceneHexagons = [];
let resX = parameters.resolutionX;
let rotX = parameters.rotationX;

// Function to remove an object from the scene
function removeObject(object) {
  scene.remove(object);
  object.geometry.dispose();
  object.material.dispose();
}

// GEOMETRY FUNCTIONS
function createHexagons() {
  for (let i = -90; i < resX; i++) {
    const geometry = new THREE.CircleGeometry(1, 4);
    const material = new THREE.MeshPhysicalMaterial();
    material.color = new THREE.Color(0xffffff);
    material.color.setRGB(80, 1, Math.random());

    const hexagon = new THREE.Mesh(geometry, material);
    hexagon.position.set(i * 0, i * 0, 0);
    hexagon.name = "hexagon " + i;
    sceneHexagons.push(hexagon);

    scene.add(hexagon);
  }
}

function rotateHexagons() {
  sceneHexagons.forEach((element, index) => {
    let scene_hexagon = scene.getObjectByName(element.name);
    let rotationAmount = (index * (rotX / resX)) * (Math.PI / 180);
    let rotationMatrix = new THREE.Matrix4().makeRotationY(rotationAmount);
    scene_hexagon.applyMatrix4(rotationMatrix);
  });
}

function removeHexagons() {
  resX = parameters.resolutionX;
  rotX = parameters.rotationX;
  sceneHexagons.forEach(element => {
    let scene_hexagon = scene.getObjectByName(element.name);
    removeObject(scene_hexagon);
  });
  sceneHexagons = [];
}

// RESPONSIVE
function handleResize() {
  width = window.innerWidth;
  height = window.innerHeight;
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height);
  renderer.render(scene, camera);
}

// ANIMATE AND RENDER
function animate() {
  requestAnimationFrame(animate);

  control.update();

  if (resX !== parameters.resolutionX || rotX !== parameters.rotationX) {
    removeHexagons();
    createHexagons();
    rotateHexagons();
  }

  renderer.render(scene, camera);
}

function main() {
  // GUI
  gui = new GUI;
  gui.add(parameters, 'resolutionX', 3, 10, 1); // Adjust the range for the hexagon
  gui.add(parameters, 'rotationX', 0, 180);

  // CREATE SCENE AND CAMERA
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(15, width / height, 0.1, 100);
  camera.position.set(10, 10, 10)

  // LIGHTINGS
  ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambientLight);

  directionalLight = new THREE.DirectionalLight(0xffffff, 1);
  directionalLight.position.set(2, 5, 5);
  directionalLight.target.position.set(-1, -1, 0);
  scene.add(directionalLight);
  scene.add(directionalLight.target);

  // GEOMETRY INITIATION
  // Initiate first hexagons
  createHexagons();
  rotateHexagons();

  // RESPONSIVE WINDOW
  window.addEventListener('resize', handleResize);

  // CREATE A RENDERER
  renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  container = document.querySelector('#threejs-container');
  container.append(renderer.domElement);

  // CREATE MOUSE CONTROL
  control = new OrbitControls(camera, renderer.domElement);

  // EXECUTE THE UPDATE
  animate();
}

// EXECUTE MAIN
main();


