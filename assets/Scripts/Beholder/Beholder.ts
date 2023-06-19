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

    @property(cc.AudioClip)
    a1Sound: cc.AudioClip = null;

    // @property(cc.AudioClip)
    // a2Sound: cc.AudioClip = null;

    @property(cc.AudioClip)
    a3Sound: cc.AudioClip = null;

    @property(cc.AudioClip)
    tpSound: cc.AudioClip = null;

    vecSpeed: cc.Vec2 = cc.v2(0, 0);
    ratio: number = 0.8;
    speed: number = 200;
    state: string = "walk";
    direction: string = "_front";

    isDead: boolean = false;
    getHitting: boolean = false;
    HP: number = 1000;
    HP_val: number = 1000;
    Shield: number = 1000;
    Shield_val: number = 1000;

    dirCount: number = 0;
    isAttacking1: boolean = false;
    isAttacking2: boolean = false;
    isAttacking3: boolean = false;
    isTPing: boolean = false;
    a3_damage: number = 50;

    HP_bar: cc.ProgressBar;
    Shield_bar: cc.ProgressBar;

    player: cc.Node = null;


    start() {
        // cc.director.getPhysicsManager().debugDrawFlags = 0;
        cc.audioEngine.setEffectsVolume(0.5);
        cc.systemEvent.on("keydown", this.onKeyDown, this);
        cc.systemEvent.on("keyup", this.onKeyUp, this);
        this.HP_bar = this.node.children[1].getComponents(cc.ProgressBar)[0];
        this.Shield_bar = this.node.children[1].getComponents(cc.ProgressBar)[1];
        console.log(this.HP_bar);

        this.player = cc.find("BossSlimeManager").getComponent("BossSlimeManager").follow;
        this.schedule(() => {
            if (!this.isDead){
                cc.audioEngine.playEffect(this.tpSound, false);
                this.isTPing = true;
                this.setState("a1", "_start");
            } 
            this.scheduleOnce(() => {
                if (!this.isDead) {
                    this.node.setPosition(cc.v2(
                        this.player.x + Math.random() * 40 - 20,
                        this.player.y + Math.random() * 40 - 20
                    ));
                    this.setState("a1", "_start");
                }
            }, 1);
            this.scheduleOnce(() => {
                if (!this.isDead){
                    this.a3();
                    this.isTPing = false;
                } 
            }, 1.6);
            this.scheduleOnce(() => {
                if (!this.isDead) this.a1();
            }, 4);
        }, 8);

    }

    update(dt) {

        this.updateHPBar();

        if (this.isAttacking1 || this.isAttacking3 || this.isDead || this.isTPing) {
            this.getComponent(cc.RigidBody).linearVelocity = cc.v2(0, 0);
            return;
        }

        this.vecSpeed = cc.v2(0, 0);

        let targetDir = cc.v2(this.player.x - this.node.position.x, this.player.y - this.node.position.y);

        if (targetDir.x < 0) {
            this.node.scaleX = -3;
        }
        if (targetDir.x > 0) {
            this.node.scaleX = 3;
        }

        this.getComponent(cc.RigidBody).linearVelocity = targetDir.mul(0.2);
        this.vecSpeed = targetDir.mul(0.2);

        // wasd + dash
        // if (Input[cc.macro.KEY.w] || Input[cc.macro.KEY.up]) {
        //     this.vecSpeed.y = 1;
        // }
        // if (Input[cc.macro.KEY.s] || Input[cc.macro.KEY.down]) {
        //     this.vecSpeed.y = -1;
        // }
        // if (Input[cc.macro.KEY.a] || Input[cc.macro.KEY.left]) {
        //     this.node.scaleX = -2;
        //     this.vecSpeed.x = -1;
        // }
        // if (Input[cc.macro.KEY.d] || Input[cc.macro.KEY.right]) {
        //     this.node.scaleX = 2;
        //     this.vecSpeed.x = 1;
        // }
        // if (Input[cc.macro.KEY.q]) this.a1();
        // if (Input[cc.macro.KEY.e]) this.a3();

        // let giveSpeed = cc.v2(this.vecSpeed.x * this.speed, this.vecSpeed.y * this.speed * this.ratio);
        // this.getComponent(cc.RigidBody).linearVelocity = (this.isDead || this.getHitting) ? cc.v2(0, 0) : giveSpeed;

        let dir = "";
        if (this.vecSpeed.y < 0) dir += "_front";
        if (this.vecSpeed.y > 0) dir += "_back";
        if (this.vecSpeed.x !== 0) dir += "_side";
        if (dir === "") dir = "_front";
        this.setState("walk", dir);
    }

    setState(newState: string, dir?: string) {

        if (this.state === newState && this.direction === dir) return;
        // console.log("Beholder_" + newState + dir);

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

    updateDirCount() {
        this.dirCount++;
        let dir: string = "";
        if (this.dirCount > 5) this.node.scaleX = -3;
        else this.node.scaleX = 3;
        switch (this.dirCount) {
            case 0: dir = "_start"; break;
            case 1: dir = "_loop_front"; break;
            case 2: dir = "_loop_front_side"; break;
            case 3: dir = "_loop_side"; break;
            case 4: dir = "_loop_back_side"; break;
            case 5: dir = "_loop_back"; break;
            case 6: dir = "_loop_back_side"; break;
            case 7: dir = "_loop_side"; break;
            case 8: dir = "_loop_front_side"; break;
            case 9: dir = "_loop_front"; break;
            case 10: dir = "_finish"; break;
        }
        this.setState("a1", dir);
        this.updateLazer();

        if (this.dirCount === 11) {
            this.isAttacking1 = false;
            this.unschedule(this.updateDirCount);
        }
    }

    updateLazer() {
        if (this.dirCount === 0) return;
        let lazer = cc.find("Canvas/BeholderVFX_lazer");
        if (this.dirCount >= 10) {
            if (lazer) lazer.destroy();
            return;
        }

        if (lazer) {
            lazer.setPosition(cc.v2(this.node.position.x, this.node.position.y - 10));
            lazer.angle = (225 + this.dirCount * 45) % 360;
            // if(this.dirCount === 4 || this.dirCount === 6) 
            // else if(this.dirCount === 3 || this.dirCount === 7) lazer.anchorX = -0.15;
            // else lazer.anchorX = -0.1;
            lazer.anchorX = -0.2;
        } else {
            lazer = cc.instantiate(this.lazerPrefab);
            lazer.setPosition(cc.v2(this.node.position.x, this.node.position.y - 10));
            lazer.angle = 270;
            this.node.parent.addChild(lazer);
            cc.audioEngine.playEffect(this.a1Sound, false);
        }
    }

    a3() {
        this.isAttacking3 = true;
        this.setState("a3", "_start");
        cc.audioEngine.playEffect(this.a3Sound, false);
        this.scheduleOnce(() => {
            this.setState("a3", "_loop");
            this.bladeGen();
        }, 0.25);
        this.scheduleOnce(() => {
            this.setState("a3", "_finish");
            this.node.getChildByName("BeholderVFX_spin").opacity = 0;
        }, 1.75);
        this.scheduleOnce(() => {
            this.isAttacking3 = false;
        }, 2);
    }

    bladeGen() {
        this.vecSpeed = cc.v2(0, 0);

        let blade = cc.instantiate(this.bladePrefab);
        blade.setPosition(0, 0);
        blade.group = "enemy_attack";
        blade.getComponent("blade").duration_time = 1.5;
        blade.getComponent("blade").damage_val = this.a3_damage;
        blade.getComponent(cc.PhysicsBoxCollider).size = new cc.Size(100, 60);
        blade.getComponent(cc.PhysicsBoxCollider).sensor = true;
        this.node.addChild(blade);
        this.node.getChildByName("BeholderVFX_spin").opacity = 255;
    }

    damage(damage_val: number, ...damage_effect: Array<string>) {

        console.log("Beholder got damaged : " + this.HP);

        if (this.Shield > 0) {
            // 扣護盾
            this.Shield = this.Shield > damage_val ? this.Shield - damage_val : 0;
        } else {
            // 扣血量
            this.HP = this.HP > damage_val ? this.HP - damage_val : 0;
            if (this.HP > 0) {
                this.getHitting = true;
                this.scheduleOnce(() => {
                    this.getHitting = false;
                }, 0.3);
            } else {
                this.isDead = true;
                this.getComponent(cc.Animation).play("Beholder_death");
                this.getComponent(cc.Animation).on("finished", () => {
                    this.node.destroy();
                }, this);
            }
        }
    }

    updateHPBar() {
        this.HP_bar.progress = this.HP / this.HP_val;
        this.HP_bar.reverse = this.node.scaleX < 0;
        this.Shield_bar.progress = this.Shield / this.Shield_val;
        this.Shield_bar.reverse = this.node.scaleX < 0;
    }


    onKeyDown(event) { Input[event.keyCode] = 1; }
    onKeyUp(event) { Input[event.keyCode] = 0; }
}
