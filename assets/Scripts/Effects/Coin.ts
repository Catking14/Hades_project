// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class Coin extends cc.Component {

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {

    }

    // update (dt) {}

    onBeginContact(contact, self, other)
    {
        if(other.node.group == "player")
        {
            other.node.getComponent(other.node.name).money += Math.ceil(10 * (Math.random() + 1));

            // to pool TODO!!
            let Data = cc.find("Data").getComponent("Data");
            Data.coin_pool.put(this.node);
            Data.coin_num++;
        }
    }
}
