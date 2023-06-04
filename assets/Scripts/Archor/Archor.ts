const {ccclass, property} = cc._decorator;
const Input = {};

@ccclass
export default class Archor extends cc.Component {
    @property(cc.Prefab)
    Arrow: cc.Prefab = null;
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
    private state: string = "";
    private isBegin: boolean = false;
    private space_press: boolean = false;
    private isDashing: boolean = false;
    private isAttacking: boolean = false;
    private getHitting: boolean = false;
    private isDead: boolean = false;

    private dashAction: any;

    public mousePos: any;


    onLoad(){
        this.sprite = this.node.getComponent(cc.Sprite);
        this.animation = this.node.getComponent(cc.Animation);
        this.rigidBody = this.node.getComponent(cc.RigidBody);
        this.collider = this.node.getComponent(cc.PhysicsBoxCollider);
        this.HP = 100;
        this.speed = cc.v2(200, 160);
        this.direction = cc.v2(0, 0);
        this.state = "stand";
    }

    start(){
        cc.systemEvent.on("keydown", this.onKeyDown, this);
        cc.systemEvent.on("keyup", this.onKeyUp, this);
        cc.find("Canvas/Main Camera").on(cc.Node.EventType.MOUSE_DOWN, this.attack, this);
    }

    update(dt){
        // attack is prior to dash
        if(this.isDashing && this.isAttacking) this.node.stopAction(this.dashAction);
        
        // If is dashing or attacking, player cannot do anything else.
        if(this.isDashing || this.isAttacking)  return; 

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
        if(event.keyCode == cc.macro.KEY.space){
            // handle dash
            if(!this.space_press && !this.isDashing){
                this.space_press = true;
                this.dash();
            }
        }
        else Input[event.keyCode] = 1;
    }

    onKeyUp(event){
        if(event.keyCode == cc.macro.KEY.space){
            this.space_press = false;
        }
        else Input[event.keyCode] = 0;
    }

    setState(newState: string){
        if(this.state == newState)  return;

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
        console.log("Archor is dashing");
        let direction = cc.v2(0, 0);

        this.isDashing = true;
        this.setState("dash");
        if(!this.direction.x && !this.direction.y) direction = cc.v2(this.node.scaleX, 0);
        else direction = cc.v2(this.direction.x, this.direction.y);
        
        this.dashAction = cc.moveBy(0.5, direction.x * 200, direction.y * 200);
        this.node.runAction(this.dashAction);
        this.scheduleOnce(()=>{
            this.isDashing = false;
            this.setState("stand");
        }, 0.5)
    }

    attack(event){
        if(this.isAttacking) return;

        this.mousePos = event.getLocation();
        let distance: number;
        let direction = cc.v2(0, 0);
        direction = cc.v2(this.mousePos.x - 480 - this.node.position.x, this.mousePos.y - 320 - this.node.position.y);
        distance = Math.sqrt(Math.pow(direction.x, 2) + Math.pow(direction.y, 2));
        direction = cc.v2(direction.x / distance, direction.y / distance);

        if(direction.x >= 0) this.node.scaleX = 1;
        else this.node.scaleX = -1;

        this.isAttacking = true;
        this.setState("attack");

        this.scheduleOnce(()=>{
            const arrow = cc.instantiate(this.Arrow);
            arrow.setPosition(cc.v2(this.node.position.x, this.node.position.y));
            cc.find("Canvas/New Node").addChild(arrow);
        }, 0.5)

        this.scheduleOnce(()=>{
            this.setState("stand");
            this.isAttacking = false;
        }, 1)
    }

    damage(damage_val: number, ...damage_effect: Array<string>){
        this.HP -= damage_val;
    }
}
