const {ccclass, property} = cc._decorator;
declare const firebase: any;

@ccclass
export default class MainMenuManager extends cc.Component {
    @property(cc.Prefab)
    PageFlip: cc.Prefab = null;
    @property(cc.Prefab)
    PageOne: cc.Prefab = null;
    @property(cc.Prefab)
    PageTwo: cc.Prefab = null;
    @property(cc.Prefab)
    PageThree: cc.Prefab = null;

    public Data: any;

    public Warrior_lock: boolean;
    public Viking_lock: boolean;
    public Archor_lock: boolean;
    public Wizard_lock: boolean;
    public Assassin_lock: boolean;
    public curCharacter: string;
    public curName: string;
    public curEmail: string;
    public curPage: number;

    public curMasterVolume: number;
    public curMusicVolume: number;
    public curSFXVolume: number;
    public CameraShakeEnable: boolean;

    public Kills: number;
    public Deaths: number;
    public DamageMade: number;
    public DamageTaken: number;
    public GameCleared: number;
    public Gold: number;
    public Spend: number;
    public BossKills: number;
    public LevelUP: number;
    public TotalPlaytime: number;

    onLoad(){
        // update all variables with the data in persistent node.
        this.Data = cc.find("Data").getComponent("Data");
        this.Warrior_lock = this.Data.Warrior_lock;
        this.Viking_lock = this.Data.Viking_lock;
        this.Archor_lock = this.Data.Archor_lock;
        this.Wizard_lock = this.Data.Wizard_lock;
        this.Assassin_lock = this.Data.Assassin_lock;
        this.curCharacter = this.Data.role;
        this.curName = this.Data.curName;
        this.curEmail = this.Data.curEmail;
        this.curPage = 1;
        this.curMasterVolume = this.Data.curMasterVolume;
        this.curMusicVolume = this.Data.curMusicVolume;
        this.curSFXVolume = this.Data.curSFXVolume;
        this.CameraShakeEnable = this.Data.CameraShakeEnable; 
        this.Kills= this.Data.total_kills;
        this.Deaths = this.Data.total_death;
        this.DamageMade = this.Data.total_damage_made;
        this.DamageTaken = this.Data.total_damage_taken;
        this.GameCleared = this.Data.total_clear;
        this.Gold = this.Data.total_money_get;
        this.Spend = this.Data.total_money_spent;
        this.BossKills = this.Data.total_Boss_killed;
        this.LevelUP = this.Data.total_upgrades;
        this.TotalPlaytime = this.Data.total_playtime;

        const page_flip = cc.instantiate(this.PageFlip);
        this.node.addChild(page_flip);
        this.node.getChildByName("PageFlip").getComponent(cc.Animation).play("book_flip_left");
        this.scheduleOnce(()=>{
            this.node.getChildByName("PageFlip").getComponent(cc.Animation).play("book_flip_left");
        }, 0.5)
        this.scheduleOnce(()=>{
            this.node.getChildByName("PageFlip").getComponent(cc.Animation).play("book_flip_left");
        }, 1)
        this.scheduleOnce(()=>{
            this.node.getChildByName("PageFlip").destroy();
            this.curPage = 1;
            this.InstantiatePageOne();
        }, 1.5)
    }

    // start () {}

    // update (dt) {}

    ChangePage(target: number){
        if(this.curPage == 1){
            let timeout = (target == 2) ? 0.5 : 1;
            cc.find("Canvas/bg/MainMenu/PageOne/PersonalProfile").destroy();
            cc.find("Canvas/bg/MainMenu/PageOne/GameStart").destroy();
            cc.find("Canvas/bg/MainMenu/PageOne/Book").getComponent(cc.Animation).play("book_flip_left");

            if(target == 3){
                this.scheduleOnce(()=>{
                    cc.find("Canvas/bg/MainMenu/PageOne/Book").getComponent(cc.Animation).play("book_flip_left");
                }, 0.5);
            }

            this.scheduleOnce(()=>{
                cc.find("Canvas/bg/MainMenu/PageOne").destroy();
                if(target == 2){
                    this.curPage = 2;
                    this.InstantiatePageTwo();
                }else{
                    this.curPage = 3;
                    this.InstantiatePageThree();
                } 
            }, timeout);
        }else if(this.curPage == 2){
            let timeout = 0.5;
            cc.find("Canvas/bg/MainMenu/PageTwo/ModifyPersonalProfile").destroy();
            cc.find("Canvas/bg/MainMenu/PageTwo/Setting").destroy();

            if(target == 1) cc.find("Canvas/bg/MainMenu/PageTwo/Book").getComponent(cc.Animation).play("book_flip_right");
            else cc.find("Canvas/bg/MainMenu/PageTwo/Book").getComponent(cc.Animation).play("book_flip_left");

            this.scheduleOnce(()=>{
                cc.find("Canvas/bg/MainMenu/PageTwo").destroy();
                if(target == 1){
                    this.curPage = 1;
                    this.InstantiatePageOne();
                }else{
                    this.curPage = 3;
                    this.InstantiatePageThree();
                }
            }, timeout);
        }else{
            let timeout = (target == 2) ? 0.5 : 1;
            cc.find("Canvas/bg/MainMenu/PageThree/Statistics").destroy();
            cc.find("Canvas/bg/MainMenu/PageThree/Book").getComponent(cc.Animation).play("book_flip_right");

            if(target == 1){
                this.scheduleOnce(()=>{
                    cc.find("Canvas/bg/MainMenu/PageThree/Book").getComponent(cc.Animation).play("book_flip_right");
                }, 0.5);
            }

            this.scheduleOnce(()=>{
                cc.find("Canvas/bg/MainMenu/PageThree").destroy();
                if(target == 1){
                    this.curPage = 1;
                    this.InstantiatePageOne();
                }else{
                    this.curPage = 2;
                    this.InstantiatePageTwo();
                }
            }, timeout);
        }
    }

    InstantiatePageOne(){
        const page_one = cc.instantiate(this.PageOne);
        this.node.addChild(page_one);
    }

    InstantiatePageTwo(){
        const page_two = cc.instantiate(this.PageTwo);
        this.node.addChild(page_two);
    }

    InstantiatePageThree(){
        const page_three = cc.instantiate(this.PageThree);
        this.node.addChild(page_three);
    }

    ModifyCurName(NewName: string){
        this.curName = NewName;
        // call persistent node to modify the name stored in firebase.
        cc.find("Data").getComponent("Data").ModifyCurName(NewName);
    }

    ModifyCurPassword(NewPassword: string){
        //call persistent node to modify password by communicating with firebase.
        cc.find("Data").getComponent("Data").ModifyCurName(NewPassword);
    }

    MasterVolumeChanged(value: number){
        this.curMasterVolume = value;
        // change volume
        // pass value to persistent node
        this.Data.curMasterVolume = value;
        this.Data.setVolume();
    }

    MusicVolumeChanged(value: number){
        this.curMusicVolume = value;
        // change volume
        // pass value to persistent node
        this.Data.curMusicVolume = value;
        this.Data.setVolume();
    }

    SFXVolumeChanged(value: number){
        this.curSFXVolume = value;
        // change volume
        // pass value to persistent node
        this.Data.curSFXVolume = value;
        this.Data.setVolume();
    }

    CameraShakeEnableChanged(value: boolean){
        this.CameraShakeEnable = value;
        // change CameraShakeEnable
        // pass value to persistent node
        this.Data.CameraShakeEnable = value;
    }

    handleLogout(){
        console.log("logout");
        // call persistent node "handle logout"
        cc.director.loadScene("LoginSignupMenu");
    }
}
