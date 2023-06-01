const { ccclass, property } = cc._decorator;
const Input = {};

@ccclass
export default class Viking extends cc.Component {

    @property
    HP: number = 100;

    @property
    speed = 300;

    private state: string = "stand";
    private isBegin: boolean = false;
    private isDashing: boolean = false;
    private isDashingCD: boolean = false;
    private isAttacking: boolean = false;
    private getHitting: boolean = false;
    private isDead: boolean = false;
    private vecSpeed: cc.Vec2 = cc.v2(0, 0);

    start() {
        cc.systemEvent.on("keydown", this.onKeyDown, this);
        cc.systemEvent.on("keyup", this.onKeyUp, this);
        cc.find("Canvas/Main Camera").on(cc.Node.EventType.MOUSE_DOWN, this.attack, this);
    }

    update(dt) {
        // If is dashing, player cannot do anything else.
        if (this.isDashing || this.isAttacking) return;

        this.vecSpeed = cc.v2(0, 0);

        // wasd
        if (Input[cc.macro.KEY.w] || Input[cc.macro.KEY.up]) {
            this.vecSpeed.y = 1;
        }
        if (Input[cc.macro.KEY.s] || Input[cc.macro.KEY.down]) {
            this.vecSpeed.y = -1;
        }
        if (Input[cc.macro.KEY.a] || Input[cc.macro.KEY.left]) {
            this.node.scaleX = -1;
            this.vecSpeed.x = -1;
        }
        if (Input[cc.macro.KEY.d] || Input[cc.macro.KEY.right]) {
            this.node.scaleX = 1;
            this.vecSpeed.x = 1;
        }

        // dash
        if (Input[cc.macro.KEY.space] && !this.isDashing) {
            this.dash();
        }
        
        // give speed
        if(this.vecSpeed.x) this.node.x += this.vecSpeed.x * this.speed * dt;
        if(this.vecSpeed.y) this.node.y += this.vecSpeed.y * this.speed * dt;    

        if (this.isDashing) {
            this.setState("dash");
        } else if (this.vecSpeed.x !== 0 || this.vecSpeed.y !== 0) {
            this.setState("run");
        } else {
            this.setState("stand");
        }
    }


    setState(newState: string) {
        if (this.state == newState) return;

        let animation = this.node.getComponent(cc.Animation);
        animation.stop();
        animation.play("viking_" + newState);
        this.state = newState;
    
        // if(this.state == "stand"){

        // }else if(this.state == "run"){

        // }else if(this.state == "dash"){

        // }else if(this.state == "attack"){

        // }else if(this.state == "getHit"){

        // }else if(this.state == "death"){

        // }
    }

    dash() {
        if(this.isDashingCD) return;
        
        console.log("Viking is dashing");
        this.isDashing = true;

        this.node.runAction(cc.moveBy(0.5, this.vecSpeed.x * 200, this.vecSpeed.y * 200));
        this.scheduleOnce(() => {
            this.isDashing = false;
            this.isDashingCD = true;
            this.setState("stand");
        }, 0.5);

        this.scheduleOnce(() => {
            this.isDashingCD = false;
        }, 1);
    }

    attack(event) {
        console.log("attack");
        
        if (this.isAttacking) return;

        this.isAttacking = true;
        this.setState("a1");

        this.scheduleOnce(() => {
            this.setState("stand");
            this.isAttacking = false;
        }, 0.5)
    }

    onKeyDown(event) { Input[event.keyCode] = 1; }
    onKeyUp(event) { Input[event.keyCode] = 0; }
}
