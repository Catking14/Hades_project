const {ccclass, property} = cc._decorator;

@ccclass
export default class IceArrow extends cc.Component {
    @property(cc.Node)
    target_set: cc.Node = null;

    @property(cc.Prefab)
    iceArrowCrashEffect: cc.Prefab = null;

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
        
        this.target_set = cc.find("Canvas/New Node");
    }

    start(){
        this.node.getComponent(cc.RigidBody).linearVelocity = cc.v2(this.direction.x * 80, this.direction.y * 80);
    }

    update (dt) {
        
    }
    
    onBeginContact(contact, self, other){
        if(other.node.group == "enemy"){
            this.node.getComponent(cc.RigidBody).linearVelocity = cc.v2(0, 0);
            this.node.getComponent(cc.RigidBody).enabledContactListener = false;
            this.node.getComponent(cc.PhysicsBoxCollider).enabled = false;
            this.node.getComponent(cc.PhysicsBoxCollider).apply();

            let collide_pos = contact.getWorldManifold().points[0];
            for (let i = 0; i < this.target_set.childrenCount; i++) {
                if (this.target_set.children[i].group == "enemy") {
                    let child = this.target_set.children[i];
                    let child_pos = child.position;
                    child_pos = this.target_set.convertToWorldSpaceAR(child_pos);
                    let distance = Math.sqrt(Math.pow(child_pos.x - collide_pos.x, 2) + Math.pow(child_pos.y - collide_pos.y, 2));
        
                    if(distance <= 100){
                        console.log("find_target");
                        child.getComponent(child.name).damage(cc.find("Canvas/New Node/Archor").getComponent("Archor").dmg * 1.5);
                        let tmp: any;
                        tmp = child.getComponent(child.name).speed;
                        child.getComponent(child.name).speed = cc.v2(0, 0);
                        child.getComponent(child.name).scheduleOnce(()=>{
                            child.getComponent(child.name).speed = cc.v2(tmp.x, tmp.y);
                        }, 5)
                    }
                }
            }
        }

        const ice_arrow_crash_effect = cc.instantiate(this.iceArrowCrashEffect);
        ice_arrow_crash_effect.setPosition(cc.find("Canvas/Main Camera").convertToNodeSpaceAR(contact.getWorldManifold().points[0]));
        cc.find("Canvas/Main Camera").addChild(ice_arrow_crash_effect);
        this.node.destroy();
    }
}
