var temporaryCube, shot;
var camera, scene, renderer, keyboard, loader, url, spotlight;
var material, textGeom, textMesh;
var score = 0, health = 100, damage = 0;

function loadCube()
{
  console.log("Loading cube.\n");
  var geo = new THREE.BoxGeometry(4, 4, 12);
  var mat = new THREE.MeshLambertMaterial({color: 'blue'}, .95, .95);
  temporaryCube = new THREE.Mesh(geo, mat);
  temporaryCube.position.x = 20;
  temporaryCube.position.y = 20;
  temporaryCube.position.z = 6;
  scene.add(temporaryCube);
}

function loadModel()
{
  loader = new THREEx.UniversalLoader();
  url = ['female02.obj', 'female.mtl'];
  loader.load(url, function(object3d) {
  //scene.add(object3d);
    render();
  });
}

function generateWorld()
{
  var texture = THREE.ImageUtils.loadTexture('assets/images/groundterrain.jpg');
  var planeMaterial = new THREE.MeshLambertMaterial({map: texture}, .4, .8);
  var planeGeometry = new THREE.PlaneGeometry(200, 200, 6);
  plane = new Physijs.BoxMesh( planeGeometry, planeMaterial, 0);
  scene.add(plane);
}

function shotsFired()
{
  if(shotFired)
    scene.remove(shot);
  console.log("Creating shot.\n");
  var mat = new Physijs.createMaterial( new THREE.MeshLambertMaterial({color: 'grey'}, .95, .95));
  var geo = new THREE.SphereGeometry(3);
  shot = new Physijs.SphereMesh(geo, mat);
  console.log("Shot created.\n");
  shot.position.x = temporaryCube.position.x;
  shot.position.y = temporaryCube.position.y;
  shot.position.z = temporaryCube.position.z;
  scene.add(shot);
}

var numEnemies = 0;
var waveNumber = 0;
var waveCap = 2;
var enemies = [];
function nextWave()
{
  waveNumber++;
  damage++;
  numEnemies = Math.pow(2, waveNumber);

  for(var i = 0; i < numEnemies; i++)
  {
    var geo = new THREE.BoxGeometry(4, 4, 12);
    var mat = new THREE.MeshLambertMaterial({color: 'red'}, .95, .95);
    temporaryEnemy = new THREE.Mesh(geo, mat);
    temporaryEnemy.position.x = (Math.random() * 200)-100;
    temporaryEnemy.position.y = (Math.random() * 200)-100;
    temporaryEnemy.position.z = 6;
    enemies[i] = temporaryEnemy;
    //numEnemies++;
    scene.add(enemies[i]);

  }
}

function moveEnemies()
{
  for(var i = 0; i < numEnemies; i++)
  {
    enemies[i].position.x += 2 * Math.cos((temporaryCube.position.x - enemies[i].position.x)/(temporaryCube.position.y - enemies[i].position.y));
    enemies[i].position.y += 2 * Math.sin((temporaryCube.position.x - enemies[i].position.x)/(temporaryCube.position.y - enemies[i].position.y));
  }
}

function init()
{
  shotFired = false;
  console.log("Version .1.01\n");
  keyboard = new THREEx.KeyboardState();

  Physijs.scripts.worker = 'libs/physijs_worker.js';
  Physijs.scripts.ammo = 'ammo.js';

  scene = new Physijs.Scene();
  scene.setGravity(new THREE.Vector3(0, 0, -30));
  scene.addEventListener('update', function() {
    scene.simulate();
  });



  camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, .1, 10000);
  camera.position.x = 0;
  camera.position.y = -100;
  camera.position.z = 250;
  camera.lookAt(scene.position);

  renderer = new THREE.WebGLRenderer();
  renderer.setClearColor(0x0000000, 1.0);
  renderer.setSize( window.innerWidth, window.innerHeight);
  renderer.shadowMapEnabled = true;

  spotLight = new THREE.SpotLight( 0xffffff );
  spotLight.position.set( 0, 0, 250 );
  spotLight.shadowCameraNear = 10;
  spotLight.shadowCameraFar = 100;
  spotLight.castShadow = true;
  spotLight.intensity = 4;
  scene.add(spotLight);

  generateWorld();

  loadCube();

  shotsFired();
  scene.remove(shot);


  scene.simulate();

  document.body.appendChild(renderer.domElement);
  render();
}

var shotFired = true;
function render()
{
  if(numEnemies == 0 && waveNumber <= waveCap)
    nextWave();



  if(keyboard.pressed("w"))
  {
    console.log("Pressed 'w'\n");
    temporaryCube.position.y += .5;
  }
  else if(keyboard.pressed("s"))
  {
    console.log("Pressed 's'\n");
    temporaryCube.position.y -= .5;
  }
  else if(keyboard.pressed("d"))
  {
    console.log("Pressed 'd'\n");
    temporaryCube.position.x += .5;

  }
  else if(keyboard.pressed("a"))
  {
    console.log("Pressed 'a'\n");
    temporaryCube.position.x -= .5;
  }
  else if(keyboard.pressed("i"))
  {
    console.log("Pressed i\n");
    shotsFired();
    shotFired = true;
    shot.applyCentralImpulse(new THREE.Vector3(0, 80000, 0));

  }
  else if(keyboard.pressed("k"))
  {
    console.log("Pressed k\n");
    shotsFired();
    shotFired = true;
    shot.applyCentralImpulse(new THREE.Vector3(0, -80000, 0));

  }
  else if(keyboard.pressed("j"))
  {
    console.log("Pressed j\n");
    shotsFired();
    shotFired = true;
    shot.applyCentralImpulse(new THREE.Vector3(-80000, 0, 0));

  }
  else if(keyboard.pressed("l"))
  {
    console.log("Pressed l\n");
    shotsFired();
    shotFired = true;
    shot.applyCentralImpulse(new THREE.Vector3(80000, 0, 0));
  }

  if(shotFired)
  {
    for(var i = 0; i < numEnemies; i++)
    {
      if(Math.abs(shot.position.x - enemies[i].position.x) <= 2 && Math.abs(shot.position.y == enemies[i].position.y) <= 2)
      {
        score++;
        numEnemies--;
        scene.remove(enemies[i]);
        scene.remove(shot);
        break;
      }
    }
  }

  if(shot.position.z < -20)
    scene.remove(shot);

  moveEnemies();

  requestAnimationFrame(render);
  renderer.render(scene, camera);
}
