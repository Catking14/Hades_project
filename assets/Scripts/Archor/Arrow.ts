const {ccclass, property} = cc._decorator;

@ccclass
export default class Arrow extends cc.Component {
    @property(cc.SpriteFrame)
    half_arrow: cc.SpriteFrame = null;

    private direction = cc.v2(0, 0);
    private in_wall: boolean = false;

    private Number_of_Hit: number = 0;

    onLoad(){
        this.node.getComponent(cc.Animation).play("arrow");

        const mousePos = cc.find("Canvas/New Node/Archor").getComponent("Archor").mousePos;

        let distance: number;
        let rotation: number;

        this.direction = cc.v2(mousePos.x - 480, mousePos.y - 320);
        distance = Math.sqrt(Math.pow(this.direction.x, 2) + Math.pow(this.direction.y, 2));
        this.direction = cc.v2(this.direction.x / distance, this.direction.y / distance);
        rotation = Math.atan(this.direction.y / this.direction.x) * (180 / Math.PI);

        if(this.direction.x >= 0) this.node.angle = rotation;
        else this.node.angle = rotation + 180;

        this.Number_of_Hit = 0;
    }

    start(){
        this.node.getComponent(cc.RigidBody).linearVelocity = cc.v2(this.direction.x * 150, this.direction.y * 150);
    }

    update (dt) {
        if(this.Number_of_Hit == 3) this.node.destroy();
        if(this.in_wall) this.node.getComponent(cc.RigidBody).type = cc.RigidBodyType.Static;
    }
    
    onBeginContact(contact, self, other){
        if(other.node.group == "default"){
            this.in_wall = true;
            this.node.getComponent(cc.RigidBody).linearVelocity = cc.v2(0, 0);
            this.node.getComponent(cc.RigidBody).enabledContactListener = false;
            this.node.getComponent(cc.PhysicsBoxCollider).enabled = false;
            this.node.getComponent(cc.PhysicsBoxCollider).apply();
            this.node.getComponent(cc.Animation).stop();
            this.node.getComponent(cc.Sprite).spriteFrame = this.half_arrow;
            this.node.runAction(cc.moveBy(0.01, cc.v2(this.direction.x * 10, this.direction.y * 10)));

            this.scheduleOnce(()=>{
                this.node.runAction(cc.fadeOut(3));
            }, 2)
            this.scheduleOnce(()=>{
                this.node.destroy();
            }, 5);
        }

        if(other.node.group == "enemy"){
            contact.disabled = true;
            let damage = cc.find("Canvas/New Node/Archor").getComponent("Archor").dmg;
            other.node.getComponent(other.node.name).damage(damage);
            if(this.Number_of_Hit == 0){
                this.schedule(()=>{
                    this.node.destroy();
                }, 0.2)
            }
            this.Number_of_Hit++;
        }
    }
}
