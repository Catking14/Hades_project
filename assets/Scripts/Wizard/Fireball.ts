// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class Fireball extends cc.Component {

    onLoad(){
        this.node.getComponent(cc.Animation).play("fireball_move");
    }

    start () {
        // this.scheduleOnce(()=>{
        //     this.node.destroy();
        // }, 1.5)
        this.scheduleOnce(()=>{
            this.node.scale = 2;
            this.node.getComponent(cc.Animation).stop();
            this.node.getComponent(cc.Animation).play("fireball_exlode");
            this.node.getComponent(cc.Animation).on("finished",()=>{
                this.node.destroy();
            },this);
            
        }, 5)
    }
    onBeginContact(contact, self, other) {
        // console.log("hit player");
        console.log("hit enemy");
        // contact.disabled = true;
        this.node.scale = 2;
        this.node.getComponent(cc.RigidBody).linearVelocity = cc.v2(0,0);
        this.node.getComponent(cc.Animation).stop();
        this.node.getComponent(cc.Animation).play("fireball_explode");
        contact.disabled = true;
        this.node.getComponent(cc.PhysicsBoxCollider).enabled = false;
        this.node.getComponent(cc.Animation).on("finished",()=>{
            this.node.destroy();
        },this);
    }
    // update (dt) {}
}
