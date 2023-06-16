const { ccclass, property } = cc._decorator;
const Input = {};

@ccclass
export default class Assassin extends cc.Component {

    @property(cc.Prefab)
    bladePrefab: cc.Prefab = null;

    @property(cc.Prefab)
    shieldPrefab: cc.Prefab = null;

    @property(cc.SpriteFrame)
    bubbleSprite: cc.SpriteFrame = null;

    @property(cc.Prefab)
    fireballPrefab: cc.Prefab = null;


    // info
    private ratio: number = 0.8;
    private speed: number = 200;
    private Shield: number = 0;
    private HP: number = 100;

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
    private QCD: boolean = false;
    private ECD: boolean = false;

    start() {
        // cc.director.getPhysicsManager().debugDrawFlags = 1;
        cc.audioEngine.setVolume(0, 0.1);
        cc.systemEvent.on("keydown", this.onKeyDown, this);
        cc.systemEvent.on("keyup", this.onKeyUp, this);
        cc.find("Canvas/Main Camera").on(cc.Node.EventType.MOUSE_DOWN, this.attack, this);
        cc.find("Canvas/Main Camera").on(cc.Node.EventType.MOUSE_MOVE, this.setMousePos, this);
    }

    update(dt) {

        if (this.isDashing || this.isAttacking) return;

        if (Input[cc.macro.KEY.a] || Input[cc.macro.KEY.left]) {
            this.node.scaleX = -1;
        }
        if (Input[cc.macro.KEY.d] || Input[cc.macro.KEY.right]) {
            this.node.scaleX = 1;
        }
        if (Input[cc.macro.KEY.q]) this.skillQ();
        if (Input[cc.macro.KEY.e]) this.skillE();

        // update state
        if (this.isDead) {
            this.setState("death");
        } else if (this.isDashing) {
            this.setState("dash");
        } else {
            this.setState("stand");
        }
    }


    setState(newState: string) {
        if (this.state == newState) return;

        let animation = this.node.getComponent(cc.Animation);
        animation.stop();
        animation.play("Assassin_shadow_" + newState);
        this.state = newState;
    }

    attack(event) {
        // console.log("Assassin is attacking");
        if (this.isAttacking) {
            console.log("attackCD");
            this.doNextAttack = true;
            return;
        }
        this.isAttacking = true;

        this.setState(this.nextAttack);
        if (this.nextAttack === "a1") {
            const mousePos = event.getLocation();
            this.bladeGen(this.nextAttack, mousePos);
        } else {
            this.bladeGen(this.nextAttack);
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
        console.log("Assassin shadow got damaged, haha");
    }

    skillE() {

    }

    skillQ() {
        if (this.QCD) return;
        const fireball = cc.instantiate(this.fireballPrefab);
        let camerapos = cc.find("Canvas/Main Camera").position;
        let direction = cc.v2(this.mousePos.x + camerapos.x - 480 - this.node.position.x, this.mousePos.y + camerapos.y - 320 - this.node.position.y);
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

        fireball.setPosition(cc.v2(0, 0));
        this.node.addChild(fireball);
        fireball.getComponent(cc.RigidBody).linearVelocity = cc.v2(direction.x * 100, direction.y * 100);

        this.QCD = true;
        this.scheduleOnce(() => { this.QCD = false; }, 2);
    }

    setMousePos(event) {
        this.mousePos = event.getLocation();
    }

    bladeGen(attackName: string, mousePos?: any) {
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

    onKeyDown(event) { Input[event.keyCode] = 1; }
    onKeyUp(event) { Input[event.keyCode] = 0; }
}