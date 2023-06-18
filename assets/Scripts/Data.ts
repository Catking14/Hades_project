// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class Data extends cc.Component {

    // current scene
    scene: string = null;

    // in shop
    in_shop: boolean = false;

    // current player role
    follow: cc.Node = null;

    // player level
    HP: number = 100;
    heal: number = 100;
    dash: number = 0.0;
    damage: number = 0;

    // money for next level upgrade 
    money: number = 1000;
    next_health: number = 100;
    next_heal: number = 100;
    next_dash: number = 100;
    next_damage: number = 100;

    // LIFE-CYCLE CALLBACKS:

    onLoad () 
    {
        // persistent data node
        cc.game.addPersistRootNode(this.node);
    }

    start () 
    {
        // get data from firebase
        // TODO
    }

    update (dt) 
    {
        // rounding for some data
        this.next_health = Math.ceil(this.next_health);
        this.next_heal = Math.ceil(this.next_heal);
        this.next_dash = Math.ceil(this.next_dash);
        this.next_damage = Math.ceil(this.next_damage);

        this.scene = cc.director.getScene().name;
        // console.log(this.scene);
    }
}
