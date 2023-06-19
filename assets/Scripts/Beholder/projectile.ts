// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class Fireball extends cc.Component {

    onLoad() {
        this.scheduleOnce(()=>{ this.node.getComponent(cc.Animation).play("projectile_loop"); }, 0.4);
        this.scheduleOnce(() => {
            this.node.destroy();
        }, 3);
    }

    start() {
    }

    onBeginContact(contact, self, other) {

        contact.disabled = true;
        if (other.node.group == "player") {
            other.node.getComponent(other.node.name).damage(30);
        }
    }
}
