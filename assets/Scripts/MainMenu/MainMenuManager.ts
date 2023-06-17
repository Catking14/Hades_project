const {ccclass, property} = cc._decorator;

@ccclass
export default class MainMenuManager extends cc.Component {
    @property(cc.Prefab)
    MainMenu: cc.Prefab = null;
   
    onLoad(){
        const main_menu = cc.instantiate(this.MainMenu);
        this.node.addChild(main_menu);
    }

    start () {

    }

    // update (dt) {}
}
