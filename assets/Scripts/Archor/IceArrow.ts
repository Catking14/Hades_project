// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class IceArrow extends cc.Component {
    @property(cc.SpriteFrame)
    half_ice_arrow: cc.SpriteFrame = null;

    private direction = cc.v2(0, 0);

    onLoad(){
        this.node.getComponent(cc.Animation).play("ice_arrow");

        const mousePos = cc.find("Canvas/New Node/Archor").getComponent("Archor").mousePos;

        let distance: number;
        let rotation: number;

        this.direction = cc.v2(mousePos.x - 480, mousePos.y - 320);
        distance = Math.sqrt(Math.pow(this.direction.x, 2) + Math.pow(this.direction.y, 2));
        this.direction = cc.v2(this.direction.x / distance, this.direction.y / distance);
        rotation = Math.atan(this.direction.y / this.direction.x) * (180 / Math.PI);

        if(this.direction.x >= 0) this.node.angle = rotation;
        else this.node.angle = rotation + 180;
        console.log(this.direction.x, this.direction.y);
    }

    start(){
        this.node.getComponent(cc.RigidBody).linearVelocity = cc.v2(this.direction.x * 80, this.direction.y * 80);
    }

    update (dt) {
        this.node.scaleX = 1;
    }
    onBeginContact(contact, self, other){
        if(other.node.group == "default"){
            this.node.getComponent(cc.PhysicsBoxCollider).size.width = 52;
            this.node.getComponent(cc.PhysicsBoxCollider).enabled = false;
            this.node.getComponent(cc.PhysicsBoxCollider).apply();
            this.node.getComponent(cc.Animation).stop();
            this.node.getComponent(cc.Sprite).spriteFrame = this.half_ice_arrow;
            this.node.getComponent(cc.RigidBody).linearVelocity = cc.v2(0, 0);
            this.scheduleOnce(()=>{
                this.node.runAction(cc.fadeOut(3));
            }, 2)
            this.scheduleOnce(()=>{
                this.node.destroy();
            }, 5);
        }

        if(other.node.group == "enemy"){
            this.node.getComponent(cc.RigidBody).linearVelocity = cc.v2(0, 0);
            other.node.getComponent(other.node.name).damage(50);
            this.node.destroy();
        }
    }
}
