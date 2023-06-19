const {ccclass, property} = cc._decorator;

@ccclass
export default class GameStartScene extends cc.Component {

    onLoad(){
        this.Warrior();
        this.Viking();
        this.Archor();
        this.Wizard();
        this.Assassin();
    }

    // start () {}

    // update (dt) {}

    Warrior(){
        this.schedule(()=>{
            this.node.getChildByName("characters").getChildByName("warrior").getComponent(cc.Animation).play("warrior_run");
            setTimeout(()=>{
                this.node.getChildByName("characters").getChildByName("warrior").getComponent(cc.Animation).play("warrior_attack1");
            }, 2000)
        }, 2.32)
    }

    Viking(){
        this.schedule(()=>{
            this.node.getChildByName("characters").getChildByName("viking").getComponent(cc.Animation).play("viking_run");
            setTimeout(()=>{
                this.node.getChildByName("characters").getChildByName("viking").getComponent(cc.Animation).play("viking_a1");
            }, 2000)
        }, 2.8)
    }

    Archor(){
        this.schedule(()=>{
            this.node.getChildByName("characters").getChildByName("archor").getComponent(cc.Animation).play("archor_run");
            setTimeout(()=>{
                this.node.getChildByName("characters").getChildByName("archor").getComponent(cc.Animation).play("archor_attack");
            }, 2000)
        }, 2.67)
    }

    Wizard(){
        this.schedule(()=>{
            this.node.getChildByName("characters").getChildByName("wizard").getComponent(cc.Animation).play("wizard_run");
            setTimeout(()=>{
                this.node.getChildByName("characters").getChildByName("wizard").getComponent(cc.Animation).play("wizard_attack2");
            }, 2000)
        }, 2.87)
    }

    Assassin(){
        this.schedule(()=>{
            this.node.getChildByName("characters").getChildByName("assassin").getComponent(cc.Animation).play("Assassin_run");
            setTimeout(()=>{
                this.node.getChildByName("characters").getChildByName("assassin").getComponent(cc.Animation).play("Assassin_a1");
            }, 2000)
        }, 2.8)
    }
}
