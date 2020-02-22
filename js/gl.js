  (function() {

    var scene, camera, renderer;
    var terrain, geometry, data, material;
    var worldWidth, worldHeight, gridSize;
    var background = '#2D3A4B'; 
    var surface = '#D6DCE5';

    var myCanvas = $("#gl"),
        myCanvas_W = myCanvas.width(),
        myCanvas_H = myCanvas.height();

    /*
     *    Initialize
     */
    function init() {
      setupScene();
      createShader();
      createTerrain();
      setupEventListeners();
      render();
    }

    /*
     *    Setup the scene
     */
    function setupScene() {
      //контейнер хранения и отслеживания отображаемых объектов
      scene = new THREE.Scene();
      // (60, (myCanvas_W - 256) / myCanvas_H, 1, 20000)
      camera = new THREE.PerspectiveCamera(40, 4, 1, 10000);
      //на видеокарту
      renderer = new THREE.WebGLRenderer({
        alpha: true
      });
      //размер сцены
      renderer.setSize(myCanvas_W, myCanvas_H);
      //фон
      renderer.setClearColor(background, 1);
      //WebGL-output.appendChild(renderer.domElement);
      myCanvas.append(renderer.domElement);
    }

    function createShader() {
      material = new THREE.MeshBasicMaterial({
        color: surface
      });
    }

    function createTerrain() {

      gridSize = 128;
      worldWidth = 5000;
      worldHeight = 5000;

      geometry = new THREE.PlaneGeometry(worldWidth, worldHeight, gridSize - 1, gridSize - 1);
      geometry.applyMatrix(new THREE.Matrix4().makeRotationX(Math.PI / 2));

      data = [];
      var highestPoint = 0;
      var inc = 0;
      for (var x = 0; x < gridSize; x++) {
        data.push([]);
        for (var y = 0; y < gridSize; y++) {
          data[x].push(getval(x, y));
          geometry.vertices[inc].y = data[x][y];
          if (data[x][y] > highestPoint) highestPoint = data[x][y];
          inc++;
        }
      }

      camera.position.y = 200;
      camera.position.x = -worldHeight / 2;
      camera.lookAt(new THREE.Vector3(0, 0, 0));

      terrain = new THREE.Mesh(geometry, material);
      terrain.position.y = 250;
      scene.add(terrain);

      scene.fog = new THREE.FogExp2(background, .001);
    };

    function getval(x, y) {
      var val = 0;
      val = Math.random() * 25;
      val += (Math.sin((x * 2) / gridSize) * 5);
      return val;
    }

    function updateTerrain() {
      var inc = 0;
      for (var x = 0; x < gridSize; x++) {
        for (var y = gridSize; y > 0; y--) {
          if (y == 1) {
            data[x][y] = getval(x, y);
          } else {
            data[x][y] = data[x][y - 1];
          }
          geometry.vertices[inc].y = data[x][y];
          inc++;
        }
      }
      geometry.verticesNeedUpdate = true;

    }

    /*
     *    Setup event listeners
     */
    function setupEventListeners() {
      window.addEventListener('resize', function() {

        //reset
        myCanvas_W = myCanvas.width(),
          myCanvas_H = myCanvas.height();

        renderer.setSize(myCanvas_W, myCanvas_H);
        camera.aspect = myCanvas_W / myCanvas_H;

        camera.updateProjectionMatrix();
      });


    }

    /*
     *    Render loop
     */
    function render() {
      requestAnimationFrame(render);
      terrain.position.x -= 5;
      if (terrain.position.x < -(worldWidth / gridSize)) {
        terrain.position.x += (worldWidth / gridSize);
        updateTerrain();
      }
      renderer.render(scene, camera);
    };
    
    init();
  })();
