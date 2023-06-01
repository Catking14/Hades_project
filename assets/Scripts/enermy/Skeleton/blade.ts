const {ccclass, property} = cc._decorator;

@ccclass
export default class Blade extends cc.Component {
    duration_time: number = 0;
    damage_val: number = 0;
    debug_mode: boolean = false;

    start() {
        if (this.debug_mode) {
            this.node.opacity = 100;
        }
    }

    update(dt) {
        this.duration_time -= dt;
        if (this.duration_time < 0) {
            this.node.destroy();
        }
    }

    onBeginContact(contact, self, other) {
        console.log("hit player");
        other.damage(this.damage_val);
    }
}