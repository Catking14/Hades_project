// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class MainMenu extends cc.Component {

    onLoad(){
        let Startbtn = new cc.Component.EventHandler();
        Startbtn.target = this.node;
        Startbtn.component = "MainMenu";
        Startbtn.handler = "handleGameStartClick";
        this.node.getChildByName("gamestart").getComponent(cc.Button).clickEvents.push(Startbtn);

        let Optionbtn = new cc.Component.EventHandler();
        Optionbtn.target = this.node;
        Optionbtn.component = "MainMenu";
        Optionbtn.handler = "handleOptionClick";
        this.node.getChildByName("option").getComponent(cc.Button).clickEvents.push(Optionbtn);

        let Logoutbtn = new cc.Component.EventHandler();
        Logoutbtn.target = this.node;
        Logoutbtn.component = "MainMenu";
        Logoutbtn.handler = "handleLogoutClick";
        this.node.getChildByName("logout").getComponent(cc.Button).clickEvents.push(Logoutbtn);
    }

    start(){
        this.node.getChildByName("title").runAction(cc.moveBy(0.4, cc.v2(448.676, 0)));
    }

    // update (dt) {}

    handleGameStartClick(){
        console.log("game start");
    }

    handleOptionClick(){
        console.log("option");
    }

    handleLogoutClick(){
        console.log("logout");
    }
}
