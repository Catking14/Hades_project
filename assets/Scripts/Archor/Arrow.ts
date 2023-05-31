const {ccclass, property} = cc._decorator;

@ccclass
export default class Arrow extends cc.Component {

    onLoad(){
        this.node.getComponent(cc.Animation).play("arrow");
    }

    start () {
        this.scheduleOnce(()=>{
            this.node.destroy();
        }, 1)
    }

    // update (dt) {}
}
