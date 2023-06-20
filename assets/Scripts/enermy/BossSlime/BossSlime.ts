const { ccclass, property } = cc._decorator;
import { A_Star_Slime } from "./A_Star_Slime";

@ccclass
export default class BossSlime extends cc.Component {
    @property(cc.Node)
    target_set: cc.Node = null;
    @property(cc.Node)
    target: cc.Node = null;

    @property(cc.Prefab)
    blade: cc.Prefab = null;

    @property(cc.Prefab)
    transporter: cc.Prefab = null;

    @property(cc.AudioClip)
    attack_effect: cc.AudioClip = null;
    @property(cc.AudioClip)
    smash_effect: cc.AudioClip = null;

    pool_num: number;

    // 血量
    @property
    HP: number = 1500;

    // 護甲
    @property
    Shield: number = 100;

    // 速度
    @property(cc.v2)
    speed = cc.v2(200, 150);

    @property(cc.Prefab)
    monster:cc.Prefab = null; 

    // 方向
    private direction: cc.Vec2 = cc.v2(0, 0);


    // private target: cc.Node = null;
    private target_time: number = 0;      // 重新找目標的計時器
    private target_colddown: number = 0.1;  // 重新找目標的冷卻
    private target_distance: number = 100000; // 小於這個距離會觸發怪物的追擊

    private attack_distance: number = 100; // 低於這個距離 會進行攻擊
    private attack_counter: number = 0;   // 攻擊的計時器
    private attack_colddown: number = 3;  // 攻擊的CD
    private attack_delay: number = 1;   // 攻擊的延遲 (攻擊之前的準備時間)
    private attack_time: number = 1.93;   // 整個攻擊動作所需要的時間
    private attack_damage: number = 30;   // 攻擊傷害

    private HP_val: number = 0;
    private Shield_val: number = 0;

    private sprite: cc.Sprite;
    private animation: cc.Animation;
    private rigidBody: cc.RigidBody;
    private collider: cc.PhysicsBoxCollider;
    private HP_bar: cc.ProgressBar;
    private Shield_bar: cc.ProgressBar;
    private animstate: string = "";
    private state: string = "";
    private isAttacking: boolean = false;
    private isSmashing: boolean = false;
    private isSpelling: boolean = false;
    private getHitting: boolean = false;
    private isDead: boolean = false;
    private isTransfroming: boolean = false;
    private smashCD:number = 0;
    private spellCD:number = 0;
    private AI: A_Star_Slime;

    onLoad() {
        this.sprite = this.node.getComponent(cc.Sprite);
        this.animation = this.node.getComponent(cc.Animation);
        this.rigidBody = this.node.getComponent(cc.RigidBody);
        this.collider = this.node.getComponent(cc.PhysicsBoxCollider);
        this.HP_bar = this.node.children[0].getComponents(cc.ProgressBar)[0];
        this.Shield_bar = this.node.children[0].getComponents(cc.ProgressBar)[1];
        this.animstate = "slime_idle";
        this.state = "slime";
    }

    start() {
        this.init();
        this.AI = new A_Star_Slime();
    }

    update(dt) {
        this.find_target(dt);

        // caculate attack time
        this.attack_counter = this.attack_counter > dt ? this.attack_counter - dt : 0;

        // caculate scaleX
        if(this.state == "slime") this.node.scaleX = this.direction.x > 0 ? 2 : -2;
        else this.node.scaleX = this.direction.x > 0 ? -2 : 2;
        this.updateHPBar();


        // calculate displacement (depends on direction and speed)
        if (this.direction.x && !this.isDead && !this.isAttacking && !this.getHitting && !this.isTransfroming && !this.isSmashing && !this.isSpelling) this.node.x += this.direction.x * this.speed.x * dt;
        if (this.direction.y && !this.isDead && !this.isAttacking && !this.getHitting && !this.isTransfroming && !this.isSmashing && !this.isSpelling) this.node.y += this.direction.y * this.speed.y * dt;

        // refresh state (depends on x direction)
        let newState = "";
        if (this.isDead) newState = "demon_death";
        else if (this.isTransfroming) newState = "transform";
        else if (this.getHitting) {
            if (this.state == "slime") newState = "slime_damage";
            else newState = "demon_damage";
        } else if (this.isSpelling) newState = "demon_spell";
        else if (this.isSmashing) newState = "demon_smash"; 
        else if (this.isAttacking) newState = "demon_attack";
        else if (this.direction.x || this.direction.y) {
            if (this.state == "slime") newState = "slime_move";
            else newState = "demon_walk";
        } else {
            if (this.state == "slime") newState = "slime_idle";
            else newState = "demon_idle";
        }
        this.setanimState(newState);

        //smashCD
        this.smashCD_controll(dt);
        //spellCD
        this.spellCD_controll(dt);
    }

    smashCD_controll(dt){
        if(!this.isSmashing&&this.state == "demon"){
            this.smashCD += dt;
            if(this.smashCD>=7 && !this.isAttacking && !this.isSpelling && !this.isDead){
                this.isSmashing = true;
                this.collider.enabled = false;
                this.scheduleOnce(()=>{
                    this.node.runAction(cc.moveTo(1,cc.v2(this.target.position.x,this.target.position.y)));
                    
                },0.5);
                this.scheduleOnce(()=>{
                    cc.audioEngine.playEffect(this.smash_effect,false);
                },1);
                this.scheduleOnce(()=>{
                    cc.find("BossSlimeManager").getComponent("BossSlimeManager").camera_shake();
                    
                },1.7);
                this.scheduleOnce(()=>{
                    this.isSmashing = false;
                    this.collider.enabled = true;
                },2.7);
            }
        }else{
            this.smashCD = 0;
        }
    }
    spellCD_controll(dt){
        if(!this.isSpelling&&this.state == "demon"){
            this.spellCD += dt;
            if(this.spellCD>=10 && !this.isAttacking && !this.isSmashing && !this.isDead){
                this.isSpelling = true;
                //call mobs spawn
                this.scheduleOnce(()=>{
                    this.mob_spawn();
                },0.5);
                this.scheduleOnce(()=>{
                    this.mob_spawn();
                },1);
                this.scheduleOnce(()=>{
                    this.mob_spawn();
                },1.5);
                this.scheduleOnce(()=>{
                    this.isSpelling = false;
                },1.86);
            }
        }else{
            this.spellCD = 0;
        }
    }
    mob_spawn(){
            let newmob = cc.instantiate(this.monster);
            newmob.getComponent(newmob.name).target = this.target;
            newmob.setPosition(this.node.position);
            cc.find("Canvas/New Node").addChild(newmob);
    }
    updateHPBar() {
        this.HP_bar.progress = this.HP_val / this.HP;
        this.HP_bar.reverse = this.node.scaleX != 2;
        this.Shield_bar.progress = this.Shield_val / this.Shield;
        this.Shield_bar.reverse = this.node.scaleX != 2;
    }

    setanimState(newState: string) {
        if (this.animstate == newState) return;
        console.log(newState);
        this.animation.stop();
        this.animation.play(newState);
        this.animstate = newState;
    }

    init() {
        this.isDead = false;
        this.HP_val = this.HP;
        this.Shield_val = this.Shield;
    }

    dead() {
        this.isDead = true;
        cc.find("Data").getComponent("Data").total_boss_killed += 1;
        let Data = cc.find("Data").getComponent("Data");
        let coin_random = 30;
        let new_coin = [];
        for (let i = 0; i < coin_random; i++) {
            console.log(Data.coin_num);
            if (Data.coin_num > 0) {
                new_coin[i] = Data.coin_pool.get();
                Data.coin_num--;
            }
            else {
                new_coin[i] = cc.instantiate(Data.coin_prefab);
            }
            new_coin[i].setPosition(this.node.x, this.node.y);
        }
        this.scheduleOnce(() => {
            this.node.destroy();
            let portol = cc.instantiate(this.transporter);
            portol.setPosition(cc.v2(0,0));
            cc.find("Canvas/New Node").addChild(portol);
            for (let i = 0; i < coin_random; i++) {
                cc.find("Canvas/New Node").addChild(new_coin[i]);
                new_coin[i].runAction(cc.moveTo(0.2, cc.v2(this.node.x + Math.floor(Math.random() * 50 - 25), this.node.y + Math.floor(Math.random() * 25))));
            }
        }, 3.1);
    }

    damage(damage_val: number, ...damage_effect: Array<string>) {
        cc.find("Data").getComponent("Data").damage_made += damage_val;
        // damage_val 代表受到傷害的量值 型別為number
        // damage_effect 代表受到傷害的效果 型別為string array
        if (this.Shield_val > 0) {
            // slime扣血
            if (this.Shield_val > damage_val) {
                this.Shield_val = this.Shield_val - damage_val;
                this.getHitting = true;
                this.scheduleOnce(() => {
                    this.getHitting = false;
                }, 0.6);
            } else {
                this.Shield_val = 0;
                this.isTransfroming = true;
                this.node.anchorY = 0.2;
                this.collider.size = cc.size(32, 64);
                this.collider.offset = cc.v2(0, 14);
                this.collider.apply();
                this.state = "demon";
                this.scheduleOnce(() => {
                    this.isTransfroming = false;
                }, 5);
            }
        }
        else {
            // 扣血量
            if (!this.isTransfroming && !this.isDead) {
                this.isAttacking = false;
                this.isSmashing = false;
                this.isSpelling = false;
                this.HP_val = this.HP_val > damage_val ? this.HP_val - damage_val : 0;
                if (this.HP_val > 0) {
                    this.getHitting = true;
                    this.scheduleOnce(() => {
                        this.getHitting = false;
                    }, 0.9);
                }
                else {
                    this.dead();
                }
            }

        }
    }

    attack() {
        if (this.state == "demon" && !this.isSmashing && !this.isAttacking && !this.isDead && !this.isSpelling && !this.isTransfroming) {
            this.isAttacking = true;
            this.attack_counter = this.attack_colddown;
            this.scheduleOnce(() => {
                this.isAttacking = false;
                // this.setanimState("idle");
            }, this.attack_time);
            
            this.scheduleOnce(() => {
                if (this.isAttacking) {
                    let blade = cc.instantiate(this.blade);
                    blade.setPosition(cc.v2(this.node.position.x - this.node.width / 4 * this.node.scaleX/2, this.node.position.y));
                    blade.setContentSize(cc.size(this.node.width * 2 / 3, this.node.height));
                    blade.getComponent(cc.PhysicsBoxCollider).size = cc.size(this.node.width * 2 / 3, this.node.height);
                    blade.getComponent("blade").duration_time = this.attack_time - this.attack_delay;
                    blade.getComponent("blade").damage_val = this.attack_damage;
                    cc.find("Canvas").addChild(blade);
                    cc.audioEngine.playEffect(this.attack_effect,false);
                }
            }, this.attack_delay);
        }

    }

    find_target(dt) {
        this.target_time = this.target_time > dt ? this.target_time - dt : 0;
        if (this.target_time == 0) {
            this.target_time = this.target_colddown;
            this.target = null;
            let mn = -1, mn_val = this.target_distance; // mn代表最近player的index, mn_val代表最近player距離當前節點的距離
            for (let i = 0; i < this.target_set.childrenCount; i++) {
                if (this.target_set.children[i].group == 'player') {
                    let distance = Math.sqrt(Math.pow(this.target_set.children[i].position.x - this.node.position.x, 2) +
                        Math.pow(this.target_set.children[i].position.y - this.node.position.y, 2));
                    if (distance < mn_val) {
                        mn = i;
                        mn_val = distance;
                    }
                }
            }
            if (mn != -1) {
                this.target = this.target_set.children[mn];
                if (this.isAttacking || this.isDead || this.getHitting || this.isTransfroming || this.isSmashing || this.isSpelling) return;
                let x_diff = this.target.position.x - this.node.position.x;
                let y_diff = this.target.position.y - this.node.position.y;
                let distance = Math.sqrt(Math.pow(x_diff, 2) + Math.pow(y_diff, 2));
                let dir = this.AI.search(this.node.position.sub(cc.v3(this.collider.size.width / 2, 0, 0)), this.target.position);
                if (dir == null) {
                    this.direction.x = (this.target.position.x - this.node.position.x) / distance;
                    this.direction.y = (this.target.position.y - this.node.position.y) / distance;
                }
                else {
                    this.direction = dir;
                }
            }
            if (cc.isValid(this.target)) {
                if (this.isAttacking || this.isDead || this.getHitting) return;
                let x_diff = this.target.position.x - this.node.position.x;
                let y_diff = this.target.position.y - this.node.position.y;
                let distance = Math.sqrt(Math.pow(x_diff, 2) + Math.pow(y_diff, 2));
                if (distance < this.attack_distance && this.attack_counter == 0 && Math.abs(y_diff) < 25) {
                    if(this.state == "demon") this.attack();
                }
            }
        }
    }
}
