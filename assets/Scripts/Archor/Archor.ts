const {ccclass, property} = cc._decorator;
const Input = {};

@ccclass
export default class Archor extends cc.Component {
    @property(cc.Prefab)
    Arrow: cc.Prefab = null;
    @property(cc.Prefab)
    IceArrow: cc.Prefab = null;
    @property
    HP: number = 100;
    @property(cc.v2)
    speed = cc.v2(0, 0);
    @property(cc.v2)
    direction = cc.v2(0, 0);

    private sprite: cc.Sprite;
    private animation: cc.Animation;
    private rigidBody: cc.RigidBody;
    private collider: cc.PhysicsBoxCollider;
    private HP_bar: cc.ProgressBar;
    private state: string = "";
    private isBegin: boolean = false;
    private canDash: boolean = false;
    private isDashing: boolean = false;
    private getHitting: boolean = false;
    private isDead: boolean = false;

    // auto attack
    private isAttacking: boolean = false;
    private attack_speed: number = 0.67;

    // ultimate
    private canUltimate: boolean = true;
    private isUltimate: boolean = false;
    private Ultimating: boolean = false;
    private Ultimate_CD: number = 30;
    private Ultimate_last: number = 7;

    private dashAction: any;

    public cur_HP: number;
    public mousePos: any;


    onLoad(){
        this.sprite = this.node.getComponent(cc.Sprite);
        this.animation = this.node.getComponent(cc.Animation);
        this.rigidBody = this.node.getComponent(cc.RigidBody);
        this.collider = this.node.getComponent(cc.PhysicsBoxCollider);
        this.HP_bar = this.node.getChildByName("HP_Bar").getComponent(cc.ProgressBar);
        this.HP = 100;
        this.cur_HP = this.HP;
        this.speed = cc.v2(200, 160);
        this.direction = cc.v2(0, 0);
        this.state = "stand";
    }

    start(){
        cc.systemEvent.on("keydown", this.onKeyDown, this);
        cc.systemEvent.on("keyup", this.onKeyUp, this);
        cc.find("Canvas/Main Camera").on(cc.Node.EventType.MOUSE_DOWN, this.auto_attack, this);
        cc.find("Canvas/Main Camera").on(cc.Node.EventType.MOUSE_DOWN, this.ultimate, this);
    }

    update(dt){
        console.log("canUltimate: " + this.canUltimate, "isUltimate: " + this.isUltimate, "Ultimating: " + this.Ultimating);
        // When attack or getHit or dead, interrupt dashing
        if(this.isDashing && (this.isAttacking || this.Ultimating || this.getHitting || this.isDead)) this.node.stopAction(this.dashAction);
        
        // If is dashing or attacking or getHit, player cannot do anything else.
        if(this.isDashing || this.isAttacking || this.Ultimating || this.getHitting || this.isDead)  return; 

        // handle up and down 
        if(Input[cc.macro.KEY.w]){
            this.direction.y = 1;
        }else if(Input[cc.macro.KEY.s]){
            this.direction.y = -1;
        }else   this.direction.y = 0;

        // handle left and right
        if(Input[cc.macro.KEY.a]){
            this.direction.x = -1;
            this.node.scaleX = -1;
        }else if(Input[cc.macro.KEY.d]){
            this.direction.x = 1;
            this.node.scaleX = 1;
        }else   this.direction.x = 0;
        
        this.HP_bar.reverse = this.node.scaleX != 1;

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
                this.canUltimate = false;
                this.isUltimate = true;
                this.Ultimate_last_timer();
                this.scheduleOnce(()=>{
                    this.canUltimate = true;
                }, this.Ultimate_CD)
            } 
        }else if(event.keyCode == cc.macro.KEY.space){
            // handle dash
            if(!this.canDash && !this.isDashing){
                this.canDash = true;
                this.dash();
            }
        }
        else Input[event.keyCode] = 1;
    }

    onKeyUp(event){
        if(event.keyCode == cc.macro.KEY.q){

        }else if(event.keyCode == cc.macro.KEY.space){
            this.canDash = false;
        }
        else Input[event.keyCode] = 0;
    }

    setState(newState: string){
        if(this.state == newState)  return;
        console.log(newState);
        this.animation.stop();
        this.animation.play("archor_" + newState);
        this.state = newState;

        // if(this.state == "stand"){
            
        // }else if(this.state == "run"){
            
        // }else if(this.state == "dash"){
            
        // }else if(this.state == "attack"){
            
        // }else if(this.state == "getHit"){
            
        // }else if(this.state == "death"){
            
        // }
    }

    dash(){
        if(this.isDashing || this.isAttacking || this.Ultimating || this.getHitting || this.isDead) return;

        let direction = cc.v2(0, 0);
        this.isDashing = true;
        this.setState("dash");
        if(!this.direction.x && !this.direction.y) direction = cc.v2(this.node.scaleX, 0);
        else direction = cc.v2(this.direction.x, this.direction.y);
        
        this.dashAction = cc.moveBy(0.5, direction.x * 200, direction.y * 200);
        this.node.runAction(this.dashAction);
        this.scheduleOnce(()=>{
            this.isDashing = false;
        }, 0.5)
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
        this.HP_bar.reverse = this.node.scaleX != 1;

        this.isAttacking = true;
        this.setState("attack");

        this.scheduleOnce(()=>{
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
        this.HP_bar.reverse = this.node.scaleX != 1;

        this.setState("attack");

        this.scheduleOnce(()=>{
            const icearrow = cc.instantiate(this.IceArrow);
            icearrow.setPosition(cc.v2(0, 0));
            cc.find("Canvas/Main Camera").addChild(icearrow);
            this.Ultimating = false;
        }, 0.67)
    }

    Ultimate_last_timer(){
        this.Ultimate_last = 7;
        this.schedule(function timer(){
            this.Ultimate_last -= 1;
            console.log(this.Ultimate_last);
            if(this.Ultimate_last <= 0){
                this.isUltimate = false;
                this.unschedule(timer);
            }
        }, 1)
    }

    damage(damage_val: number, ...damage_effect: Array<string>) {
        // damage_val 代表受到傷害的量值 型別為number
        // damage_effect 代表受到傷害的效果 型別為string array
        // 扣血量
        this.cur_HP = this.cur_HP > 50 ? this.cur_HP - 50 : 0;
        if (this.cur_HP > 0) {
            this.getHitting = true;
            this.setState("getHit");
            this.HP_bar.progress = this.cur_HP / this.HP;
            this.scheduleOnce(() => {
                this.setState("stand");
                this.getHitting = false;
            }, 0.3);
        } else {
            this.isDead = true;
            this.setState("death");
            this.scheduleOnce(() => {
                console.log("die");
                this.node.destroy();
            }, 1);
        }
    }
}
