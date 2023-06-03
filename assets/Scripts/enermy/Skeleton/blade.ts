const {ccclass, property} = cc._decorator;

@ccclass
export default class Blade extends cc.Component {
    duration_time: number = 0;
    damage_val: number = 0;

    start() {
    }

    update(dt) {
        this.duration_time -= dt;
        if (this.duration_time < 0) {
            this.node.destroy();
        }
    }

    onBeginContact(contact, self, other) {
        console.log("hit player");
        contact.disabled = true;
        other.node.getComponent(other.node.name).damage();
    }
}