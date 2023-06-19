// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class HealPosion extends cc.Component {

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {

    }

    // update (dt) {}

    onBeginContact(contact, self, other)
    {
        if(other.node.group == "player")
        {
            let add = Math.floor(5 * (Math.random() + 1));
            let add_max = cc.find("Data").getComponent("Data").heal;
            
            if(other.node.getComponent(other.node.name).heal + add > 100 - add_max)
            {
                other.node.getComponent(other.node.name).heal = 100 - add_max;
            }
            else
            {
                other.node.getComponent(other.node.name).heal += add;
            }

            this.node.destroy()     // to pool TODO!!
        }
    }
}
