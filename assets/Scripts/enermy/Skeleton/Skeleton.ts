const { ccclass, property } = cc._decorator;

@ccclass
export default class Skeleton extends cc.Component {
    @property(cc.Node)
    target: cc.Node = null;

    @property(cc.Prefab)
    blade: cc.Prefab = null;

    // 血量
    @property
    HP: number = 100;

    // 護甲
    @property
    Shield: number = 100;

    // 速度
    @property(cc.v2)
    speed = cc.v2(0, 0);

    @property
    debug_mode: boolean = false;

    // 方向
    private direction: cc.Vec2 = cc.v2(0, 0);

    private attack_distance: number = 50; // 低於這個距離 會進行攻擊
    private attack_counter: number = 0;   // 攻擊的計時器
    private attack_colddown: number = 2;  // 攻擊的CD
    private attack_delay: number = 0.9;   // 攻擊的延遲 (攻擊之前的準備時間)
    private attack_time: number = 1.17;   // 整個攻擊動作所需要的時間
    private attack_damage: number = 10;   // 攻擊傷害

    private sprite: cc.Sprite;
    private animation: cc.Animation;
    private rigidBody: cc.RigidBody;
    private collider: cc.PhysicsBoxCollider;
    private state: string = "";
    private isAttacking: boolean = false;
    private getHitting: boolean = false;
    private isDead: boolean = false;

    onLoad() {
        this.sprite = this.node.getComponent(cc.Sprite);
        this.animation = this.node.getComponent(cc.Animation);
        this.rigidBody = this.node.getComponent(cc.RigidBody);
        this.collider = this.node.getComponent(cc.PhysicsBoxCollider);
        this.state = "idle";
    }

    start() {
    }

    update(dt) {
        this.find_target();

        // caculate attack time
        this.attack_counter = this.attack_counter > dt ? this.attack_counter - dt : 0;

        // caculate scaleX
        this.node.scaleX = this.direction.x > 0 ? 0.8 : -0.8;

        // calculate displacement (depends on direction and speed)
        if (this.direction.x && !this.isDead && !this.isAttacking) this.node.x += this.direction.x * this.speed.x * dt;
        if (this.direction.y && !this.isDead && !this.isAttacking) this.node.y += this.direction.y * this.speed.y * dt;

        // refresh state (depends on x direction)
        let newState = "";
        if (this.isDead) newState = "death";
        else if (this.getHitting) newState = "damage";
        else if (this.isAttacking) newState = "attack0";
        else if (this.direction.x || this.direction.y) newState = "walk";
        else newState = "idle";
        this.setState(newState);
    }

    setState(newState: string) {
        if (this.state == newState) return;

        this.animation.stop();
        this.animation.play(newState);
        this.state = newState;

        // if (this.state == "stand") {

        // } else if (this.state == "run") {

        // } else if (this.state == "dash") {

        // } else if (this.state == "attack") {

        // } else if (this.state == "getHit") {

        // } else if (this.state == "death") {

        // }
    }

    damage(damage_val: number, ...damage_effect: Array<string>) {
        // damage_val 代表受到傷害的量值 型別為number
        // damage_effect 代表受到傷害的效果 型別為string array
        if (this.Shield > 0) {
            // 扣護盾
            this.Shield = this.Shield > damage_val ? this.Shield - damage_val : 0;
        }
        else {
            // 扣血量
            this.HP = this.HP > damage_val ? this.HP - damage_val : 0;
            if (this.HP > 0) {
                this.getHitting = true;
                this.scheduleOnce(() => {
                    this.getHitting = false;
                }, 0.3);
            }
            else {
                this.isDead = true;
                this.scheduleOnce(() => {
                    this.destroy();
                }, 0.35);
            }
        }
    }

    attack() {
        this.isAttacking = true;
        this.attack_counter = this.attack_colddown;
        this.scheduleOnce(() => {
            this.isAttacking = false;
            this.setState("idle");
        }, this.attack_time);

        let blade = cc.instantiate(this.blade);
        blade.setPosition(cc.v2(this.node.position.x + this.node.width / 4 * this.node.scaleX, this.node.position.y));
        blade.getComponents("blade")[0].duration_time = this.attack_time - this.attack_delay;
        blade.getComponents("blade")[0].damage_val = this.attack_damage;
        blade.getComponents("blade")[0].debug_mode = this.debug_mode;

        this.scheduleOnce(() => {
            cc.find("Canvas/New Node").addChild(blade);
        }, this.attack_delay);
    }

    find_target() {
        if (this.isAttacking || this.isDead || this.getHitting) return;
        let distance = Math.sqrt(Math.pow(this.target.position.x - this.node.position.x, 2) +
            Math.pow(this.target.position.y - this.node.position.y, 2));
        this.direction.x = (this.target.position.x - this.node.position.x) / distance;
        this.direction.y = (this.target.position.y - this.node.position.y) / distance;
        if (distance < this.attack_distance && this.attack_counter == 0) {
            this.attack();
        }
    }
}
