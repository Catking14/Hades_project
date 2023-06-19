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
            let add = Math.ceil(10 * (Math.random() + 1))
            other.node.getComponent(other.node.name).money += add;

            // to pool TODO!!
            let Data = cc.find("Data").getComponent("Data");
            Data.total_money_get += add;
            Data.coin_pool.put(this.node);
            Data.coin_num++;
        }
    }
}
