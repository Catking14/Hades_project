// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Prefab)
    fireballPrefab: cc.Prefab = null;

    @property
    move_speed: number = 200;

    @property
    dash_speed: number = 400;
    //direction
    private move_dir: cc.Vec2 = cc.v2(0, 0);
    private face_dir: number = 1;
    //animation
    private anim: cc.Animation = null;
    private animstate: cc.AnimationState = null;
    //bollean
    private isfiring: boolean = false;
    private isdashing: boolean = false;
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
                this.dashbtn = true;
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
        if(this.isfiring) return;
        this.isfiring = true;
        // break dash if fire
        if (this.isdashing) this.isdashing = false;
        const mousePos = event.getLocation();
        const fireball = cc.instantiate(this.fireballPrefab);
        let distance;
        let direction = cc.v2(0, 0);
        let rotation: number;

        direction = cc.v2(mousePos.x - 480 - this.node.position.x, mousePos.y - 320 - this.node.position.y);
        distance = Math.sqrt(Math.pow(direction.x, 2) + Math.pow(direction.y, 2));
        direction = cc.v2(direction.x / distance, direction.y / distance);
        rotation = Math.atan(direction.y / direction.x) * (180 / Math.PI);
        if(direction.x >= 0){
            fireball.angle = rotation;
            this.face_dir = 1;
        }else{
            fireball.angle = rotation + 180;
            this.face_dir = -1;
        } 
        
        // play attack animation
        this.animstate = this.anim.play("wizard_attack2");
        this.scheduleOnce(()=>{
            fireball.setPosition(cc.v2(this.node.position.x, this.node.position.y));
            cc.find("Canvas/New Node").addChild(fireball);
            fireball.runAction(cc.moveBy(10, cc.v2(direction.x * 2000, direction.y * 2000)));
        },0.8);
        this.anim.on('finished', () => {
            this.isfiring = false;
        }, this);

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
    }
    private playerAnimation() {
        if(this.isfiring || this.isdashing)
        {
            // console.log("?");
            // empty for nop
        }
        else if((this.move_dir.x != 0 || this.move_dir.y != 0) && (this.animstate.name != "wizard_run" || !this.animstate.isPlaying))
        {
            this.anim.stop();
            this.animstate = this.anim.play("wizard_run");
        }
        else if((this.move_dir.x == 0 && this.move_dir.y == 0) && (this.animstate.name != "wizard_idle" || !this.animstate.isPlaying))
        {
            this.anim.stop();
            this.animstate = this.anim.play("wizard_idle");
        }
    }
    update(dt) {
        this.playerMovement();
        this.playerAnimation();
        if (this.isdashing) {
            this.node.x += this.dash_speed * this.move_dir.x * dt;
            this.node.y += this.dash_speed * this.move_dir.y * dt;
        } else {
            this.node.x += this.move_speed * this.move_dir.x * dt;
            this.node.y += this.move_speed * this.move_dir.y * dt;
        }

        this.node.scaleX = this.face_dir;
    }
}
