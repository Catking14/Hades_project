// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;
const Input = {};

@ccclass
export default class Beholder extends cc.Component {

    @property(cc.Prefab)
    lazerPrefab: cc.Prefab = null;

    @property(cc.Prefab)
    bladePrefab: cc.Prefab = null;

    vecSpeed: cc.Vec2 = cc.v2(0, 0);
    ratio: number = 0.8;
    speed: number = 200;
    state: string = "walk";
    direction: string = "_front";

    isDead: boolean = false;
    getHitting: boolean = false;

    dirCount: number = 0;
    isAttacking1: boolean = false;
    isAttacking2: boolean = false;
    isAttacking3: boolean = false;
    a3_damage: number = 50;


    start() {
        cc.systemEvent.on("keydown", this.onKeyDown, this);
        cc.systemEvent.on("keyup", this.onKeyUp, this);
        // this.scheduleOnce(() => {
        //     this.a1();
        // }, 3);
    }

    update(dt) {

        if (this.isAttacking1) return;
        if(this.isAttacking3) return;
        
        this.vecSpeed = cc.v2(0, 0);

        // wasd + dash
        if (Input[cc.macro.KEY.w] || Input[cc.macro.KEY.up]) {
            this.vecSpeed.y = 1;
        }
        if (Input[cc.macro.KEY.s] || Input[cc.macro.KEY.down]) {
            this.vecSpeed.y = -1;
        }
        if (Input[cc.macro.KEY.a] || Input[cc.macro.KEY.left]) {
            this.node.scaleX = -2;
            this.vecSpeed.x = -1;
        }
        if (Input[cc.macro.KEY.d] || Input[cc.macro.KEY.right]) {
            this.node.scaleX = 2;
            this.vecSpeed.x = 1;
        }
        if (Input[cc.macro.KEY.q]) this.a1();
        if (Input[cc.macro.KEY.e]) this.a3();

        let giveSpeed = cc.v2(this.vecSpeed.x * this.speed, this.vecSpeed.y * this.speed * this.ratio);
        this.getComponent(cc.RigidBody).linearVelocity = (this.isDead || this.getHitting) ? cc.v2(0, 0) : giveSpeed;

        let dir = "";
        if (this.vecSpeed.y === -1) dir += "_front";
        if (this.vecSpeed.y === 1) dir += "_back";
        if (this.vecSpeed.x !== 0) dir += "_side";
        if (dir === "") dir = "_front";
        this.setState("walk", dir);
    }

    setState(newState: string, dir?: string) {

        if (this.state === newState && this.direction === dir) return;
        console.log("Beholder_" + newState + dir);

        let animation = this.node.getComponent(cc.Animation);
        animation.stop();
        animation.play("Beholder_" + newState + dir);
        this.state = newState;
        this.direction = dir;
    }

    a1() {
        this.dirCount = 0;
        this.isAttacking1 = true;
        this.schedule(this.updateDirCount, 0.3);

    }

    updateDirCount(){
        this.dirCount++;
        let dir: string = "";
        if (this.dirCount > 5) this.node.scaleX = -2;
        else this.node.scaleX = 2;
        switch (this.dirCount) {
            case 0: dir = "_start"; break;
            case 1: dir = "_loop_front"; break;
            case 2: dir = "_loop_front_side"; break;
            case 3: dir = "_loop_side"; break;
            case 4: dir = "_loop_back_side"; break;
            case 5: dir = "_loop_back"; break;
            case 6: dir = "_loop_back_side";   break; 
            case 7: dir = "_loop_side";    break;
            case 8: dir = "_loop_front_side";    break; 
            case 9: dir = "_loop_front";     break;
            case 10: dir = "_finish";    break;
        }
        this.setState("a1", dir);
        this.updateLazer();
        
        if(this.dirCount === 11) {
            this.isAttacking1 = false;
            this.unschedule(this.updateDirCount);
        }
    }
    
    updateLazer(){
        if(this.dirCount === 0) return;
        let lazer = cc.find("Canvas/New Node/BeholderVFX_lazer");
        if(this.dirCount >= 10){
            if(lazer) lazer.destroy();
            return;
        } 

        if(lazer) {
            lazer.angle = (225 + this.dirCount * 45) % 360;
            // if(this.dirCount === 4 || this.dirCount === 6) 
            // else if(this.dirCount === 3 || this.dirCount === 7) lazer.anchorX = -0.15;
            // else lazer.anchorX = -0.1;
            lazer.anchorX = -0.2;
        }else{
            lazer = cc.instantiate(this.lazerPrefab);
            lazer.setPosition(cc.v2(this.node.position.x, this.node.position.y - 10));
            lazer.angle = 270;
            this.node.parent.addChild(lazer);
        }
    }

    a3() {
        this.isAttacking3 = true;
        this.setState("a3", "_start");
        this.scheduleOnce(() => {
            this.setState("a3", "_loop");
            this.bladeGen();
        }, 0.25);
        this.scheduleOnce(() => {
            this.setState("a3", "_finish");
            this.node.getChildByName("BeholderVFX_spin").opacity = 0;
        }, 3.75);
        this.scheduleOnce(() => {
            this.isAttacking3 = false;
        }, 4);
    }

    bladeGen() {

        let blade = cc.instantiate(this.bladePrefab);
        blade.setPosition(0, 0);
        blade.group = "enemy_attack";
        blade.getComponent("blade").duration_time = 3.5;
        blade.getComponent("blade").damage_val = this.a3_damage;
        blade.getComponent(cc.PhysicsBoxCollider).size = new cc.Size(100, 70);
        this.node.addChild(blade); 
        this.node.getChildByName("BeholderVFX_spin").opacity = 255;
    }


    onKeyDown(event) { Input[event.keyCode] = 1; }
    onKeyUp(event) { Input[event.keyCode] = 0; }
}
