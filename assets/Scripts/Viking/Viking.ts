const { ccclass, property } = cc._decorator;
const Input = {};

@ccclass
export default class Viking extends cc.Component {

    @property(cc.Prefab)
    bladePrefab: cc.Prefab = null;

    @property(cc.Prefab)
    shieldPrefab: cc.Prefab = null;

    @property(cc.SpriteFrame)
    bubbleSprite: cc.SpriteFrame = null;


    // info
    private ratio: number = 0.8;
    private speed: number = 200;
    private Shield: number = 0;
    HP: number = 100;
    _ultimate_cd: number = 10;
    _ultimate: boolean = false;
    _dash_ready: boolean = true;
    money: number = 0;

    // variable
    private state: string = "stand";
    private nextAttack: string = "a1";
    private doNextAttack: boolean = false;
    private isBegin: boolean = false;
    private isDashing: boolean = false;
    private isDashingCD: boolean = false;
    private isAttacking: boolean = false;
    private getHitting: boolean = false;
    private isDead: boolean = false;
    private vecSpeed: cc.Vec2 = cc.v2(0, 0);
    private attack_time: number = 0.5;
    private attack_delay: number = 0.2;
    private attack_damage: number = 50;
    private mousePos: any = null;
    private isUltCD: boolean = false;
    private QCD: boolean = false;
    private ECD: boolean = false;

    start() {
        // cc.director.getPhysicsManager().debugDrawFlags = 1;
        cc.audioEngine.setVolume(0, 0.1);
        cc.systemEvent.on("keydown", this.onKeyDown, this);
        cc.systemEvent.on("keyup", this.onKeyUp, this);
        cc.find("Canvas/Main Camera").on(cc.Node.EventType.MOUSE_DOWN, this.attack, this);
        cc.find("Canvas/Main Camera").on(cc.Node.EventType.MOUSE_MOVE, this.setMousePos, this);
        // this.node.scale = 0.6;
    }

    update(dt) {
        // console.log(this.nextAttack);
        this._dash_ready = !this.isDashingCD;

        if (this.isDashing || this.isAttacking) return;

        this.vecSpeed = cc.v2(0, 0);

        // wasd + dash
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
        if (Input[cc.macro.KEY.space] && !this.isDashing) this.dash();
        if (Input[cc.macro.KEY.q]) this.skillQ();
        if (Input[cc.macro.KEY.e]) this.skillE();

        // give speed
        let giveSpeed = cc.v2(this.vecSpeed.x * this.speed, this.vecSpeed.y * this.speed * this.ratio);
        this.getComponent(cc.RigidBody).linearVelocity = (this.isDead || this.getHitting) ? cc.v2(0, 0) : giveSpeed;

        // update state
        if (this.isDead) {
            this.setState("death");
        } else if (this.getHitting) {
            this.setState("getHit");
        } else if (this.isDashing) {
            this.setState("dash");
        } else if (this.vecSpeed.x !== 0 || this.vecSpeed.y !== 0) {
            this.setState("run");
        } else {
            this.setState("stand");
        }
        this.updateShieldPosition(this.mousePos);
    }


    setState(newState: string) {
        if (this.state == newState) return;

        let animation = this.node.getComponent(cc.Animation);
        animation.stop();
        animation.play("viking_" + newState);
        this.state = newState;
    }

    dash() {
        if (this.isDashingCD) return;

        // console.log("Viking is dashing");
        this.isDashing = true;

        let curDir = (this.vecSpeed.x === 0 && this.vecSpeed.y === 0) ? this.node.scaleX : this.vecSpeed.x;

        this.node.runAction(cc.moveBy(
            0.2,
            curDir * this.speed / 2,
            this.vecSpeed.y * this.speed * this.ratio / 2
        ));

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
        // console.log("Viking is attacking");
        if (this.isAttacking) {
            console.log("attackCD");
            this.doNextAttack = true;
            return;
        }

        this.isAttacking = true;
        this.setState(this.nextAttack);
        this.bladeGen(this.nextAttack);
        this.getComponent(cc.RigidBody).linearVelocity = cc.v2(0, 0);

        const attacks = ["a1", "a2", "a3", "ultimate"];
        const currentIndex = attacks.indexOf(this.nextAttack);
        this.nextAttack = attacks[(currentIndex + 1) % attacks.length];
        // this.scheduleOnce(() => { this.nextAttack = "a1"; }, 2);

        this.scheduleOnce(() => {
            this.setState("stand");
            this.isAttacking = false;
        }, this.attack_time);

    }

    damage(damage_val: number, ...damage_effect: Array<string>) {
        // damage_val 代表受到傷害的量值 型別為number
        // damage_effect 代表受到傷害的效果 型別為string array
        console.log("Viking got damaged");
        console.log(damage_val);
        damage_val = 10;
        console.log(this.HP);

        if (this.Shield > 0) {
            // 扣護盾
            this.Shield = this.Shield > damage_val ? this.Shield - damage_val : 0;
        } else {
            // 扣血量
            this.HP = this.HP > damage_val ? this.HP - damage_val : 0;
            if (this.HP > 0) {
                this.getHitting = true;
                cc.find("Game Manager").getComponent("GameManager").camera_shake();
                this.scheduleOnce(() => {
                    this.getHitting = false;
                }, 0.3);
            } else {
                this.isDead = true;
                this.getComponent(cc.Animation).play("viking_death");
                this.getComponent(cc.Animation).on("finished", () => {
                    this.node.destroy();
                }, this);
            }
        }
    }

    skillE() {
        if (this.ECD) return;

        this.Shield = 100;
        let bubble = new cc.Node;
        bubble.addComponent(cc.Sprite);
        bubble.getComponent(cc.Sprite).spriteFrame = this.bubbleSprite;
        bubble.opacity = 128;
        bubble.scale = 4;
        this.node.addChild(bubble);

        this.scheduleOnce(() => {
            this.Shield = 0;
            bubble.destroy();
        }, 2);

        this.ECD = true;
        this.scheduleOnce(() => { this.ECD = false; }, 5);
    }

    skillQ() {
        if (this.QCD) return;
        
        if (!this.node.parent.getChildByName("shield")) {
            let shield = cc.instantiate(this.shieldPrefab);
            shield.setPosition(cc.v2(this.node.position.x, this.node.position.y));
            this.node.parent.addChild(shield);
            this._ultimate = true;
            this.scheduleOnce(() => {
                this._ultimate = false;
                shield.destroy();
            }, 5);
        }

        this.QCD = true;
        this.scheduleOnce(() => { this.QCD = false; }, this._ultimate_cd);
    }

    setMousePos(event) {
        this.mousePos = event.getLocation();
    }

    updateShieldPosition(mousePos) {
        let dis: number = 20;
        let shield = this.node.parent.getChildByName("shield");
        if (shield) {
            let camerapos = cc.find("Canvas/Main Camera").position;
            let direction = cc.v2(mousePos.x + camerapos.x - 480 - this.node.position.x, mousePos.y + camerapos.y - 320 - this.node.position.y);
            let distance = Math.sqrt(Math.pow(direction.x, 2) + Math.pow(direction.y, 2));
            direction = cc.v2(direction.x / distance, direction.y / distance);

            shield.setPosition(cc.v2(
                this.node.position.x + direction.x * dis * 2,
                this.node.position.y + direction.y * dis
            ));
            let angle = Math.abs(90 - Math.abs(Math.atan2(direction.y, direction.x * 2) * 180 / Math.PI));
            console.log(angle);
            shield.scaleX = (90 - angle) * (direction.x > 0 ? 1 : -1) * (direction.y > 0 ? -1 : 1) / 600;
            shield.skewY = angle * 0.3;
            if (direction.y > 0) shield.zIndex = -100;
            else shield.zIndex = 100;
        }
    }

    bladeGen(attackName: string) {
        console.log("bladeGen : " + attackName + "  damage : " + this.attack_damage);

        let blade = cc.instantiate(this.bladePrefab);
        blade.setPosition(0, 0);
        blade.group = "player_attack";
        blade.getComponent("blade").duration_time = this.attack_time - this.attack_delay;
        blade.getComponent("blade").damage_val = this.attack_damage;
        if (attackName !== "ultimate") {
            blade.getComponent(cc.PhysicsBoxCollider).offset = cc.v2(10 * this.node.scaleX, 6.3);
            blade.getComponent(cc.PhysicsBoxCollider).size = new cc.Size(32, 50);
        } else {
            blade.getComponent(cc.PhysicsBoxCollider).size = new cc.Size(100, 50);
        }
        this.scheduleOnce(() => { this.node.addChild(blade); }, this.attack_delay);
    }

    onKeyDown(event) { Input[event.keyCode] = 1; }
    onKeyUp(event) { Input[event.keyCode] = 0; }
}