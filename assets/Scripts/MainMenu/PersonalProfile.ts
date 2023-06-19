const {ccclass, property} = cc._decorator;

@ccclass
export default class PersonalProfile extends cc.Component {
    @property(cc.SpriteFrame)
    WarriorPhoto: cc.SpriteFrame = null;
    @property(cc.SpriteFrame)
    VikingPhoto: cc.SpriteFrame = null;
    @property(cc.SpriteFrame)
    ArchorPhoto: cc.SpriteFrame = null;
    @property(cc.SpriteFrame)
    WizardPhoto: cc.SpriteFrame = null;
    @property(cc.SpriteFrame)
    AssassinPhoto: cc.SpriteFrame = null;

    private curName: string;
    private curEmail: string;
    private curCharacter: string;
    private Warrior_lock: boolean = false;
    private Viking_lock: boolean = true;
    private Archor_lock: boolean = true;
    private Wizard_lock: boolean = true;
    private Assassin_lock: boolean = true;

    private warrior_img: any;
    private viking_img: any;
    private archor_img: any;
    private wizard_img: any;
    private assassin_img: any;

    private MainMenuManager: any;
    
    onLoad(){
        // initialize all variables with MainMenuManager
        this.MainMenuManager = cc.find("Canvas/bg/MainMenu").getComponent("MainMenuManager");
        this.curName = this.MainMenuManager.curName;
        this.curEmail = this.MainMenuManager.curEmail;
        this.curCharacter = this.MainMenuManager.curCharacter;
        this.Warrior_lock = this.MainMenuManager.Warrior_lock;
        this.Viking_lock = this.MainMenuManager.Viking_lock;
        this.Archor_lock = this.MainMenuManager.Archor_lock;
        this.Wizard_lock = this.MainMenuManager.Wizard_lock;
        this.Assassin_lock = this.MainMenuManager.Assassin_lock;

        // get component
        this.warrior_img = cc.find("Canvas/bg/MainMenu/PageOne/PersonalProfile/characters/warrior/img");
        this.viking_img = cc.find("Canvas/bg/MainMenu/PageOne/PersonalProfile/characters/viking/img");
        this.archor_img = cc.find("Canvas/bg/MainMenu/PageOne/PersonalProfile/characters/archor/img");
        this.wizard_img = cc.find("Canvas/bg/MainMenu/PageOne/PersonalProfile/characters/wizard/img");
        this.assassin_img = cc.find("Canvas/bg/MainMenu/PageOne/PersonalProfile/characters/assassin/img");

        let LogoutButton = new cc.Component.EventHandler();
        LogoutButton.target = this.node;
        LogoutButton.component = "PersonalProfile";
        LogoutButton.handler = "handleLogout";
        this.node.getChildByName("logout").getComponent(cc.Button).clickEvents.push(LogoutButton);
    }

    start () {
        // photo
        let photo = this.node.getChildByName("photo").getChildByName("img").getComponent(cc.Sprite);
        if(this.curCharacter == "Warrior") photo.spriteFrame = this.WarriorPhoto;
        else if(this.curCharacter == "Viking") photo.spriteFrame = this.VikingPhoto;
        else if(this.curCharacter == "Archor") photo.spriteFrame = this.ArchorPhoto;
        else if(this.curCharacter == "Wizard") photo.spriteFrame = this.WizardPhoto;
        else    photo.spriteFrame = this.AssassinPhoto;

        // user info
        cc.find("Canvas/bg/MainMenu/PageOne/PersonalProfile/information/Name/name").getComponent(cc.Label).string = this.curName;
        cc.find("Canvas/bg/MainMenu/PageOne/PersonalProfile/information/Email/email").getComponent(cc.Label).string = this.curEmail;
        
        // character is locked or not
        if(this.Warrior_lock){
            
            this.warrior_img.getComponent(cc.Sprite).node.color = cc.Color.BLACK;
        }
        else this.Warrior();

        if(this.Viking_lock) this.viking_img.getComponent(cc.Sprite).node.color = cc.Color.BLACK;
        else this.Viking();

        if(this.Archor_lock) this.archor_img.getComponent(cc.Sprite).node.color = cc.Color.BLACK;
        else this.Archor();

        if(this.Wizard_lock) this.wizard_img.getComponent(cc.Sprite).node.color = cc.Color.BLACK;
        else this.Wizard();

        if(this.Assassin_lock) this.assassin_img.getComponent(cc.Sprite).node.color = cc.Color.BLACK;
        else this.Assassin();
    }

    // update (dt) {}

    Warrior(){
        this.schedule(()=>{
            this.warrior_img.getComponent(cc.Animation).play("warrior_idle");
            setTimeout(()=>{
                this.warrior_img.getComponent(cc.Animation).play("warrior_run");
            }, 2000)
            setTimeout(()=>{
                this.warrior_img.getComponent(cc.Animation).play("warrior_attack1");
            }, 4000)
        }, 4.32, cc.macro.REPEAT_FOREVER, 0.01)
    }

    Viking(){
        this.schedule(()=>{
            this.viking_img.getComponent(cc.Animation).play("viking_stand");
            setTimeout(()=>{
                this.viking_img.getComponent(cc.Animation).play("viking_run");
            }, 2000)
            setTimeout(()=>{
                this.viking_img.getComponent(cc.Animation).play("viking_a1");
            }, 4000)
        }, 4.8, cc.macro.REPEAT_FOREVER, 0.01)
    }

    Archor(){
        this.schedule(()=>{
            this.archor_img.getComponent(cc.Animation).play("archor_stand");
            setTimeout(()=>{
                this.archor_img.getComponent(cc.Animation).play("archor_run");
            }, 2000)
            setTimeout(()=>{
                this.archor_img.getComponent(cc.Animation).play("archor_attack");
            }, 4000)
        }, 4.67, cc.macro.REPEAT_FOREVER, 0.01)
    }

    Wizard(){
        this.schedule(()=>{
            this.wizard_img.getComponent(cc.Animation).play("wizard_idle");
            setTimeout(()=>{
                this.wizard_img.getComponent(cc.Animation).play("wizard_run");
            }, 2000)
            setTimeout(()=>{
                this.wizard_img.getComponent(cc.Animation).play("wizard_attack2");
            }, 4000)
        }, 5, cc.macro.REPEAT_FOREVER, 0.01)
    }

    Assassin(){
        this.schedule(()=>{
            this.assassin_img.getComponent(cc.Animation).play("Assassin_stand");
            setTimeout(()=>{
                this.assassin_img.getComponent(cc.Animation).play("Assassin_run");
            }, 2000)
            setTimeout(()=>{
                this.assassin_img.getComponent(cc.Animation).play("Assassin_a1");
            }, 4000)
        }, 4.8, cc.macro.REPEAT_FOREVER, 0.01)
    }

    handleLogout(){
        this.MainMenuManager.handleLogout();
    }
}
