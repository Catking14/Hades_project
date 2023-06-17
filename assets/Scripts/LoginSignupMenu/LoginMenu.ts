const {ccclass, property} = cc._decorator;

@ccclass
export default class LoginMenu extends cc.Component {

    onLoad(){
        let Loginbtn = new cc.Component.EventHandler();
        Loginbtn.target = this.node;
        Loginbtn.component = "LoginMenu";
        Loginbtn.handler = "handleLoginClick";
        this.node.getChildByName("LoginButton").getComponent(cc.Button).clickEvents.push(Loginbtn);

        let Signupbtn = new cc.Component.EventHandler();
        Signupbtn.target = this.node;
        Signupbtn.component = "LoginMenu";
        Signupbtn.handler = "handleSignupClick";
        this.node.getChildByName("SignupButton").getComponent(cc.Button).clickEvents.push(Signupbtn);

        let Battlebtn = new cc.Component.EventHandler();
        Battlebtn.target = this.node;
        Battlebtn.component = "LoginMenu";
        Battlebtn.handler = "handleBattleClick";
        this.node.getChildByName("enter").getComponent(cc.Button).clickEvents.push(Battlebtn);
    }

    start () {

    }

    // update (dt) {}

    handleLoginClick(){
        cc.find("Canvas/bg").getComponent("LoginSignupMenuManager").SwitchToLoginMenu();
        this.node.destroy();
    }

    handleSignupClick(){
        cc.find("Canvas/bg").getComponent("LoginSignupMenuManager").SwitchToSignupMenu();
        this.node.destroy();
    }

    handleBattleClick(){
        cc.find("Canvas/bg").getComponent("LoginSignupMenuManager").PrepareToStartGame();
        this.node.destroy();
    }
}
