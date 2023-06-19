// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

declare const firebase: any;

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
    money: number = 100;
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

    // Main Menu Data
    Warrior_lock: boolean = false;
    Viking_lock: boolean = true;
    Archor_lock: boolean = true;
    Wizard_lock: boolean = true;
    Assassin_lock: boolean = true;
    curCharacter: string = "Warrior";
    curName: string = "Hades";
    curEmail: string = "Hades@gmail.com";
    curPage: number = 1;

    curMasterVolume: number = 50;
    curMusicVolume: number = 50;
    curSFXVolume: number = 50;
    CameraShakeEnable: boolean = true;

    // Kills: number = 0;
    // Deaths: number = 0;
    // DamageMade: number = 0;
    // DamageTaken: number = 0;
    // GameCleared: number = 0;
    // Gold: number = 0;
    // Spend: number = 0;
    // BossKills: number = 0;
    // LevelUP: number = 0;
    // TotalPlaytime: number = 0;

    refresh_round()
    {
        // clear data
        this.time = 0;
        this.kills = 0;
        this.damage_made = 0;
    }

    summarize()
    {
        // sum data to total
        this.total_playtime += this.time;
        this.total_kills += this.kills;
        this.total_damage_made += this.damage_made;
    }

    write_data()
    {
        let uid = firebase.auth().currentUser.uid;
        let ref = firebase.database().ref("Player/" + uid);

        ref.set(
            {
                HP: this.HP,
                heal: this.heal,
                dash: this.dash,
                damage: this.damage,
                next_health: this.next_health,
                next_heal: this.next_heal,
                next_dash: this.next_dash,
                next_damage: this.next_damage,
                money: this.money,
                total_kills: this.total_kills,
                total_death: this.total_death,
                total_clear: this.total_clear,
                total_damage_taken: this.total_damage_taken,
                total_damage_made: this.total_damage_made,
                total_money_get: this.total_money_get,
                total_money_spent: this.total_money_spent,
                total_upgrades: this.total_upgrades,
                total_playtime: this.total_playtime,
                total_Boss_killed: this.total_Boss_killed,
                Warrior_lock: this.Warrior_lock,
                Viking_lock: this.Viking_lock,
                Archor_lock: this.Archor_lock,
                Wizard_lock: this.Wizard_lock,
                Assassin_lock: this.Assassin_lock
            }
        )
    }

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
        let uid = firebase.auth().currentUser.uid;
        // let uid = "";
        let ref = firebase.database().ref("Player/" + uid);

        ref.once("value").then((snapshot) => 
        {
            let info = snapshot.val();

            this.HP = info.HP;
            this.heal = info.heal;
            this.dash = info.dash;
            this.damage = info.damage;
            this.next_health = info.next_health;
            this.next_heal = info.next_heal;
            this.next_dash = info.next_dash;
            this.next_damage = info.next_damage;
            this.money = info.money;
            this.total_kills = info.total_kills;
            this.total_death = info.total_death;
            this.total_clear = info.total_clear;
            this.total_damage_made = info.total_damage_made;
            this.total_damage_taken = info.total_damage_taken;
            this.total_money_get = info.total_money_get;
            this.total_money_spent = info.total_money_spent;
            this.total_upgrades = info.total_upgrades;
            this.total_playtime = info.total_playtime;
            this.total_Boss_killed = info.total_Boss_killed;
            this.Warrior_lock = info.Warrior_lock;
            this.Viking_lock = info.Viking_lock;
            this.Archor_lock = info.Archor_lock;
            this.Wizard_lock = info.Wizard_lock;
            this.Assassin_lock = info.Assassin_lock;
        })
        .catch((error) =>
        {
            console.log(error.message);
            
            this.HP = 100;
            this.heal = 0;
            this.dash = 0;
            this.damage = 0;
            this.next_health = 100;
            this.next_heal = 100;
            this.next_dash = 100;
            this.next_damage = 100;
            this.money = 0;
            this.total_kills = 0;
            this.total_death = 0;
            this.total_clear = 0;
            this.total_damage_made = 0;
            this.total_damage_taken = 0;
            this.total_money_get = 0;
            this.total_money_spent = 0;
            this.total_upgrades = 0;
            this.total_playtime = 0;
            this.total_Boss_killed = 0;
            this.Warrior_lock = false;
            this.Viking_lock = true;
            this.Archor_lock = true;
            this.Wizard_lock = true;
            this.Assassin_lock = true;
        })
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
