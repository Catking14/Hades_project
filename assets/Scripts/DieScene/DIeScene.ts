// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class DieScene extends cc.Component {

    // components
    you_died: cc.Node = null;
    character: cc.Animation = null;
    remind: cc.Node = null;
    tag: cc.Node = null;

    // sound effect
    @property(cc.AudioClip)
    die: cc.AudioClip = null;
    DIE: number = 0;

    // LIFE-CYCLE CALLBACKS:

    onLoad () 
    {
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyPressed, this);

        this.you_died = this.node.getChildByName("you_died");
        this.character = this.node.getChildByName("character").getComponent(cc.Animation);
        this.tag = this.node.getChildByName("tag");
        this.remind = this.node.getChildByName("remind");

        this.you_died.opacity = 0;
        this.tag.opacity = 0;
        this.remind.opacity = 0;
    }

    start () 
    {
        let role = cc.find("Data").getComponent("Data").role;
        // let role = "Archor";

        if(role == "Wizard")
        {
            this.character.play("wizard_death");
        }
        else if(role == "Archor")
        {
            this.character.play("archor_death");
        }
        else if(role == "Assassin")
        {
            this.character.play("Assassin_death");
        }
        else if(role == "Viking")
        {
            this.character.play("viking_death");
        }
        else
        {
            this.character.play("warrior_die");
        }

        this.scheduleOnce(() => {this.tag.opacity = 255;}, 3.5);

        this.DIE = cc.audioEngine.playEffect(this.die, false);

        cc.find("Data").getComponent("Data").total_death++;
        cc.find("Data").getComponent("Data").summarize();
    }

    onKeyPressed()
    {
        if(this.tag.opacity == 255)
        {
            // stop sound effect
            cc.audioEngine.stop(this.DIE);

            // change scene
            cc.find("Data").getComponent("Data").next_scene = "lobby";
            cc.director.loadScene("loading");
        }
    }

    update (dt) 
    {
        this.you_died.opacity = this.you_died.opacity >= 255 ? 255 : this.you_died.opacity + Math.ceil(5 * dt);
        this.remind.opacity = this.remind.opacity >= 255 ? 255 : this.remind.opacity + Math.ceil(5 * dt);
    }
}
