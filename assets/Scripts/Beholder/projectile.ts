// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class Fireball extends cc.Component {

    isValid: boolean = true;

    onLoad() {
        this.scheduleOnce(() => { this.node.getComponent(cc.Animation).play("projectile_loop"); }, 0.4);
        this.scheduleOnce(() => {
            this.node.destroy();
        }, 3);
    }

    start() {
    }

    onBeginContact(contact, self, other) {

        contact.disabled = true;
        if (other.node.group == "player_attack" || other.node.group == "default") {
            this.getComponent(cc.RigidBody).linearVelocity = cc.v2(0, 0);
            this.isValid = false;
            this.getComponent(cc.Animation).play("projectile_finish");  
            this.getComponent(cc.Animation).on('finished', () => {
                this.node.destroy();
            }, this);
        }
        if (other.node.group == "player" && this.isValid) {
            other.node.getComponent(other.node.name).damage(30);
        }
    }
}
