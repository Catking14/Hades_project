// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class ShopMenu extends cc.Component {

    @property
    hp_amount: number = 10;

    @property
    heal_amount: number = 5;

    @property
    dash_amount: number = 0.05;

    @property
    damage_amount: number = 5;

    // level and money labels
    money: cc.Label = null;
    health_level: cc.Label = null;
    heal_level: cc.Label = null;
    dash_level: cc.Label = null;
    damage_level: cc.Label = null;

    health_next_level: cc.Label = null;
    heal_next_level: cc.Label = null;
    dash_next_level: cc.Label = null;
    damage_next_level: cc.Label = null;

    // buttons
    health_button: cc.Button = null;
    heal_button: cc.Button = null;
    dash_button: cc.Button = null;
    damage_button: cc.Button = null;

    // music effects
    @property(cc.AudioClip)
    buy: cc.AudioClip = null;

    @property(cc.AudioClip)
    error: cc.AudioClip = null;

    upgrade_health()
    {
        let cur_money = cc.find("Data").getComponent("Data").money;
        let next_health = cc.find("Data").getComponent("Data").next_health;

        if(cur_money >= next_health)
        {
            cc.find("Data").getComponent("Data").HP += this.hp_amount;
            cc.find("Data").getComponent("Data").money -= next_health;
            cc.find("Data").getComponent("Data").next_health *= 1.2;

            cc.audioEngine.playEffect(this.buy, false);
        }
        else
        {
            cc.audioEngine.playEffect(this.error, false);
        }
    }

    upgrade_heal()
    {
        let cur_money = cc.find("Data").getComponent("Data").money;
        let next_heal = cc.find("Data").getComponent("Data").next_health;

        if(cur_money >= next_heal)
        {
            cc.find("Data").getComponent("Data").heal -= this.heal_amount;
            cc.find("Data").getComponent("Data").money -= next_heal;
            cc.find("Data").getComponent("Data").next_heal *= 2;

            cc.audioEngine.playEffect(this.buy, false);
        }
        else
        {
            cc.audioEngine.playEffect(this.error, false);
        }
    }

    upgrade_dash()
    {
        let cur_money = cc.find("Data").getComponent("Data").money;
        let next_dash = cc.find("Data").getComponent("Data").next_dash;

        if(cur_money >= next_dash)
        {
            cc.find("Data").getComponent("Data").dash += this.dash_amount;
            cc.find("Data").getComponent("Data").money -= next_dash;
            cc.find("Data").getComponent("Data").next_dash *= 1.2;

            cc.audioEngine.playEffect(this.buy, false);
        }
        else
        {
            cc.audioEngine.playEffect(this.error, false);
        }
        
    }

    upgrade_damage()
    {
        let cur_money = cc.find("Data").getComponent("Data").money;
        let next_damage = cc.find("Data").getComponent("Data").next_damage;

        if(cur_money >= next_damage)
        {
            cc.find("Data").getComponent("Data").damage += this.damage_amount;
            cc.find("Data").getComponent("Data").money -= next_damage;
            cc.find("Data").getComponent("Data").next_damage *= 1.2;

            cc.audioEngine.playEffect(this.buy, false);
        }
        else
        {
            cc.audioEngine.playEffect(this.error, false);
        }
    }

    // LIFE-CYCLE CALLBACKS:

    onLoad () 
    {
        // get labels
        this.money = this.node.getChildByName("Money").getChildByName("count").getComponent(cc.Label);
        this.health_level = this.node.getChildByName("Health").getChildByName("level").getComponent(cc.Label);
        this.heal_level = this.node.getChildByName("Heal").getChildByName("level").getComponent(cc.Label);
        this.dash_level = this.node.getChildByName("Dash").getChildByName("level").getComponent(cc.Label);
        this.damage_level = this.node.getChildByName("Damage").getChildByName("level").getComponent(cc.Label);

        this.health_next_level = this.node.getChildByName("Health").getChildByName("next").getComponent(cc.Label);
        this.heal_next_level = this.node.getChildByName("Heal").getChildByName("next").getComponent(cc.Label);
        this.dash_next_level = this.node.getChildByName("Dash").getChildByName("next").getComponent(cc.Label);
        this.damage_next_level = this.node.getChildByName("Damage").getChildByName("next").getComponent(cc.Label);

        // get buttons
        this.health_button = this.node.getChildByName("Health").getChildByName("upgrade").getComponent(cc.Button);
        this.heal_button = this.node.getChildByName("Heal").getChildByName("upgrade").getComponent(cc.Button);
        this.dash_button = this.node.getChildByName("Dash").getChildByName("upgrade").getComponent(cc.Button);
        this.damage_button = this.node.getChildByName("Damage").getChildByName("upgrade").getComponent(cc.Button);

    }

    start () 
    {
        // push event handlers
        let hpp = new cc.Component.EventHandler;
        let hep = new cc.Component.EventHandler;
        let dap = new cc.Component.EventHandler;
        let dmp = new cc.Component.EventHandler;

        hpp.target = this.node;
        hpp.component = "ShopMenu";
        hpp.handler = "upgrade_health";

        hep.target = this.node;
        hep.component = "ShopMenu";
        hep.handler = "upgrade_heal";

        dap.target = this.node;
        dap.component = "ShopMenu";
        dap.handler = "upgrade_dash";

        dmp.target = this.node;
        dmp.component = "ShopMenu";
        dmp.handler = "upgrade_damage";

        this.health_button.clickEvents.push(hpp);
        this.heal_button.clickEvents.push(hep);
        this.dash_button.clickEvents.push(dap);
        this.damage_button.clickEvents.push(dmp);
    }

    update (dt) 
    {
        this.money.string = cc.find("Data").getComponent("Data").money.toString();
        this.health_level.string = cc.find("Data").getComponent("Data").HP.toString();
        this.heal_level.string = cc.find("Data").getComponent("Data").heal.toString();
        this.damage_level.string = "+ " + cc.find("Data").getComponent("Data").damage.toString();
        this.dash_level.string = "- " + cc.find("Data").getComponent("Data").dash.toString() + "s";

        this.health_next_level.string = cc.find("Data").getComponent("Data").next_health.toString();
        this.heal_next_level.string = cc.find("Data").getComponent("Data").next_heal.toString();
        this.dash_next_level.string = cc.find("Data").getComponent("Data").next_dash.toString();
        this.damage_next_level.string = cc.find("Data").getComponent("Data").next_damage.toString();
    }
}
