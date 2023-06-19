const {ccclass, property} = cc._decorator;

@ccclass
export default class SignupMenu extends cc.Component {
    private NameEditbox: any;
    private EmailEditbox: any;
    private PasswordEditbox: any;

    private Name: string;
    private Email: string;
    private Password: string;

    onLoad(){
        let Loginbtn = new cc.Component.EventHandler();
        Loginbtn.target = this.node;
        Loginbtn.component = "SignupMenu";
        Loginbtn.handler = "handleLoginClick";
        this.node.getChildByName("LoginButton").getComponent(cc.Button).clickEvents.push(Loginbtn);

        let Signupbtn = new cc.Component.EventHandler();
        Signupbtn.target = this.node;
        Signupbtn.component = "SignupMenu";
        Signupbtn.handler = "handleSignupClick";
        this.node.getChildByName("SignupButton").getComponent(cc.Button).clickEvents.push(Signupbtn);

        let Battlebtn = new cc.Component.EventHandler();
        Battlebtn.target = this.node;
        Battlebtn.component = "SignupMenu";
        Battlebtn.handler = "handleBattleClick";
        this.node.getChildByName("enter").getComponent(cc.Button).clickEvents.push(Battlebtn);

        this.NameEditbox = this.node.getChildByName("name").getComponent(cc.EditBox);
        this.NameEditbox.node.on('text-changed', this.setName, this);
        this.EmailEditbox = this.node.getChildByName("email").getComponent(cc.EditBox);
        this.EmailEditbox.node.on('text-changed', this.setEmail, this);
        this.PasswordEditbox = this.node.getChildByName("password").getComponent(cc.EditBox);
        this.PasswordEditbox.node.on('text-changed', this.setPassword, this);
    }

    start () {

    }

    // update (dt) {}

    setName(){
        this.Name = this.NameEditbox.string;
    }

    setEmail(){
        this.Email = this.EmailEditbox.string;
    }

    setPassword(){
        this.Password = this.PasswordEditbox.string;
    }

    handleLoginClick(){
        cc.find("Canvas/bg").getComponent("LoginSignupMenuManager").SwitchToLoginMenu();
        this.node.destroy();
    }

    handleSignupClick(){
        cc.find("Canvas/bg").getComponent("LoginSignupMenuManager").SwitchToSignupMenu();
        this.node.destroy();
    }

    handleBattleClick(){
        this.NameEditbox.string = "";
        this.EmailEditbox.string = "";
        this.PasswordEditbox.string = "";
        cc.find("Canvas/bg").getComponent("LoginSignupMenuManager").handleSignUp(this.Name, this.Email, this.Password);
    }
}
