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
            let cur_scene = cc.find("Data").getComponent("Data").scene;

            if(cur_scene == "lobby")
            {
                cc.find("Data").getComponent("Data").next_scene = "Stage1";
            }
            else if(cur_scene == "Stage1")
            {
                cc.find("Data").getComponent("Data").next_scene = "BossSlime";
            }
            else if(cur_scene == "BossSlime")
            {
                cc.find("Data").getComponent("Data").next_scene = "Stage2";
            }
            else if(cur_scene == "Stage2")
            {
                cc.find("Data").getComponent("Data").next_scene = "BossBeholder";
            }
            else if(cur_scene == "BossBeholder")
            {
                cc.find("Data").getComponent("Data").next_scene = "win_scene";
            }
            
            cc.director.loadScene("loading");
        }
    }
}
