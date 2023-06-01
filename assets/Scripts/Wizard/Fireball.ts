// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    onLoad(){
        this.node.getComponent(cc.Animation).play("fireball_move");
    }

    start () {
        // this.scheduleOnce(()=>{
        //     this.node.destroy();
        // }, 1.5)
        this.scheduleOnce(()=>{
            this.node.getComponent(cc.Animation).stop();
            this.node.getComponent(cc.Animation).play("fireball_destroy");
            this.node.getComponent(cc.Animation).on("finished",()=>{
                this.node.destroy();
            },this);
            
        }, 10)
    }

    // update (dt) {}
}
