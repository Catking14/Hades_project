const {ccclass, property} = cc._decorator;
const Input = {};

@ccclass
export default class Archor extends cc.Component {

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
    private isDashing: boolean = false;
    private isAttacking: boolean = false;
    private getHitting: boolean = false;
    private isDead: boolean = false;


    onLoad(){
        this.sprite = this.node.getComponent(cc.Sprite);
        this.animation = this.node.getComponent(cc.Animation);
        this.rigidBody = this.node.getComponent(cc.RigidBody);
        this.collider = this.node.getComponent(cc.PhysicsBoxCollider);
        
        this.HP = 100;
        this.speed = cc.v2(70, 40);
        this.direction = cc.v2(0, 0);
        this.state = "stand";
    }

    start(){
        cc.systemEvent.on("keydown", this.onKeyDown, this);
        cc.systemEvent.on("keyup", this.onKeyUp, this);
        cc.find("Canvas/Main Camera").on(cc.Node.EventType.MOUSE_DOWN, this.attack, this);
    }

    update(dt){
        // If is dashing, player cannot do anything else.
        if(this.isDashing || this.isAttacking)  return; 

        // handle dash
        if(Input[cc.macro.KEY.space] && !this.isDashing){
            this.dash();
        }

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
        if(this.isDashing)  newState = "dash";
        else if(this.direction.x || this.direction.y) newState = "run";
        else    newState = "stand";
        this.setState(newState);
    }


    setState(newState: string){
        if(this.state == newState)  return;

        this.animation.stop();
        this.animation.play("viking_" + newState);
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
        console.log("Viking is dashing");
        this.isDashing = true;
        this.node.runAction(cc.moveBy(0.5, this.node.scaleX * 50, this.direction.y * 50));
        this.scheduleOnce(()=>{
            this.isDashing = false;
            this.setState("stand");
        }, 0.5)
    }

    attack(event){
        if(this.isAttacking) return;

        // const mousePos = event.getLocation();
        // const arrow = cc.instantiate(this.Arrow);
        // let distance;
        // let direction = cc.v2(0, 0);
        // let rotation: number;

        // direction = cc.v2(mousePos.x - 480 - this.node.position.x, mousePos.y - 320 - this.node.position.y);
        // distance = Math.sqrt(Math.pow(direction.x, 2) + Math.pow(direction.y, 2));
        // direction = cc.v2(direction.x / distance, direction.y / distance);
        // rotation = Math.atan(direction.y / direction.x) * (180 / Math.PI);
        // if(direction.x >= 0){
        //     arrow.angle = rotation;
        //     this.node.scaleX = 1;
        // }else{
        //     arrow.angle = rotation + 180;
        //     this.node.scaleX = -1;
        // }
        this.isAttacking = true;
        this.setState("a1");

        // this.scheduleOnce(()=>{
        //     arrow.setPosition(cc.v2(this.node.position.x, this.node.position.y));
        //     cc.find("Canvas/New Node").addChild(arrow);
        //     arrow.runAction(cc.moveBy(1, cc.v2(direction.x * 100, direction.y * 100)));
        // }, 0.5)

        this.scheduleOnce(()=>{
            this.setState("stand");
            this.isAttacking = false;
        }, 1)
    }

    
    onKeyDown(event){ Input[event.keyCode] = 1; }
    onKeyUp(event){ Input[event.keyCode] = 0; }
}
