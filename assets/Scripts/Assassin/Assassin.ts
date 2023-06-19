const { ccclass, property } = cc._decorator;


@ccclass
export default class Assassin extends cc.Component {

    private Input = {};

    @property(cc.Prefab)
    bladePrefab: cc.Prefab = null;

    @property(cc.Prefab)
    shieldPrefab: cc.Prefab = null;

    @property(cc.SpriteFrame)
    bubbleSprite: cc.SpriteFrame = null;

    @property(cc.Prefab)
    fireballPrefab: cc.Prefab = null;

    @property(cc.Prefab)
    shadowPrefab: cc.Prefab = null;

    @property(cc.AudioClip)
    a1Sound: cc.AudioClip = null;

    @property(cc.AudioClip)
    a2Sound: cc.AudioClip = null;

    @property(cc.AudioClip)
    a3Sound: cc.AudioClip = null;

    @property(cc.AudioClip)
    qSound: cc.AudioClip = null;

    @property(cc.AudioClip)
    e1Sound: cc.AudioClip = null;

    @property(cc.AudioClip)
    e2Sound: cc.AudioClip = null;

    @property(cc.Prefab)
    blood: cc.Prefab = null;

    // info
    private ratio: number = 0.8;
    private speed: number = 200;
    private Shield: number = 100;
    HP: number = 100;
    HP_max: number = 100;
    _dmg: number = 50;
    _ultimate_cd: number = 10;
    _ultimate: boolean = false;
    _ultimate_ready: boolean = true;
    _dash_ready: boolean = true;
    _dash_cd: number = 1;
    _hit: boolean = false;
    _died: boolean = false;
    money: number = 0;
    heal: number = 0;
    _blood_pool: cc.NodePool = null;

    // variable
    private state: string = "stand";
    private nextAttack: string = "a1";
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

        this._hit = this.getHitting;

        this._dash_ready = !this.isDashingCD;

        if (this.isDashing || this.isAttacking) return;

        this.vecSpeed = cc.v2(0, 0);

        // wasd + dash
        if (this.Input[cc.macro.KEY.w] || this.Input[cc.macro.KEY.up]) {
            this.vecSpeed.y = 1;
        }
        if (this.Input[cc.macro.KEY.s] || this.Input[cc.macro.KEY.down]) {
            this.vecSpeed.y = -1;
        }
        if (this.Input[cc.macro.KEY.a] || this.Input[cc.macro.KEY.left]) {
            this.node.scaleX = -1;
            this.vecSpeed.x = -1;
        }
        if (this.Input[cc.macro.KEY.d] || this.Input[cc.macro.KEY.right]) {
            this.node.scaleX = 1;
            this.vecSpeed.x = 1;
        }
        if (this.Input[cc.macro.KEY.space] && !this.isDashing) this.dash();

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
        if (this.Input[cc.macro.KEY.q]) this.skillQ();
        if (this.Input[cc.macro.KEY.e]) this.skillE();
    }


    setState(newState: string) {

        if (this.state == newState) return;

        let animation = this.node.getComponent(cc.Animation);
        animation.stop();
        animation.play("Assassin_" + newState);
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

        if (this.isAttacking) return;

        this.isAttacking = true;

        this.setState(this.nextAttack);
        this.bladeGen(this.nextAttack);
        this.getComponent(cc.RigidBody).linearVelocity = cc.v2(0, 0);
        switch (this.nextAttack) {
            case "a1": cc.audioEngine.playEffect(this.a1Sound, false); break;
            case "a2": cc.audioEngine.playEffect(this.a2Sound, false); break;
            case "a3": cc.audioEngine.playEffect(this.a3Sound, false); break;
        }

        const attacks = ["a1", "a2", "a3"];
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
        console.log("Assassin got damaged");
        console.log(damage_val);
        console.log(this.HP);

        let blood_effect = cc.instantiate(this.blood);

        blood_effect.setPosition(this.node.x, this.node.y);
        blood_effect.scaleX = Math.random() > 0.5 ? 1 : -1;
        blood_effect.getComponent("Blood")._blood_node_pool = this._blood_pool;

        if (this.Shield > 0) {
            // 扣護盾
            this.Shield = this.Shield > damage_val ? this.Shield - damage_val : 0;
        } else {
            // 扣血量
            this.HP = this.HP > damage_val ? this.HP - damage_val : 0;
            if (this.HP > 0) {
                this.getHitting = true;
                // cc.find("Game Manager").getComponent("GameManager").camera_shake();
                this.scheduleOnce(() => {
                    this.getHitting = false;
                }, 0.3);
            } else {
                this.isDead = true;
                this._died = true;
                let sceneName = cc.director.getScene().name;
                if (sceneName === "BossSlime" || sceneName === "BossBeholder") {
                    cc.find("BossSlimeManager").getComponent("BossSlimeManager").player_die();
                } else {
                    cc.find("Game Manager").getComponent("GameManager").player_die();
                }
                this.getComponent(cc.Animation).play("Assassin_death");
                this.getComponent(cc.Animation).on("finished", () => {
                    this.node.destroy();
                }, this);
            }
        }

        if (this.HP <= 0) {
            blood_effect.getComponent("Blood").die = true;
        }
        cc.find("Canvas/New Node").addChild(blood_effect);
    }

    generate_blood() {
        this._blood_pool = new cc.NodePool("Blood");

        for (let bld = 0; bld < 50; bld++) {
            let temp = cc.instantiate(this.blood);

            temp.getComponent("Blood")._blood_node_pool = this._blood_pool;
            this._blood_pool.put(temp);
        }
    }

    skillE() {
        if (this.ECD) return;
        let shadow = this.node.parent.getChildByName("Assassin_shadow");
        if (shadow) {
            let shadowPos = shadow.position;
            shadow.setPosition(this.node.position);
            this.node.setPosition(shadowPos);
            cc.audioEngine.playEffect(this.e2Sound, false);

            this.ECD = true;
            // this.scheduleOnce(() => { this.ECD = false; }, 5);

        } else {
            shadow = cc.instantiate(this.shadowPrefab);
            let camerapos = cc.find("Canvas/Main Camera").position;
            shadow.setPosition(cc.v2(
                this.mousePos.x + camerapos.x - 480,
                this.mousePos.y + camerapos.y - 320
            ));
            this.node.parent.addChild(shadow);
            cc.audioEngine.playEffect(this.e1Sound, false);
            this.nextAttack = "a1";

            this._ultimate = true;
            this.scheduleOnce(() => { this._ultimate = false; }, 0.5);

            this.scheduleOnce(() => { shadow.destroy(); }, 5);

            this.ECD = true;
            this._ultimate_ready = false;
            this.scheduleOnce(() => { this.ECD = false; }, 0.2);
            this.scheduleOnce(() => { this.ECD = false; this._ultimate_ready = true; }, this._ultimate_cd);

        }
    }

    skillQ() {

        if (this.QCD || this.isAttacking) return;

        const fireball = cc.instantiate(this.fireballPrefab);
        let camerapos = cc.find("Canvas/Main Camera").position;
        let direction = cc.v2(
            this.mousePos.x + camerapos.x - 480 - this.node.position.x,
            this.mousePos.y + camerapos.y - 320 - this.node.position.y
        );
        let distance = Math.sqrt(Math.pow(direction.x, 2) + Math.pow(direction.y, 2));
        direction = cc.v2(direction.x / distance, direction.y / distance);

        let rotation = Math.atan(direction.y / direction.x) * (180 / Math.PI);
        if (direction.x >= 0) {
            fireball.angle = rotation;
            this.node.scaleX = 1;
        } else {
            fireball.angle = rotation + 180;
            this.node.scaleX = -1;
        }

        this.scheduleOnce(() => {
            fireball.setPosition(cc.v2(0, 0));
            this.node.addChild(fireball);
            fireball.getComponent(cc.RigidBody).linearVelocity = cc.v2(direction.x * 100, direction.y * 100);
        }, 0.45);


        this.isAttacking = true;
        this.setState("a1");
        cc.audioEngine.playEffect(this.qSound, false);
        this.getComponent(cc.RigidBody).linearVelocity = cc.v2(0, 0);
        this.scheduleOnce(() => {
            this.setState("stand");
            this.isAttacking = false;
        }, this.attack_time);

        this.QCD = true;
        this.scheduleOnce(() => { this.QCD = false; }, 2);

    }

    setMousePos(event) {
        this.mousePos = event.getLocation();
    }

    bladeGen(attackName: string) {
        console.log("bladeGen : " + attackName + "  damage : " + this.attack_damage);

        let blade = cc.instantiate(this.bladePrefab);
        blade.setPosition(0, 0);
        blade.group = "player_attack";
        blade.getComponent("blade").duration_time = this.attack_time - this.attack_delay;
        blade.getComponent("blade").damage_val = this.attack_damage;
        blade.getComponent(cc.PhysicsBoxCollider).offset = cc.v2(10 * this.node.scaleX, 6.3);
        blade.getComponent(cc.PhysicsBoxCollider).size = new cc.Size(100, 50);
        this.scheduleOnce(() => { this.node.addChild(blade); }, this.attack_delay);

    }

    onKeyDown(event) { this.Input[event.keyCode] = 1; }
    onKeyUp(event) { this.Input[event.keyCode] = 0; }
}