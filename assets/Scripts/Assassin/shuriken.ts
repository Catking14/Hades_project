// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class Fireball extends cc.Component {

    @property(cc.AudioClip)
    xinSound: cc.AudioClip = null;

    onLoad() {
        this.node.scale = 1.4;
        this.node.getComponent(cc.Animation).play("shuriken");
        this.scheduleOnce(() => {
            this.node.destroy();
        }, 1);
    }

    start() {
    }

    onBeginContact(contact, self, other) {

        contact.disabled = true;
        if (other.node.group == "enemy") {
            let id = cc.audioEngine.playEffect(this.xinSound, false);
            cc.audioEngine.setVolume(id, 0.7);
            other.node.getComponent(other.node.name).damage(50);
        }
    }
}
