// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class WinScene extends cc.Component {

    @property(cc.AudioClip)
    win_bgm: cc.AudioClip = null;

    // nodes
    _rank: cc.Node = null;
    _tag: cc.Node = null;
    character: cc.Animation = null;

    // labels
    _time: cc.Label = null;
    _kills: cc.Label = null;
    _damage: cc.Label = null;

    // status
    finish: boolean = false;

    // LIFE-CYCLE CALLBACKS:

    onLoad () 
    {
        // get labels
        this._time = this.node.getChildByName("summary").getChildByName("time").getChildByName("count").getComponent(cc.Label);
        this._kills = this.node.getChildByName("summary").getChildByName("kills").getChildByName("count").getComponent(cc.Label);
        this._damage = this.node.getChildByName("summary").getChildByName("damage").getChildByName("count").getComponent(cc.Label);

        // get nodes
        this._rank = this.node.getChildByName("Rank");
        this._tag = this.node.getChildByName("tag");
        this.character = this.node.getChildByName("character").getComponent(cc.Animation);

        // initial status
        this._time.string = "";
        this._kills.string = "";
        this._damage.string = "";
        this._rank.opacity = 0;
        this._tag.opacity = 0;

        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyPressed, this);
    }

    start () 
    {
        let role = cc.find("Data").getComponent("Data").role;
        // let role = "Viking";

        if(role == "Wizard")
        {
            this.character.play("wizard_idle");
        }
        else if(role == "Archor")
        {
            this.character.play("archor_stand");
        }
        else if(role == "Assassin")
        {
            this.character.play("Assassin_stand");
        }
        else if(role == "Viking")
        {
            this.character.play("viking_stand");
        }
        else
        {
            this.character.play("warrior_idle");
        }

        this.scheduleOnce(() => {this._time.string = cc.find("Data").getComponent("Data").time}, 1);
        this.scheduleOnce(() => {this._kills.string = cc.find("Data").getComponent("Data").kills}, 2);
        this.scheduleOnce(() => {this._damage.string = cc.find("Data").getComponent("Data").damage_made}, 3);

        // this.scheduleOnce(() => {this._time.string = "1"}, 1);
        // this.scheduleOnce(() => {this._kills.string = "2"}, 2);
        // this.scheduleOnce(() => {this._damage.string = "3"}, 3);
        this.scheduleOnce(() => 
        {
            let score = cc.find("Data").getComponent("Data").kills * 10 + cc.find("Data").getComponent("Data").damage_made - cc.find("Data").getComponent("Data").time * 10;
            // let score = 3000;

            this._rank.opacity = 255;

            if(score > 10000)
            {
                this._rank.getComponent(cc.Label).string = "A";
                this._rank.color = new cc.Color(245, 255, 0);
            }
            else if(score > 6000)
            {
                this._rank.getComponent(cc.Label).string = "B";
                this._rank.color = new cc.Color(168, 168, 168);
            }
            else
            {
                this._rank.getComponent(cc.Label).string = "C";
                this._rank.color = new cc.Color(226, 150, 36);
            }

            this._rank.getComponent(cc.Animation).play();
            
        }, 4.5);

        this.scheduleOnce(() =>
        {
            cc.find("Data").getComponent("Data").summarize();
            this._tag.opacity = 255;
            this.finish = true;
        }, 5.5);

        cc.audioEngine.playMusic(this.win_bgm, false);
    }

    onKeyPressed()
    {
        if(this.finish)
        {
            // stop sound effect
            cc.audioEngine.stopMusic();

            // change scene
            cc.find("Data").getComponent("Data").next_scene = "lobby";
            cc.director.loadScene("loading");
        }
    }

    // update (dt) {}
}
