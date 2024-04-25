import {Scene, Engine, Vector3, HemisphericLight, MeshBuilder, Color4, _staticOffsetValueSize, AmmoJSPlugin, PhysicsImpostor, CannonJSPlugin} from "@babylonjs/core"
import {Player} from "./Player";
import * as CANNON from "cannon";


export class MainScene{
  //declare variables
  scene:Scene;
  engine:Engine;
  player: Player;

  constructor(canvas: HTMLCanvasElement){

    this.engine=new Engine(canvas, true);
    this.scene=this.CreateScene();
    this.player=new Player(canvas, this.scene, this.engine);
    this.CreateEnvironment();
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

    /*
    //mise en place de la gravité
    const framesPerSecond=100; // j'ai augmenté de 60 à 100 pour qu'il saute moins rapidement
    const gravity=-9.81; // similaire à la gravité sur terre
    scene.gravity=new Vector3(0,gravity/framesPerSecond,0);

    

    */
    //sert a enlever la souris quand on joue, si tu click sur la mollette tu peux voir la souris
    
    scene.collisionsEnabled=true; //enable collisions
    scene.onPointerDown = (evt) => {
      if (evt.button === 0) this.engine.enterPointerlock();
      if (evt.button === 1) this.engine.exitPointerlock();
    };
    
    
    // la couleur bleue du ciel
    scene.clearColor = new Color4(0.4, 0.6, 0.8);


    //pour la physique
    scene.enablePhysics(new Vector3(0,-9.81,0), new CannonJSPlugin(true, 10, CANNON));
    

    return scene;
   
  }
  CreateGround():void{
    const ground=MeshBuilder.CreateGround("ground", {width: 3.2, height: 25}, this.scene); // by default it will be created in (0,0,0)
    ground.position=new Vector3(0,0,10);

    ground.physicsImpostor=new PhysicsImpostor(ground, 
      PhysicsImpostor.BoxImpostor, 
      {mass: 0, restitution: 0.9}, // mass=0 means it's static , woun't fall because of gravity
      this.scene);
      ground.position=new Vector3(0,0,10);
      // enable collisions
      ground.checkCollisions=true;

  }
  
  CreateEnvironment():void{
    //la lumière
    const light=new HemisphericLight("light", new Vector3(0,1,0),this.scene);// for the lights it doesn't really matter where we place the light, the vector is for the direction it's pointing at
    light.intensity=0.5;
    // @ts-ignore

    //const ground=MeshBuilder.CreateGround("ground", {width: 3.2, height: 25}, this.scene); // by default it will be created in (0,0,0)
    this.CreateGround();
    //this.CreateImpostors();
    // créé des obstacle séparé de 3 unité
    for( let i=3; i<20; i+=3){0
      const obstacle= MeshBuilder.CreateBox("box", {width: 3, height: 1, depth: 0.1}, this.scene);
      obstacle.physicsImpostor=new PhysicsImpostor(obstacle,
        PhysicsImpostor.BoxImpostor, 
        {mass: 0, restitution:0.9}, //restitution bouncing effect
         this.scene);
      obstacle.position=new Vector3(0,0.2,i);
      obstacle.checkCollisions=true;

    }
    

  }
  
  CreateImpostors():void{
    const box=MeshBuilder.CreateBox("box", {size:2}, this.scene);
    box.position=new Vector3(0,5,10);
    box.physicsImpostor=new PhysicsImpostor(box,
       PhysicsImpostor.BoxImpostor, 
       {mass: 1, restitution:0.9}, //restitution bouncing effect
        this.scene);
  }
  
  
}



const canvas=document.getElementById("renderCanvas") as HTMLCanvasElement; //get the canvas element
new MainScene(canvas);