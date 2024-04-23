import { Scene, Engine, SceneLoader, AnimationGroup, KeyboardEventTypes, ActionManager, ExecuteCodeAction, Vector3, AbstractMesh, FollowCamera} from "@babylonjs/core";
import "@babylonjs/loaders";
//import '@babylonjs/inspector';
//import { Inspector } from "@babylonjs/inspector";

export class Player{
    scene:Scene;
    engine: Engine;
    isJumping: Boolean;
    characterAnim : AnimationGroup[];
    rotation: number;
    heroMesh: AbstractMesh;
    camera: FollowCamera;
    // @ts-ignore
    constructor(canvas: HTMLCanvasElement, scene: Scene, engine: Engine){
        
        this.scene=scene;
        //Inspector.Show(scene, {});
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
        this.camera.lockedTarget=this.heroMesh;
        const toto = new AbstractMesh("", this.scene);
        toto.parent=this.scene.getTransformNodeById("mixamorig:Neck");
        this.camera.lockedTarget=toto;
        console.log(meshes);
        this.characterAnim=animationGroups;

        this.heroMesh.position= new Vector3(0,0.2,-1);
        const heroRotationSpeed=0.05
        const heroSpeed = 0.2;
        const heroSpeedBackwards = 0.2;
        const jump= animationGroups[0];
        const run=animationGroups[1];
        console.log("dans player "+this.heroMesh);
        this.heroMesh.ellipsoid=new Vector3(1,0.2,0.5);
        jump.stop(); //arrete l'animation
        run.play(true); //demare l'animation, true pour loop l'animation
        
        

        this.scene.onKeyboardObservable.add((keyInfo)=>{
            console.log(this.heroMesh.position);
            if(keyInfo.type=== KeyboardEventTypes.KEYDOWN){
                if ( keyInfo.event.key === " " ){
            
                    jump.play(false);
                }
               
                
            }
            else if(keyInfo.type=== KeyboardEventTypes.KEYUP){
                if ( keyInfo.event.key === " " ){
                    run.play(true);
                }
            }
        })
        var times=0;
        this.scene.onBeforeRenderObservable.add(() => {
            // @ts-ignore
            let keydown = false;
            
            
            
            if (inputMap["w"]||inputMap["z"]) {
                this.heroMesh.moveWithCollisions(this.heroMesh.forward.scaleInPlace(heroSpeed));
                keydown = true;
            
            }
            if (inputMap["s"]) {
                this.heroMesh.moveWithCollisions(this.heroMesh.forward.scaleInPlace(-heroSpeedBackwards));
                keydown = true;
            }
            if (inputMap["a"]||inputMap["q"]) {
                this.heroMesh.rotate(Vector3.Up(), -heroRotationSpeed);
                keydown = true;
                this.rotation--;
            }
            if (inputMap["d"]) {
                this.heroMesh.rotate(Vector3.Up(), heroRotationSpeed);
                keydown = true;
                this.rotation++;
            }
            /*
            if (inputMap["i"]) {
                if(times%2!=0){
                    Inspector.Show(this.scene, {});
                }
                else{
                    Inspector.Hide();
                }
                times++;
            }
            */
            
            
            
            
        }
        );
    }
    CreateFollowCamera(): FollowCamera{
        const camera= new FollowCamera("followCam",new Vector3(0, 4.2, -1), this.scene);
        camera.heightOffset = 2; //height above te target
        camera.radius = 2.5; //distance from the target
        camera.rotationOffset = 180; // the goal angle in degrees arount the target in the x,y plan
        camera.cameraAcceleration = 0.005;
        camera.maxCameraSpeed = 5;
        
        //camera.attachControl(true);
        //camera.lockedTarget = this.heroMesh;
        //console.log("dans main: "+this.heroMesh);
        return camera;
      }     
    
    
    
    getHeroMesh(): AbstractMesh{
        return this.heroMesh;
    }
    
    
    
    
}