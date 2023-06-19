const {ccclass, property} = cc._decorator;

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

    public Warrior_lock: boolean = false;
    public Viking_lock: boolean = true;
    public Archor_lock: boolean = true;
    public Wizard_lock: boolean = true;
    public Assassin_lock: boolean = true;
    public curCharacter: string = "Assassin";
    public curName: string = "Hades";
    public curEmail: string = "Hades@gmail.com";
    public curPage: number = 1;

    public curMasterVolume: number = 50;
    public curMusicVolume: number = 50;
    public curSFXVolume: number = 50;
    public CameraShakeEnable: boolean = true;

    public Kills: number = 0;
    public Deaths: number = 0;
    public DamageMade: number = 0;
    public DamageTaken: number = 0;
    public GameCleared: number = 0;
    public Gold: number = 0;
    public Spend: number = 0;
    public BossKills: number = 0;
    public LevelUP: number = 0;
    public TotalPlaytime: number = 0;

    onLoad(){
        // update all variables with the data in persistent node.

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
    }

    ModifyCurPassword(){
        //call persistent node to modify password by communicating with firebase.
    }

    MasterVolumeChanged(value: number){
        this.curMasterVolume = value;
        // change volume
        // pass value to persistent node
    }

    MusicVolumeChanged(value: number){
        this.curMusicVolume = value;
        // change volume
        // pass value to persistent node
    }

    SFXVolumeChanged(value: number){
        this.curSFXVolume = value;
        // change volume
        // pass value to persistent node
    }

    CameraShakeEnableChanged(value: boolean){
        this.CameraShakeEnable = value;
        console.log(this.CameraShakeEnable);
        // change CameraShakeEnable
        // pass value to persistent node
    }

    handleLogout(){
        console.log("logout");
        // call persistent node "handle logout"
        cc.director.loadScene("LoginSignupMenu");
    }
}
