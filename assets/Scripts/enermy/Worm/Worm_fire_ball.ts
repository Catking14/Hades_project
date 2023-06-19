const { ccclass, property } = cc._decorator;

@ccclass
export default class Worm_fire_ball extends cc.Component {
    // @property(cc.AudioClip)
    // hit_effect: cc.AudioClip = null;

    // @property(cc.AudioClip)
    // nothit_effect: cc.AudioClip = null;

    damage_val: number = 0;

    onLoad() {
        this.node.getComponent(cc.Animation).play("move");
        console.log("uwu");
    }

    start() {
    }
    onBeginContact(contact, self, other) {
        this.node.getComponent(cc.RigidBody).linearVelocity = cc.v2(0, 0);
        this.node.getComponent(cc.Animation).stop();
        this.node.getComponent(cc.Animation).play("explosion");

        contact.disabled = true;
        if (other.node.group == "player") {
            // cc.audioEngine.playEffect(this.hit_effect, false);
            other.node.getComponent(other.node.name).damage(this.damage_val);
        }
        else {
            // cc.audioEngine.playEffect(this.nothit_effect, false);
        }
        this.node.getComponent(cc.PhysicsBoxCollider).enabled = false;
        this.scheduleOnce(() => {
            this.node.destroy();
        }, 0.55);
    }
}
