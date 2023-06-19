// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class Data extends cc.Component {

    @property (cc.Prefab)
    coin_prefab: cc.Prefab = null;

    @property (cc.Prefab)
    heal_posion_prefab: cc.Prefab = null;

    // node pool
    coin_pool: cc.NodePool = null;
    coin_num: number = 0;
    heal_posion_pool: cc.NodePool = null;
    heal_posion_num: number = 0;

    // current scene
    scene: string = null;
    next_scene: string = null;
    stage: number = 1;

    // in shop
    in_shop: boolean = false;

    // current player role
    role: string = "";

    // player level
    HP: number = 100;
    heal: number = 0;
    dash: number = 0.0;
    damage: number = 0;

    // money for next level upgrade 
    money: number = 1000;
    next_health: number = 100;
    next_heal: number = 100;
    next_dash: number = 100;
    next_damage: number = 100;

    // statistics data
    total_kills: number = 0;
    total_death: number = 0;
    total_clear: number = 0;
    total_damage_taken: number = 0;
    total_damage_made: number = 0;
    total_money_get: number = 0;
    total_money_spent: number = 0;
    total_upgrades: number = 0;
    total_playtime: number = 0;     // in sec maybe?
    total_Boss_killed: number = 0;

    // statistic for single round
    time: number = 0;
    kills: number = 0;
    damage_made: number = 0;

    // LIFE-CYCLE CALLBACKS:

    onLoad () 
    {
        // persistent data node
        cc.game.addPersistRootNode(this.node);
    }

    start () 
    {
        // init node pool
        this.coin_pool = new cc.NodePool();
        this.coin_num = 100;
        for (let i = 0; i < 100; i++)
            this.coin_pool.put(cc.instantiate(this.coin_prefab));
        
        this.heal_posion_pool = new cc.NodePool();
        this.heal_posion_num = 30;
        for (let i = 0; i < 30; i++)
            this.heal_posion_pool.put(cc.instantiate(this.heal_posion_prefab));

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
