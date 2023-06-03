const {ccclass, property} = cc._decorator;

@ccclass
export default class Arrow extends cc.Component {
    @property(cc.SpriteFrame)
    half_arrow: cc.SpriteFrame = null;

    onLoad(){
        this.node.getComponent(cc.Animation).play("arrow");
    }

    start () {
        const archor = cc.find("Canvas/New Node/Archor");
        const mousePos = archor.getComponent("Archor").mousePos;
        let distance: number;
        let direction = cc.v2(0, 0);
        let rotation: number;

        direction = cc.v2(mousePos.x - 480 - archor.position.x, mousePos.y - 320 - archor.position.y);
        distance = Math.sqrt(Math.pow(direction.x, 2) + Math.pow(direction.y, 2));
        direction = cc.v2(direction.x / distance, direction.y / distance);
        rotation = Math.atan(direction.y / direction.x) * (180 / Math.PI);

        if(direction.x >= 0) this.node.angle = rotation;
        else this.node.angle = rotation + 180;
        
        this.node.getComponent(cc.RigidBody).linearVelocity = cc.v2(direction.x * 100, direction.y * 100);
    }

    // update (dt) {}
    onBeginContact(contact, self, other){
        if(other.node.group == "default"){
            this.node.getComponent(cc.PhysicsBoxCollider).enabled = false;
            this.node.getComponent(cc.PhysicsBoxCollider).apply();
            this.node.getComponent(cc.Animation).stop();
            this.node.getComponent(cc.Sprite).spriteFrame = this.half_arrow;
            this.scheduleOnce(()=>{
                this.node.getComponent(cc.RigidBody).linearVelocity = cc.v2(0, 0);
            }, 0.01);
            this.scheduleOnce(()=>{
                this.node.runAction(cc.fadeOut(3));
            }, 2)
            this.scheduleOnce(()=>{
                this.node.destroy();
            }, 5)
        }

        if(other.node.group == "enemy"){
            this.node.getComponent(cc.RigidBody).linearVelocity = cc.v2(0, 0);
            this.node.destroy();
        }
    }
    
}
