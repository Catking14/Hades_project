// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class BattleTransporter extends cc.Component {

    @property(cc.Node)
    label: cc.Node = null;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () 
    {
        let float = cc.sequence(cc.moveBy(2, cc.v2(0, 20)).easing(cc.easeInOut(2.0)), cc.moveBy(2, cc.v2(0, -20)).easing(cc.easeInOut(2.0)));

        this.label.runAction(cc.repeatForever(float));
    }

    // update (dt) {}

    onBeginContact(contact, self, other)
    {
        if(other.node.group == "player")
        {
            // change scene
            cc.find("Data").getComponent("Data").next_scene = "catking_test";
            cc.director.loadScene("loading");
        }
    }
}
