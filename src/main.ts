
import {Scene, Engine, Vector3, HemisphericLight, MeshBuilder, Color4, _staticOffsetValueSize} from "@babylonjs/core"
import {Player} from "./Player";
export class MainScene{
  //declare variables
  scene:Scene;
  engine:Engine;
  //camera: FollowCamera;
  player: Player;
  //heroMesh: AbstractMesh;
  constructor(canvas: HTMLCanvasElement){

    this.engine=new Engine(canvas, true);
    this.scene=this.CreateScene();
    this.player=new Player(canvas, this.scene, this.engine);
    //this.heroMesh=this.player.getHeroMesh(); // recupere les meshes du personnage
    //this.camera= this.CreateCamera();
    this.CreateEnvironment();


    //this.CreateRandomAnimatedShapes();
    // @ts-ignore


    //makes sure the scene is being rendered
    this.engine.runRenderLoop(()=>{
      this.scene.render();
    })
    window.addEventListener("resize", ()=>{
      this.engine.resize();
    });

  }
  // fonction qui return un int random dans l'intervalle [min, max]
  getRndInteger(min: number, max: number) {
    return Math.floor(Math.random() * (max - min) ) + min;
  }
  //cree la scene 
  CreateScene():Scene{
    const scene=new Scene(this.engine);


    //mise en place de la gravité
    const framesPerSecond=100; // j'ai augmenté de 60 à 100 pour qu'il saute moins rapidement
    const gravity=-9.81; // similaire à la gravité sur terre
    scene.gravity=new Vector3(0,gravity/framesPerSecond,0);

    scene.collisionsEnabled=true; //enable collisions

    
    //sert a enlever la souris quand on joue, si tu click sur la mollette tu peux voir la souris
    scene.onPointerDown = (evt) => {
      if (evt.button === 0) this.engine.enterPointerlock();
      if (evt.button === 1) this.engine.exitPointerlock();
    };
    
   
    // la couleur bleue du ciel
    scene.clearColor = new Color4(0.4, 0.6, 0.8);
    return scene;
   
  }

  /*
  CreateAnimatedBox(position: Vector3, valeur:number): void{
    const box = MeshBuilder.CreateBox("box", {});
    box.position=position;

    
    box.checkCollisions=true;

    const frameRate = 60;
    

    const xSlide = new Animation("xSlide", "position.x", frameRate, Animation.ANIMATIONTYPE_FLOAT, Animation.ANIMATIONLOOPMODE_CYCLE);

    const keyFrames = []; 

    keyFrames.push({
        frame: 0,
        value: valeur
    });

    keyFrames.push({
        frame: frameRate,
        value: -valeur
    });

    keyFrames.push({
        frame: 2 * frameRate,
        value: valeur
    });

    xSlide.setKeys(keyFrames);

    box.animations.push(xSlide);

    this.scene.beginAnimation(box, 0, valeur * frameRate, true);
    
  }
  CreateRandomAnimatedShapes():void{
    for(let i=0;i<10; i++){
      this.CreateAnimatedBox(new Vector3(0,1, this.getRndInteger(0,40)), this.getRndInteger(3,10));
    }
  }
  */
  
  CreateEnvironment():void{
    //la lumière
    const light=new HemisphericLight("light", new Vector3(0,1,0),this.scene);// for the lights it doesn't really matter where we place the light, the vector is for the direction it's pointing at
    light.intensity=0.5;
    // @ts-ignore

    const ground=MeshBuilder.CreateGround("ground", {width: 3.2, height: 25}, this.scene); // by default it will be created in (0,0,0)
    ground.position=new Vector3(0,0,10)
    // créé des obstacle séparé de 3 unité

    
    
    for( let i=3; i<20; i+=3){0
      const obstacle= MeshBuilder.CreateBox("box", {width: 3, height: 1, depth: 0.1}, this.scene);
      obstacle.position=new Vector3(0,0.2,i);
      obstacle.checkCollisions=true;
      //obstacle.ellipsoid=new Vector3(0,0,1);
    }
    
    

    // enable collisions
    ground.checkCollisions=true;



  }
  
  
}



const canvas=document.getElementById("renderCanvas") as HTMLCanvasElement; //get the canvas element
new MainScene(canvas);