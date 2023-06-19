const { ccclass, property } = cc._decorator;
import { A_Star } from "../A_Star";

@ccclass
export default class FlyEye extends cc.Component {
    @property(cc.Node)
    target_set: cc.Node = null;

    @property(cc.Prefab)
    blade: cc.Prefab = null;

    pool_num: number;

    // 血量
    @property
    HP: number = 100;

    // 護甲
    @property
    Shield: number = 100;

    // 速度
    @property(cc.v2)
    speed = cc.v2(270, 230);

    // 方向
    private direction: cc.Vec2 = cc.v2(0, 0);

    target: cc.Node = null;
    private target_time: number = 0;      // 重新找目標的計時器
    private target_colddown: number = 0.1;  // 重新找目標的冷卻
    private target_distance: number = 100000; // 小於這個距離會觸發怪物的追擊

    private attack_distance: number = 50; // 低於這個距離 會進行攻擊
    private attack_counter: number = 0;   // 攻擊的計時器
    private attack_colddown: number = 1.5;  // 攻擊的CD
    private attack_delay: number = 0.9;   // 攻擊的延遲 (攻擊之前的準備時間)
    private attack_time: number = 1;   // 整個攻擊動作所需要的時間
    private attack_damage: number = 5;   // 攻擊傷害

    private HP_val: number = 0;
    private Shield_val: number = 0;

    private sprite: cc.Sprite;
    private animation: cc.Animation;
    private rigidBody: cc.RigidBody;
    private collider: cc.PhysicsBoxCollider;
    private HP_bar: cc.ProgressBar;
    private Shield_bar: cc.ProgressBar;
    private state: string = "";
    private isAttacking: boolean = false;
    private getHitting: boolean = false;
    private isDead: boolean = false;

    private AI: A_Star; 
    public map;

    onLoad() {
        this.sprite = this.node.getComponent(cc.Sprite);
        this.animation = this.node.getComponent(cc.Animation);
        this.rigidBody = this.node.getComponent(cc.RigidBody);
        this.collider = this.node.getComponent(cc.PhysicsBoxCollider);
        this.HP_bar = this.node.children[0].getComponents(cc.ProgressBar)[0];
        this.Shield_bar = this.node.children[0].getComponents(cc.ProgressBar)[1];
        this.state = "idle";
    }

    start() {
        this.HP_val = this.HP;
        this.Shield_val = this.Shield;
        // this.AI = new A_Star(this.map);
    }

    update(dt) {
        this.find_target(dt);

        // caculate attack time
        this.attack_counter = this.attack_counter > dt ? this.attack_counter - dt : 0;

        // caculate scaleX
        this.node.scaleX = this.direction.x > 0 ? 1 : -1;
        this.updateHPBar();

        // calculate displacement (depends on direction and speed)
        if (this.direction.x && !this.isDead && !this.isAttacking && !this.getHitting) this.node.x += this.direction.x * this.speed.x * dt;
        if (this.direction.y && !this.isDead && !this.isAttacking && !this.getHitting) this.node.y += this.direction.y * this.speed.y * dt;

        // refresh state (depends on x direction)
        let newState = "";
        if (this.isDead) newState = "death";
        else if (this.getHitting) newState = "damage";
        else if (this.isAttacking) newState = "attack0";
        else if (this.direction.x || this.direction.y) newState = "walk";
        else newState = "idle";
        this.setState(newState);
    }

    updateHPBar() {
        this.HP_bar.progress = this.HP_val / this.HP;
        this.HP_bar.reverse = this.node.scaleX != 1;
        this.Shield_bar.progress = this.Shield_val / this.Shield;
        this.Shield_bar.reverse = this.node.scaleX != 1;
    }

    setState(newState: string) {
        if (this.state == newState) return;

        this.animation.stop();
        this.animation.play(newState);
        this.state = newState;
    }

    init() {
        this.isDead = false;
        this.HP_val = this.HP;
        this.Shield_val = this.Shield;
    }

    dead() {
        this.isDead = true;
        this.scheduleOnce(() => {
            this.node.destroy();
        }, 0.8);
    }

    damage(damage_val: number, ...damage_effect: Array<string>) {
        // damage_val 代表受到傷害的量值 型別為number
        // damage_effect 代表受到傷害的效果 型別為string array
        if (this.Shield_val > 0) {
            // 扣護盾
            this.Shield_val = this.Shield_val > damage_val ? this.Shield_val - damage_val : 0;
        }
        else {
            // 扣血量
            this.isAttacking = false;
            this.HP_val = this.HP_val > damage_val ? this.HP_val - damage_val : 0;
            if (this.HP_val > 0) {
                this.getHitting = true;
                this.scheduleOnce(() => {
                    this.getHitting = false;
                }, 0.35);
            }
            else {
                this.dead();
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

        this.scheduleOnce(() => {
            if (this.isAttacking) {
                let blade = cc.instantiate(this.blade);
                blade.setPosition(cc.v2(this.node.position.x + this.node.width / 4 * this.node.scaleX, this.node.position.y));
                blade.setContentSize(cc.size(this.node.width * 2 / 3, this.node.height));
                blade.getComponent(cc.PhysicsBoxCollider).size = cc.size(this.node.width * 2 / 3, this.node.height);
                blade.getComponent("blade").duration_time = this.attack_time - this.attack_delay;
                blade.getComponent("blade").damage_val = this.attack_damage;
                cc.find("Canvas/New Node").addChild(blade);
            }
        }, this.attack_delay);
    }

    find_target(dt) {
        // this.target_time = this.target_time > dt ? this.target_time - dt : 0;
        // if (this.target_time == 0) {
        //     this.target_time = this.target_colddown;
        //     this.target = null;
        //     let mn = -1, mn_val = this.target_distance; // mn代表最近player的index, mn_val代表最近player距離當前節點的距離
        //     for (let i = 0; i < this.target_set.childrenCount; i++) {
        //         if (this.target_set.children[i].group == 'player') {
        //             let distance = Math.sqrt(Math.pow(this.target_set.children[i].position.x - this.node.position.x, 2) +
        //                 Math.pow(this.target_set.children[i].position.y - this.node.position.y, 2));
        //             if (distance < mn_val) {
        //                 mn = i;
        //                 mn_val = distance;
        //             }
        //         }
        //     }
        //     if (mn != -1) {
        //         this.target = this.target_set.children[mn];
                if (this.isAttacking || this.isDead || this.getHitting) return;
                let x_diff = this.target.position.x - this.node.position.x;
                let y_diff = this.target.position.y - this.node.position.y;
                let distance = Math.sqrt(Math.pow(x_diff, 2) + Math.pow(y_diff, 2));
        //         let dir = this.AI.search(this.node.position.sub(cc.v3(this.collider.size.width / 2, 0, 0)), this.target.position);
        //         if (dir == null)
        //         {
                    this.direction.x = (this.target.position.x - this.node.position.x) / distance;
                    this.direction.y = (this.target.position.y - this.node.position.y) / distance;
        //         }
        //         else
        //         {
        //             this.direction = dir;
        //         }
        //     }
        //     else
        //     {
        //         this.direction = cc.v2(0, 0);
        //     }
            if (cc.isValid(this.target)) {
                // if (this.isAttacking || this.isDead || this.getHitting) return;
                // let x_diff = this.target.position.x - this.node.position.x;
                // let y_diff = this.target.position.y - this.node.position.y;
                // let distance = Math.sqrt(Math.pow(x_diff, 2) + Math.pow(y_diff, 2));
                if (distance < this.attack_distance && this.attack_counter == 0 && Math.abs(y_diff) < 25) {
                    this.attack();
                }
            }
        // }
    }
}
