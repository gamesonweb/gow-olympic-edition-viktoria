import {Scene, Engine, Vector3, HemisphericLight, MeshBuilder, Color4, _staticOffsetValueSize, AmmoJSPlugin, PhysicsImpostor, CannonJSPlugin, SceneLoader, AbstractMesh} from "@babylonjs/core"
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

    //sert a enlever la souris quand on joue, si tu click sur la mollette tu peux voir la souris
    
    scene.collisionsEnabled=true; //enable collisions
    scene.onPointerDown = (evt) => {
      if (evt.button === 0) this.engine.enterPointerlock();
      if (evt.button === 1) this.engine.exitPointerlock();
    };
    
    
    // la couleur bleue du ciel
    


    //pour la physique
    scene.enablePhysics(new Vector3(0,-9.81,0), new CannonJSPlugin(true, 10, CANNON));
    

    return scene;
   
  }
  CreateGround():void{
    const ground=MeshBuilder.CreateGround("ground", {width: 3, height: 100}, this.scene); // by default it will be created in (0,0,0)
    ground.position=new Vector3(0,0,10);

    ground.physicsImpostor=new PhysicsImpostor(ground, 
      PhysicsImpostor.BoxImpostor, 
      {mass: 0, restitution: 0.9}, // mass=0 means it's static , woun't fall because of gravity
      this.scene);
      ground.position=new Vector3(0,0,10);
      // enable collisions
      ground.checkCollisions=true;

  }
  
  async CreateEnvironment():Promise<void>{
    //la lumière
    const light=new HemisphericLight("light", new Vector3(0,1,0),this.scene);// for the lights it doesn't really matter where we place the light, the vector is for the direction it's pointing at
    light.intensity=0.5;
    
    /*
    const border=MeshBuilder.CreateBox("border", {height: 5, width: 0.5, depth: 60}, this.scene);
    border.position=new Vector3(1.5,2.5,20);
    border.checkCollisions=true;
    const border2=MeshBuilder.CreateBox("border2", {height: 5, width: 0.5, depth: 60}, this.scene);
    border2.position=new Vector3(-1.5,2.5,20);
    border2.checkCollisions=true;
    
    // toit
    const toit=MeshBuilder.CreateBox("border2", {height: 0.5, width: 3, depth: 60}, this.scene);
    toit.position=new Vector3(0,5,20);
    toit.checkCollisions=true;
    */
    this.CreateGround();
    
    // créé des obstacle séparé de 3 unité
    
    for( let i=3; i<50; i+=5){0
      const obstacle= await this.CreateBarriere();
      obstacle.physicsImpostor=new PhysicsImpostor(obstacle,
        PhysicsImpostor.BoxImpostor, 
        {mass: 0, restitution:0.9}, //restitution bouncing effect
         this.scene);
      obstacle.position=new Vector3(0,0.2,i);
      obstacle.checkCollisions=true;
    
    }
  }
    
  async CreateBarriere():Promise<AbstractMesh>{
    const { meshes} = await SceneLoader.ImportMeshAsync("","./models/", "barriere.glb", this.scene);
    meshes.map((mesh)=>{mesh.checkCollisions=true;});
    
    return meshes[0];
  }
  
  
  CreateImposters():void{
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