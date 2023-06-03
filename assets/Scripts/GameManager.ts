// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class GameManager extends cc.Component {

    // LIFE-CYCLE CALLBACKS:

    onLoad () 
    {
        let physics_manager = cc.director.getPhysicsManager();

        physics_manager.enabled = true;
        physics_manager.debugDrawFlags = 1;
    }

    start () {

    }

    // update (dt) {}
}
