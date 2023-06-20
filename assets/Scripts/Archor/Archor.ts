const {ccclass, property} = cc._decorator;

@ccclass
export default class Archor extends cc.Component {
    @property(cc.Prefab)
    Blood: cc.Prefab = null;
    @property(cc.Prefab)
    Arrow: cc.Prefab = null;
    @property(cc.Prefab)
    IceArrow: cc.Prefab = null;
    
    @property(cc.v2)
    speed = cc.v2(0, 0);
    @property(cc.v2)
    direction = cc.v2(0, 0);

    private sprite: cc.Sprite;
    private animation: cc.Animation;
    private rigidBody: cc.RigidBody;
    private collider: cc.PhysicsBoxCollider;
    private state: string = "";
    private isBegin: boolean = false;
    private getHitting: boolean = false;
    private isDead: boolean = false;

    private Input = {};

    // player status
    private HP: number;
    private HP_max: number = 100;
    private dmg: number = 70;
    private money: number = 0;
    private heal: number = 0;
    

    // dash
    private space_pressed: boolean = false;
    private _dash_ready: boolean = true;
    private _dash_cd: number = 1.5;
    private isDashing: boolean = false;


    private mousePos: any;
    // auto attack
    private isAttacking: boolean = false;
    private attack_speed: number = 0.67;

    // ultimate
    private _ultimate: boolean = false;
    private canUltimate: boolean = true;
    private isUltimate: boolean = false;
    private Ultimating: boolean = false;
    private _ultimate_cd: number = 15;
    private Ultimate_last: number = 5;

    private dashAction: any;

    // Music effects
    @property(cc.AudioClip)
    ultimate_effect: cc.AudioClip = null;
    @property(cc.AudioClip)
    attack_effect: cc.AudioClip = null;
    @property(cc.AudioClip)
    damage_effect: cc.AudioClip = null;
    @property(cc.AudioClip)
    death_effect: cc.AudioClip = null;
    @property(cc.AudioClip)
    dash_effect: cc.AudioClip = null;
    // music ids'
    _Ult: number = null;
    _ATK: number = null;
    _DMG: number = null;
    _DIE: number = null;
    _DASH: number = null;


    onLoad(){
        this.sprite = this.node.getComponent(cc.Sprite);
        this.animation = this.node.getComponent(cc.Animation);
        this.rigidBody = this.node.getComponent(cc.RigidBody);
        this.collider = this.node.getComponent(cc.PhysicsBoxCollider);
        this.HP_max = 100;
        this.HP = this.HP_max;
        this.speed = cc.v2(200, 160);
        this.direction = cc.v2(0, 0);
        this.state = "stand";

        let data = cc.find("Data").getComponent("Data");
        this.HP = data.HP;
        this.HP_max = this.HP;
        this.dmg += data.damage;
        this.money = data.money;
    }

    start(){
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
        cc.find("Canvas/Main Camera").on(cc.Node.EventType.MOUSE_DOWN, this.auto_attack, this);
        cc.find("Canvas/Main Camera").on(cc.Node.EventType.MOUSE_DOWN, this.ultimate, this);
    }

    update(dt){
        //console.log("canUltimate: " + this.canUltimate, "isUltimate: " + this.isUltimate, "Ultimating: " + this.Ultimating);
        // When attack or getHit or dead, interrupt dashing
        if(this.isDashing && (this.isAttacking || this.Ultimating || this.getHitting || this.isDead)) 
            this.node.stopAction(this.dashAction);
        
        // If is dashing or attacking or getHit, player cannot do anything else.
        if(this.isDashing || this.isAttacking || this.Ultimating || this.getHitting || this.isDead)  return; 

        // handle up and down 
        if(this.Input[cc.macro.KEY.w]){
            this.direction.y = 1;
        }else if(this.Input[cc.macro.KEY.s]){
            this.direction.y = -1;
        }else   this.direction.y = 0;

        // handle left and right
        if(this.Input[cc.macro.KEY.a]){
            this.direction.x = -1;
            this.node.scaleX = -1;
        }else if(this.Input[cc.macro.KEY.d]){
            this.direction.x = 1;
            this.node.scaleX = 1;
        }else   this.direction.x = 0;
        

        // calculate displacement (depends on direction and speed)
        if(this.direction.x)    this.node.x += this.direction.x * this.speed.x * dt;
        if(this.direction.y)    this.node.y += this.direction.y * this.speed.y * dt;

        // refresh state (depends on x direction)
        let newState = "";  
        if(this.direction.x || this.direction.y) newState = "run";
        else    newState = "stand";
        this.setState(newState);
    }

    onKeyDown(event){
        if(event.keyCode == cc.macro.KEY.q){
            if(this.canUltimate){
                this._ultimate = true;
                this.canUltimate = false;
                this.isUltimate = true;
                this.Ultimate_last_timer();
                this._Ult = cc.audioEngine.playEffect(this.ultimate_effect, false);
                // cc.audioEngine.setVolume(this._Ult, 0.7)
                this.scheduleOnce(()=>{
                    this._ultimate = false;
                    this.canUltimate = true;
                }, this._ultimate_cd)
            } 
        }else if(event.keyCode == cc.macro.KEY.e){
            let heal_level = cc.find("Data").getComponent("Data").heal;
            if(this.heal == 50 - heal_level) this.healing();
            
        }else if(event.keyCode == cc.macro.KEY.space){
            // handle dash
            if(!this.space_pressed && this._dash_ready){
                this.space_pressed = true;
                this._dash_ready = false;
                this.scheduleOnce(()=>{
                    this._dash_ready = true;
                }, this._dash_cd)
                this.dash();
            }
        }
        else this.Input[event.keyCode] = 1;
    }

    onKeyUp(event){
        if(event.keyCode == cc.macro.KEY.q){

        }else if(event.keyCode == cc.macro.KEY.space){
            this.space_pressed = false;
        }
        else this.Input[event.keyCode] = 0;
    }

    setState(newState: string){
        if(this.state == newState)  return;
        //console.log(newState);
        this.animation.stop();
        this.animation.play("archor_" + newState);
        this.state = newState;
    }

    dash(){
        if(this.isAttacking || this.Ultimating || this.getHitting || this.isDead) return;

        let direction = cc.v2(0, 0);
        this.isDashing = true;
        this.setState("dash");
        if(!this.direction.x && !this.direction.y) direction = cc.v2(this.node.scaleX, 0);
        else direction = cc.v2(this.direction.x, this.direction.y);
        
        this.dashAction = cc.moveBy(0.2, direction.x * 150, direction.y * 150);
        this.node.runAction(this.dashAction);
        // play effect
        this._DASH = cc.audioEngine.playEffect(this.dash_effect, false);
        // cc.audioEngine.setVolume(this._DASH, 0.15);  // dash is a little too quiet
        this.scheduleOnce(()=>{
           this.isDashing = false;
        }, 0.2)
    }

    auto_attack(event){
        if(this.isAttacking || this.isUltimate || this.Ultimating || this.getHitting || this.isDead) return;

        this.mousePos = event.getLocation();
        let distance: number;
        let direction = cc.v2(0, 0);

        direction = cc.v2(this.mousePos.x - 480, this.mousePos.y - 320);
        distance = Math.sqrt(Math.pow(direction.x, 2) + Math.pow(direction.y, 2));
        direction = cc.v2(direction.x / distance, direction.y / distance);


        if(direction.x >= 0) this.node.scaleX = 1;
        else this.node.scaleX = -1;

        this.isAttacking = true;
        this.setState("attack");

        this.scheduleOnce(()=>{
            this._ATK = cc.audioEngine.playEffect(this.attack_effect, false);
            // cc.audioEngine.setVolume(this._ATK, 0.7)
            const arrow = cc.instantiate(this.Arrow);
            arrow.setPosition(cc.v2(0, 0));
            cc.find("Canvas/Main Camera").addChild(arrow);
        }, 0.67)

        this.scheduleOnce(()=>{
            this.isAttacking = false;
        }, this.attack_speed)
    }

    ultimate(event){
        if(this.getHitting || this.isDead) return;
        if(!this.isUltimate)    return;

        this.isUltimate = false;
        this.Ultimating = true;
        
        this.mousePos = event.getLocation();
        let distance: number;
        let direction = cc.v2(0, 0);

        direction = cc.v2(this.mousePos.x - 480, this.mousePos.y - 320);
        distance = Math.sqrt(Math.pow(direction.x, 2) + Math.pow(direction.y, 2));
        direction = cc.v2(direction.x / distance, direction.y / distance);


        if(direction.x >= 0) this.node.scaleX = 1;
        else this.node.scaleX = -1;

        this.setState("attack");

        this.scheduleOnce(()=>{
            const icearrow = cc.instantiate(this.IceArrow);
            icearrow.setPosition(cc.v2(0, 0));
            cc.find("Canvas/Main Camera").addChild(icearrow);
            this.Ultimating = false;
        }, 0.67)
    }

    Ultimate_last_timer(){
        this.schedule(function timer(){
            this.Ultimate_last -= 1;
            if(this.Ultimate_last <= 0){
                this.isUltimate = false;
                this.unschedule(timer);
            }
        }, 1)
    }

    damage(damage_val: number, ...damage_effect: Array<string>) {
        const blood_effect = cc.instantiate(this.Blood);
        blood_effect.setPosition(this.node.x, this.node.y);
        blood_effect.scaleX = Math.random() > 0.5 ? 1 : -1;

        this.HP = this.HP > damage_val ? this.HP - damage_val : 0;
        this._DMG = cc.audioEngine.playEffect(this.damage_effect, false);

        if(this.HP > 0){
            this.getHitting = true;
            this.setState("getHit");
            this.scheduleOnce(() => {
                this.setState("stand");
                this.getHitting = false;
            }, 0.3);
        }else{
            this.isDead = true;
            blood_effect.getComponent("Blood").die = true;
            this.scheduleOnce(() => {
                console.log("die");
                this.die();
            }, 1);
        }
        cc.find("Canvas/New Node").addChild(blood_effect);
    }

    healing(){
        if(this.HP < this.HP_max){
            this.heal = 0;
            this.HP = (this.HP + 25 > this.HP_max) ? this.HP_max : this.HP + 25;
        }
    }

    die()
    {
        // shut down collider to prevent double detection
        this.collider.enabled = false;

        this.isDead = true;
        this.setState("death");
        
        this._DIE = cc.audioEngine.playEffect(this.death_effect, false);

        // destroy when died
        this.scheduleOnce(() => 
        {
            this.node.zIndex -= 5;
            
            try
            {
                cc.find("Game Manager").getComponent("GameManager").player_die();
            }
            catch
            {
                cc.find("BossSlimeManager").getComponent("BossSlimeManager").player_die();
            }

            // store data to DATA node
        cc.find("Data").getComponent("Data").money = this.money;
        }, 1.2);
    }
}
