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

    @property(cc.Prefab)
    ultimatePrefab: cc.Prefab = null;

    @property(cc.Prefab)
    blood: cc.Prefab = null;

    @property(cc.AudioClip)
    hit_sound_effect: cc.AudioClip = null;
    @property(cc.AudioClip)
    attack_sound_effect: cc.AudioClip = null;
    @property(cc.AudioClip)
    spell_sound_effect: cc.AudioClip = null;

    @property
    move_speed: cc.Vec2 = cc.v2(200, 160);

    @property
    dash_speed: cc.Vec2 = cc.v2(1000, 800);

    HP: number = 100;
    HP_max: number = 100;
    money: number = 0;
    heal: number = 0;

    _blood_pool: cc.NodePool = null;
    _ultimate_cd: number = 10;
    _dash_ready: boolean = true;
    _ultimate: boolean = true;
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
    private ishit: boolean = false;
    private isultCD: boolean = true;
    //keys
    private upbtn: boolean = false;      //key for up
    private downbtn: boolean = false;    //key for down
    private leftbtn: boolean = false;    //key for left
    private rightbtn: boolean = false;   //key for right
    private dashbtn: boolean = false;    //key for dash
    private ultbtn: boolean = false;      //key for ult
    //CD
    private ultCD: number = 0;
    private dashCD: number = 1;
    //other
    private mouse_Pos;
    // LIFE-CYCLE CALLBACKS:


    onLoad() {
        this.anim = this.node.getComponent(cc.Animation);
        this.animstate = this.anim.getAnimationState('wizard_idle');
    }

    start() {
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
        cc.find("Canvas/Main Camera").on(cc.Node.EventType.MOUSE_DOWN, this.fire, this);
        cc.find("Canvas/Main Camera").on(cc.Node.EventType.MOUSE_MOVE, this.get_mousePos, this);
        this.scheduleOnce(() => {
            this._ultimate = false;
        }, 0.1);

    }
    get_mousePos(event) {
        this.mouse_Pos = event.getLocation();
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
                if (!this.dashbtn && this._dash_ready) {
                    this.dashbtn = true;
                    this.dash();
                    this.scheduleOnce(() => { this._dash_ready = true; }, this.dashCD);
                }
                break;
            case cc.macro.KEY.q:
                if (!this.isultCD) {
                    this.ultbtn = true;
                    this.isultCD = true;
                    this.ultimate();
                }
                break;
            case cc.macro.KEY.e:
                let heal_level = cc.find("Data").getComponent("Data").heal;

                if (this.heal == 100 - heal_level) {
                    this.healing();
                }
                break;
                break;
        }
    }
    healing() {
        if (this.HP < this.HP_max) {
            this.heal = 0;
            this.HP = this.HP + 25 > this.HP_max ? this.HP_max : this.HP + 25;
        }
    }
    ultimate() {
        if (this.isfiring) return;
        this.isfiring = true;
        this._ultimate = true;
        // break dash if fire
        if (this.isdashing) this.isdashing = false;
        console.log("explosion");
        const explosion = cc.instantiate(this.ultimatePrefab);
        let camerapos = cc.find("Canvas/Main Camera").position;
        console.log(this.mouse_Pos);
        console.log(camerapos);
        let position = cc.v2(this.mouse_Pos.x + camerapos.x - 480 - this.node.position.x, this.mouse_Pos.y + camerapos.y - 320 - this.node.position.y)
        this.anim.stop();
        this.animstate = this.anim.play("wizard_attack1");
        cc.audioEngine.playEffect(this.spell_sound_effect, false);
        explosion.setPosition(cc.v2(position.x * this.face_dir, position.y));
        this.node.addChild(explosion);
        this.anim.on('finished', () => {
            this.isfiring = false;
            this._ultimate = false;
        }, this);

    }
    onKeyUp(event) {
        switch (event.keyCode) {
            case cc.macro.KEY.w:
                this.upbtn = false;
                this.move_dir.y = 0;
                break;
            case cc.macro.KEY.a:
                this.leftbtn = false;
                this.move_dir.x = 0;
                break;
            case cc.macro.KEY.s:
                this.downbtn = false;
                this.move_dir.y = 0;
                break;
            case cc.macro.KEY.d:
                this.rightbtn = false;
                this.move_dir.x = 0;
                break;
            case cc.macro.KEY.space:
                this.dashbtn = false;
                break;
        }
    }
    private fire(event) {
        if (this.isfiring|| cc.find("Data").getComponent("Data").in_shop) return;
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
        cc.audioEngine.playEffect(this.attack_sound_effect, false);
        this.scheduleOnce(() => {
            fireball.setPosition(cc.v2(20, 0));
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
            this._dash_ready = false;
            if (this.move_dir.x == 0 && this.move_dir.y == 0) {
                this.move_dir.x = this.face_dir;
                // console.log(this.move_dir);
            }
            // play dash animation
            this.anim.stop();
            this.animstate = this.anim.play("wizard_dash");
            this.scheduleOnce(() => {
                this.isdashing = false;
                // this._dash_ready = true;
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
            }

        }
    }
    private playerAnimation() {
        if (this.isdead) {
        } else if (this.ishit) {
        } else if (this.isfiring || this.isdashing) {
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

        //ultCD
        // this.schedule(this.ultCD_controll, 1);
        this.ultCD_controll(dt);
    }
    ultCD_controll(dt) {
        // console.log(this.isultCD, this.ultCD);
        if (this.isultCD) {
            this.ultCD = this.ultCD + dt;
            if (this.ultCD >= 10) this.isultCD = false;
            else this.isultCD = true;
        } else {
            this.ultCD = 0;
        }
    }
    damage(damage_val: number, ...damage_effect: Array<string>) {
        // damage_val 代表受到傷害的量值 型別為number
        // damage_effect 代表受到傷害的效果 型別為string array
        // 扣血量
        let blood_effect = cc.instantiate(this.blood);
        blood_effect.setPosition(this.node.x, this.node.y);
        blood_effect.scaleX = Math.random() > 0.5 ? 1 : -1;
        this.HP = this.HP > damage_val ? this.HP - damage_val : 0;
        if (this.HP > 0) {
            if (!this.ishit) {
                this.ishit = true;
                this.animstate = this.anim.play("wizard_hit");
                
                // let blood_effect = this._blood_pool.get();

                
                // blood_effect.getComponent("Blood")._blood_node_pool = this._blood_pool;

                cc.audioEngine.playEffect(this.hit_sound_effect, false);
                cc.find("Game Manager").getComponent("GameManager").camera_shake();
                this.scheduleOnce(() => {
                    this.ishit = false;
                }, 0.5);
            }

        } else {
            this.isdead = true;
            this.animstate = this.anim.play("wizard_death");
            blood_effect.getComponent("Blood").die = true;
            this.scheduleOnce(() => {
                console.log("die");
                // this.node.destroy();
                if(cc.director.getScene().name == "BossSlime" || cc.director.getScene().name == "BossBeholder") cc.find("BossSlimeManager").getComponent("BossSlimeManager").player_die();
                else cc.find("Game Manager").getComponent("GameManager").player_die();
            }, 1);
        }
        cc.find("Canvas/New Node").addChild(blood_effect);
    }
}