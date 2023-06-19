const { ccclass, property } = cc._decorator;

@ccclass
export default class BeholderVFX_lazer extends cc.Component {

    onBeginContact(contact, self, other) {
        console.log("hit player");
        // contact.disabled = true;
        if (other.node.group == "player" || other.node.group == "enemy") {
            other.node.getComponent(other.node.name).damage(50);
        }
    }
}