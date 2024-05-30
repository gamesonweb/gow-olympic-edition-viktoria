import { Scene, Engine, SceneLoader, AnimationGroup, KeyboardEventTypes, ActionManager, ExecuteCodeAction, Vector3, AbstractMesh, FollowCamera, PhysicsImpostor, MeshBuilder} from "@babylonjs/core";
import "@babylonjs/loaders";
import '@babylonjs/inspector';
import { Inspector } from "@babylonjs/inspector";

export class Player{
    scene:Scene;
    engine: Engine;
    isJumping: Boolean;
    characterAnim : AnimationGroup[];
    rotation: number;
    heroMesh: AbstractMesh;
    camera: FollowCamera;
    
    
    constructor(canvas: HTMLCanvasElement, scene: Scene, engine: Engine){
        
        this.scene=scene;
        
        this.engine=engine;
        this.isJumping=false;
        this.characterAnim=[];
        this.rotation=0;
        this.heroMesh=new AbstractMesh("");
        this.CreateCharacter(); 
        this.camera=this.CreateFollowCamera();
        
    }
    
    async CreateCharacter(): Promise<void>{
        
        // recuperer les meshes pour pouvoir se déplacer
        // les animationGroups pour pouvoir changer d'animation
        const inputMap: { [id: string] : boolean} = {}
        this.scene.actionManager = new ActionManager(this.scene);
        this.scene.actionManager.registerAction(new ExecuteCodeAction(ActionManager.OnKeyDownTrigger, function (evt) {
            inputMap[evt.sourceEvent.key] = true;
        }));
        this.scene.actionManager.registerAction(new ExecuteCodeAction(ActionManager.OnKeyUpTrigger, function (evt) {
            inputMap[evt.sourceEvent.key] = false;
        }));

        const { meshes, animationGroups} = await SceneLoader.ImportMeshAsync("","./models/", "character.glb", this.scene);
        
        this.heroMesh=meshes[0];
        console.log(animationGroups);
        meshes.map((mesh)=>{
            mesh.physicsImpostor = new PhysicsImpostor(mesh, PhysicsImpostor.BoxImpostor, { mass: 0, restitution: 0 }, this.scene);
            //mesh.checkCollisions=true;
        });// permet de detecter les collisions
        
        this.camera.lockedTarget=this.heroMesh;
        const neck = new AbstractMesh("", this.scene);
        neck.parent=this.scene.getTransformNodeById("mixamorig:Neck");
        this.camera.lockedTarget=neck;
        // Hauteur de la capsule (approximativement la hauteur du personnage)

        //const box= MeshBuilder.CreateBox("box", {height:1.5, width:0.5, depth:0.5 }, this.scene);
        //change the color of box to red


        //box.position=new Vector3(0,0.75,-1);
        //box.physicsImpostor = new PhysicsImpostor(box, PhysicsImpostor.BoxImpostor, { mass: 0.5, restitution: 0.5 }, this.scene);
        //this.heroMesh.physicsImpostor = new PhysicsImpostor(this.heroMesh, PhysicsImpostor.BoxImpostor, { mass: 0.5, restitution: 0.9 }, this.scene);
        this.heroMesh.checkCollisions=true;
        console.log(meshes);

        this.characterAnim=animationGroups;

        this.heroMesh.position= new Vector3(0,0,-1);
        const heroRotationSpeed=0.05
        const heroSpeed = 0.2;
        //const heroSpeedBackwards = 0.2;
        const jump= animationGroups[0];
        const run=animationGroups[1];
        console.log("dans player "+this.heroMesh);


        

        //this.heroMesh.ellipsoid=new Vector3(1,0.2,0.5);
        jump.stop(); //arrete l'animation
        run.play(true); //demare l'animation, true pour loop l'animation
        
        

        this.scene.onKeyboardObservable.add((keyInfo)=>{
        
            if(!this.isJumping && this.heroMesh.position.y>=0.01) {this.heroMesh.position.y=0;}
            console.log(this.heroMesh.position);
            if(keyInfo.type=== KeyboardEventTypes.KEYDOWN){
                if ( keyInfo.event.key === " " ){
                    this.isJumping=true;
                    this.heroMesh.position.y+=1.5;
                    this.heroMesh.position.z+=1;
                    jump.play(false);
                }
               
                
            }
            else {
        
                    this.isJumping=false;
                    run.play(true);

                }
            
        })
        
        let iPressedLastFrame = false; // Variable pour suivre si la touche "i" était enfoncée lors de la dernière frame
        let inspectorVisible = false; // Variable pour suivre l'état actuel de l'inspecteur
        let cpt=0
        this.scene.onBeforeRenderObservable.add(() => {
            let keydown = false;

            if (inputMap["w"] || inputMap["z"]) {
                this.heroMesh.moveWithCollisions(this.heroMesh.forward.scaleInPlace(heroSpeed));
                keydown = true;
            }
            
            if (inputMap["i"] && !iPressedLastFrame) { // Vérifie si la touche "i" est enfoncée et si elle n'était pas enfoncée la dernière frame
                if (inspectorVisible) {
                    Inspector.Hide(); // Cache l'inspector si déjà visible
                    inspectorVisible = false;
                } else {
                    Inspector.Show(this.scene, {}); // Affiche l'inspector
                    inspectorVisible = true;
                }
                keydown = true;
                iPressedLastFrame = true;
            } else if (!inputMap["i"]) { // Si la touche "i" n'est pas enfoncée dans cette frame
                iPressedLastFrame = false; // Réinitialise la variable
            }
            /*
            if (inputMap["a"] || inputMap["q"]) {
                this.heroMesh.rotate(Vector3.Up(), -heroRotationSpeed);
                keydown = true;
                this.rotation--;
            }
            
            if (inputMap["d"]) {
                this.heroMesh.rotate(Vector3.Up(), heroRotationSpeed);
                keydown = true;
                this.rotation++;
            }
            
            */
                // Si aucune des touches n'a été enfoncée, keydown restera à false
        });
    }
    CreateFollowCamera(): FollowCamera{
        const camera= new FollowCamera("followCam",new Vector3(0, 4.2, -1), this.scene);
        camera.heightOffset = 2; //height above te target
        camera.radius = 2.5; //distance from the target
        camera.rotationOffset = 180; // the goal angle in degrees arount the target in the x,y plan
        camera.cameraAcceleration = 0.005;
        camera.maxCameraSpeed = 5;

        return camera;
      }     
    
    
    
    getHeroMesh(): AbstractMesh{
        return this.heroMesh;
    }
    
    
    
    
}