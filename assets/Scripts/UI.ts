// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class UI extends cc.Component {
    // icon component
    _icon: cc.Node = null;

    // bar component
    _hp_bar: cc.Node = null;
    _temp_hp_bar: cc.Node = null;
    _mana_bar: cc.Node = null;
    _dash_bar: cc.Node = null;

    _hp_bar_length: number = 300;
    _mana_bar_length: number = 210;

    @property
    bar_change_speed: number = 10;

    // track object
    _player: cc.Node = null;

    // status number
    _hp: number = 0;
    _max_hp: number = 0;
    _next_hp: number = 0;

    _mana: number = 100;
    _mana_cd: number = 0;
    _mana_fire: boolean = false;

    _dash_ready: boolean = true;

    // animation
    glass_broke: boolean = false;
    hit_flash = null;

    @property(cc.AudioClip)
    glass_crack: cc.AudioClip = null;


    break_glass()
    {
        this._icon.getChildByName("glass").getComponent(cc.Animation).play();
        cc.audioEngine.playEffect(this.glass_crack, false);

        this._icon.getChildByName("pic").color = new cc.Color(255, 0, 0);
    }

    hit_effect()
    {
        this._icon.getChildByName("background").color = new cc.Color(255, 0, 0);

        if(this.hit_flash)
        {
            this.unschedule(this.hit_flash);
        }

        this.scheduleOnce(this.hit_flash = () => {this._icon.getChildByName("background").color = new cc.Color(0, 0, 0);}, 0.1);
    }

    // LIFE-CYCLE CALLBACKS:

    onLoad () 
    {
        // get tracing player
        this._player = cc.find("Game Manager").getComponent("GameManager").follow;

        // get UI elements
        this._icon = this.node.getChildByName("Icon");
        this._hp_bar = this.node.getChildByName("HP").getChildByName("actual_health");
        this._temp_hp_bar = this.node.getChildByName("HP").getChildByName("temp_health");
        this._mana_bar = this.node.getChildByName("MP").getChildByName("cd");
        this._dash_bar = this.node.getChildByName("Dash").getChildByName("point");
    }

    start () 
    {
        // set initial blood (HP)
        this._hp = this._player.getComponent(this._player.name).HP;
        this._max_hp = this._hp;
        this._next_hp = this._hp;

        this._mana = 100;
        this._mana_cd = this._player.getComponent(this._player.name)._ultimate_cd;
    }

    update (dt) 
    {
        // get player hp
        let new_hp = this._player.getComponent(this._player.name).HP;

        // player get hit
        if(new_hp < this._hp)
        {
            this.hit_effect();
        }

        this._hp = new_hp;

        // gradually update next hp if player get hit;
        if(this._hp < this._next_hp)
        {
            this._next_hp = (this._next_hp - dt * this.bar_change_speed < this._hp) ? this._hp: this._next_hp - dt * this.bar_change_speed;
        }
        else if(this._hp > this._next_hp)
        {
            this._next_hp = this._hp;
        }

        // get player ultimate
        if(!this._mana_fire && this._player.getComponent(this._player.name)._ultimate)
        {
            // ultimate triggered!
            this._mana = 0;
            this._mana_fire = true;

            this.scheduleOnce(() => {this._mana_fire = false}, this._mana_cd);
        }

        // update mana
        this._mana = this._mana < 100 ? this._mana + 100 * (dt / this._mana_cd) : 100;

        // update dash
        if(!this._player.getComponent(this._player.name)._dash_ready)
        {
            this._dash_bar.opacity = 0;
        }
        else
        {
            this._dash_bar.opacity = 255;
        }

        // check hp and mana range before update
        if(this._hp <= 0)
        {
            this._hp = 0;
            
            // haven't played glass broke animation
            if(!this.glass_broke)
            {
                this.glass_broke = true;
                this.break_glass();
            }
        }
        
        if(this._next_hp < 0)
        {
            this._next_hp = 0;
        }

        // update bar width
        this._hp_bar.width = this._hp_bar_length * (this._hp / this._max_hp);
        this._temp_hp_bar.width = this._hp_bar_length * (this._next_hp / this._max_hp);
        this._mana_bar.width = this._mana_bar_length * (this._mana / 100);


        // position lerp
        let cur_pos = this.node.getPosition();

        cur_pos.lerp(cc.v2(0, 0), 0.1, cur_pos);

        this.node.setPosition(cur_pos);
    }
}
