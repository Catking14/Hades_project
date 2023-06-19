const {ccclass, property} = cc._decorator;

@ccclass
export default class ModifyPersonalProfile extends cc.Component {
    private NewNameEditbox: any;
    private NewPasswordEditbox: any;
    private ConfirmPasswordEditbox

    private new_name: string;
    private new_password: string;
    private confirm_password: string;

    onLoad(){
        let NewNameSaveButton = new cc.Component.EventHandler();
        NewNameSaveButton.target = this.node;
        NewNameSaveButton.component = "ModifyPersonalProfile";
        NewNameSaveButton.handler = "handleNewNameSave";
        this.node.getChildByName("ModifyUserName").getChildByName("save_new_user_name")
        .getComponent(cc.Button).clickEvents.push(NewNameSaveButton);

        let NewPasswordSaveButton = new cc.Component.EventHandler();
        NewPasswordSaveButton.target = this.node;
        NewPasswordSaveButton.component = "ModifyPersonalProfile";
        NewPasswordSaveButton.handler = "handleNewPasswordSave";
        this.node.getChildByName("ModifyUserPassword").getChildByName("save_new_user_password")
        .getComponent(cc.Button).clickEvents.push(NewPasswordSaveButton);

        this.NewNameEditbox = this.node.getChildByName("ModifyUserName")
        .getChildByName("new_name_editbox").getComponent(cc.EditBox);
        this.NewNameEditbox.node.on('text-changed', this.setNewName, this);

        this.NewPasswordEditbox = this.node.getChildByName("ModifyUserPassword")
        .getChildByName("new_password_editbox").getComponent(cc.EditBox);
        this.NewPasswordEditbox.node.on('text-changed', this.setNewPassword, this);

        this.ConfirmPasswordEditbox = this.node.getChildByName("ModifyUserPassword")
        .getChildByName("confirm_password_editbox").getComponent(cc.EditBox);
        this.ConfirmPasswordEditbox.node.on('text-changed', this.setConfirmPassword, this);
    }

    start () {

    }

    // update (dt) {}

    setNewName(){
        this.new_name = this.NewNameEditbox.string;
    }

    setNewPassword(){
        this.new_password = this.NewPasswordEditbox.string;
    }

    setConfirmPassword(){
        this.confirm_password = this.ConfirmPasswordEditbox.string;
    }

    handleNewNameSave(){
        console.log("new name has been saved");
        this.NewNameEditbox.string = "";
        cc.find("Canvas/bg/MainMenu").getComponent("MainMenuManager").ModifyCurName(this.new_name);
    }

    handleNewPasswordSave(){
        this.NewPasswordEditbox.string = "";
        this.ConfirmPasswordEditbox.string = "";
        if(this.new_password != this.confirm_password){
            console.log("different password");
            return;
        }
        cc.find("Canvas/bg/MainMenu").getComponent("MainMenuManager").ModifyCurPassword();
    }
}
