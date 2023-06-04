// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class Wizard extends cc.Component {

    @property(cc.Prefab)
    fireballPrefab: cc.Prefab = null;

    @property
    move_speed: cc.Vec2 = cc.v2(200, 160);

    @property
    dash_speed: cc.Vec2 = cc.v2(1000, 800);

    @property
    HP: number = 100;
    //direction
    private move_dir: cc.Vec2 = cc.v2(0, 0);
    private face_dir: number = 1;
    //animation
    private anim: cc.Animation = null;
    private animstate: cc.AnimationState = null;
    //bollean
    private isfiring: boolean = false;
    private isdashing: boolean = false;
    private isdead: boolean = false;
    private ishit:boolean = false;
    //keys
    private upbtn: boolean = false;      //key for up
    private downbtn: boolean = false;    //key for down
    private leftbtn: boolean = false;    //key for left
    private rightbtn: boolean = false;   //key for right
    private dashbtn: boolean = false;    //key for dash


    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        this.anim = this.node.getComponent(cc.Animation);
        this.animstate = this.anim.getAnimationState('wizard_idle');
    }

    start() {
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
        cc.find("Canvas/Main Camera").on(cc.Node.EventType.MOUSE_DOWN, this.fire, this);
    }

    onKeyDown(event) {
        switch (event.keyCode) {
            case cc.macro.KEY.w:
                this.upbtn = true;
                break;
            case cc.macro.KEY.a:
                this.leftbtn = true;
                break;
            case cc.macro.KEY.s:
                this.downbtn = true;
                break;
            case cc.macro.KEY.d:
                this.rightbtn = true;
                break;
            case cc.macro.KEY.space:
                if (!this.dashbtn){
                    this.dashbtn = true;
                    this.dash();
                }
                break;
        }
    }

    onKeyUp(event) {
        switch (event.keyCode) {
            case cc.macro.KEY.w:
                this.upbtn = false;
                break;
            case cc.macro.KEY.a:
                this.leftbtn = false;
                break;
            case cc.macro.KEY.s:
                this.downbtn = false;
                break;
            case cc.macro.KEY.d:
                this.rightbtn = false;
                break;
            case cc.macro.KEY.space:
                this.dashbtn = false;
                break;
        }
    }
    private fire(event) {
        if (this.isfiring) return;
        this.isfiring = true;
        // break dash if fire
        if (this.isdashing) this.isdashing = false;
        const mousePos = event.getLocation();
        
        const fireball = cc.instantiate(this.fireballPrefab);
        let distance;
        let direction = cc.v2(0, 0);
        let rotation: number;
        
        // console.log(mousePos.x,mousePos.y);
        // console.log(this.node.x,this.node.y);
        let camerapos = cc.find("Canvas/Main Camera").position;
        // console.log(camerapos.x,camerapos.y);
        direction = cc.v2(mousePos.x + camerapos.x - 480 - this.node.position.x, mousePos.y + camerapos.y - 320 - this.node.position.y);
        distance = Math.sqrt(Math.pow(direction.x, 2) + Math.pow(direction.y, 2));
        direction = cc.v2(direction.x / distance, direction.y / distance);

        rotation = Math.atan(direction.y / direction.x) * (180 / Math.PI);
        if (direction.x >= 0) {
            fireball.angle = rotation;
            this.face_dir = 1;
        } else {
            fireball.angle = rotation + 180;
            this.face_dir = -1;
        }

        // play attack animation
        this.animstate = this.anim.play("wizard_attack2");
        this.scheduleOnce(() => {
            fireball.setPosition(cc.v2(0,0));
            this.node.addChild(fireball);
            fireball.getComponent(cc.RigidBody).linearVelocity = cc.v2(direction.x * 100, direction.y * 100);
            // fireball.runAction(cc.moveBy(10, cc.v2(direction.x * 2000, direction.y * 2000)));
        }, 0.8);
        this.anim.on('finished', () => {
            this.isfiring = false;
        }, this);

    }
    private dash() {
        if (this.dashbtn && !this.isdashing) {
            this.isdashing = true;
            if (this.move_dir == cc.v2(0, 0)) {
                this.move_dir = cc.v2(this.face_dir, 0);
            }
            // play dash animation
            this.anim.stop();
            this.animstate = this.anim.play("wizard_dash");
            this.scheduleOnce(() => {
                this.isdashing = false;
                this.move_dir = cc.v2(0, 0);  // reset moving direction
            }, 0.2);
        }
    }
    private playerMovement() {
        if (this.isfiring) {
            this.move_dir = cc.v2(0, 0);
        } else {
            if (this.upbtn) {
                this.move_dir.y = 1;
            } else if (this.downbtn) {
                this.move_dir.y = -1;
            } else {
                this.move_dir.y = 0;
            }
            if (this.leftbtn) {
                this.move_dir.x = -1;
                this.face_dir = -1;
            } else if (this.rightbtn) {
                this.move_dir.x = 1;
                this.face_dir = 1;
            } else {
                this.move_dir.x = 0;
            }

        }
    }
    private playerAnimation() {
        if(this.isdead){
            if(this.animstate.name != "wizard_death" || !this.animstate.isPlaying)
                this.animstate = this.anim.play("wizard_death");
        }else if(this.ishit){
            if(this.animstate.name != "wizard_hit" || !this.animstate.isPlaying)
            this.animstate = this.anim.play("wizard_hit");
        }else if (this.isfiring || this.isdashing) {
            // console.log("?");
            // empty for nop
        }
        else if ((this.move_dir.x != 0 || this.move_dir.y != 0) && (this.animstate.name != "wizard_run" || !this.animstate.isPlaying)) {
            this.anim.stop();
            this.animstate = this.anim.play("wizard_run");
        }
        else if ((this.move_dir.x == 0 && this.move_dir.y == 0) && (this.animstate.name != "wizard_idle" || !this.animstate.isPlaying)) {
            this.anim.stop();
            this.animstate = this.anim.play("wizard_idle");
        }
    }
    update(dt) {
        this.playerMovement();
        this.playerAnimation();
        if (this.isdashing) {
            // let lv = this.node.getComponent(cc.RigidBody).linearVelocity;
            // lv.x = this.move_dir.x * this.dash_speed.x;
            // lv.y = this.move_dir.y * this.dash_speed.y;
            // this.node.getComponent(cc.RigidBody).linearVelocity = lv;
            this.node.x += this.dash_speed.x * this.move_dir.x * dt;
            this.node.y += this.dash_speed.y * this.move_dir.y * dt;
        } else {
            // let lv = this.node.getComponent(cc.RigidBody).linearVelocity;
            // lv.x = this.move_dir.x * this.move_speed.x;
            // lv.y = this.move_dir.y * this.move_speed.y;
            // this.node.getComponent(cc.RigidBody).linearVelocity = lv;
            this.node.x += this.move_speed.x * this.move_dir.x * dt;
            this.node.y += this.move_speed.y * this.move_dir.y * dt;
        }

        this.node.scaleX = this.face_dir;
    }

    damage(damage_val: number, ...damage_effect: Array<string>) {
        // damage_val 代表受到傷害的量值 型別為number
        // damage_effect 代表受到傷害的效果 型別為string array
        // 扣血量
        this.HP = this.HP > damage_val ? this.HP - damage_val : 0;
        if (this.HP > 0) {
            this.ishit = true;
            this.scheduleOnce(() => {
                this.ishit = false;
            }, 0.3);
        } else {
            this.isdead = true;
            this.scheduleOnce(() => {
                this.destroy();
            }, 0.35);
        }
    }
}