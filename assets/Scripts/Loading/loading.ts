// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class Loading extends cc.Component {

    next: string = null;

    // LIFE-CYCLE CALLBACKS:

    onLoad () 
    {
        this.next = cc.find("Data").getComponent("Data").next_scene;
        
        cc.audioEngine.stopMusic();
    }

    start () 
    {
        let anim = this.node.getComponent(cc.Animation);
        let role = cc.find("Data").getComponent("Data").role;
        // let role = "Warrior";

        if(role == "Wizard")
        {
            anim.play("wizard_run");
        }
        else if(role == "Archor")
        {
            anim.play("archor_run");
        }
        else if(role == "Assassin")
        {
            anim.play("Assassin_run");
        }
        else if(role == "Viking")
        {
            anim.play("viking_walk");
        }
        else
        {
            anim.play("warrior_run");
        }

        this.scheduleOnce(() => {cc.director.loadScene(this.next);}, 2);
    }

    update (dt) 
    {

    }
}
