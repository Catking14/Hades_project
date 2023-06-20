const {ccclass, property} = cc._decorator;

declare const firebase: any;

@ccclass
export default class Data extends cc.Component {

    @property (cc.Prefab)
    coin_prefab: cc.Prefab = null;

    @property (cc.Prefab)
    heal_posion_prefab: cc.Prefab = null;

    // node pool
    coin_pool: cc.NodePool = null;
    coin_num: number = 0;
    heal_posion_pool: cc.NodePool = null;
    heal_posion_num: number = 0;

    // current scene
    scene: string = null;
    next_scene: string = null;
    stage: number = 1;

    // in shop
    in_shop: boolean = false;

    // current player role
    role: string = "Warrior";

    // player level
    HP: number = 100;
    heal: number = 0;
    dash: number = 0.0;
    damage: number = 0;

    // money for next level upgrade 
    money: number = 0;
    next_health: number = 100;
    next_heal: number = 100;
    next_dash: number = 100;
    next_damage: number = 100;

    // statistics data
    total_kills: number = 0;
    total_death: number = 0;
    total_clear: number = 0;
    total_damage_taken: number = 0;
    total_damage_made: number = 0;
    total_money_get: number = 0;
    total_money_spent: number = 0;
    total_upgrades: number = 0;
    total_playtime: number = 0;     // in sec maybe?
    total_Boss_killed: number = 0;

    // statistic for single round
    time: number = 0;
    kills: number = 0;
    damage_made: number = 0;

    // Main Menu Data
    Warrior_lock: boolean = false;
    Viking_lock: boolean = true;
    Archor_lock: boolean = true;
    Wizard_lock: boolean = true;
    Assassin_lock: boolean = true;
    curName: string = "Hades";
    curEmail: string = "Hades@gmail.com";

    curMasterVolume: number = 0.5;
    curMusicVolume: number = 0.3;
    curSFXVolume: number = 0.3;
    CameraShakeEnable: boolean = true;

    setVolume()
    {
        if (this.curMasterVolume == undefined || this.curMusicVolume == undefined || this.curSFXVolume == undefined)
        {
            this.curMasterVolume = 0.5;
            this.curMusicVolume = 0.3;
            this.curSFXVolume = 0.3;
            this.CameraShakeEnable = true;
        }
        cc.audioEngine.setMusicVolume(this.curMasterVolume * this.curMusicVolume);
        cc.audioEngine.setEffectsVolume(this.curMasterVolume * this.curSFXVolume);
    }

    refresh_round()
    {
        // clear data
        this.time = 0;
        this.kills = 0;
        this.damage_made = 0;
    }

    summarize()
    {
        // console.log(this.total_playtime, this.time);
        // sum data to total
        this.total_playtime += this.time;
        this.total_kills += this.kills;
        this.total_damage_made += this.damage_made;
    }

    write_data()
    {
        let uid = firebase.auth().currentUser.uid;
        let ref = firebase.database().ref("Player/" + uid);

        // console.log(this.total_playtime);

        ref.set(
            {
                HP: this.HP,
                heal: this.heal,
                dash: this.dash,
                damage: this.damage,
                next_health: this.next_health,
                next_heal: this.next_heal,
                next_dash: this.next_dash,
                next_damage: this.next_damage,
                money: this.money,
                total_kills: this.total_kills,
                total_death: this.total_death,
                total_clear: this.total_clear,
                total_damage_taken: this.total_damage_taken,
                total_damage_made: this.total_damage_made,
                total_money_get: this.total_money_get,
                total_money_spent: this.total_money_spent,
                total_upgrades: this.total_upgrades,
                total_playtime: this.total_playtime,
                total_Boss_killed: this.total_Boss_killed,
                role: this.role,
                Warrior_lock: this.Warrior_lock,
                Viking_lock: this.Viking_lock,
                Archor_lock: this.Archor_lock,
                Wizard_lock: this.Wizard_lock,
                Assassin_lock: this.Assassin_lock,
                curMasterVolume: this.curMasterVolume,
                curMusicVolume: this.curMusicVolume,
                curSFXVolume: this.curSFXVolume,
                CameraShakeEnable: this.CameraShakeEnable
            }
        )
    }


    onLoad () 
    {
        // persistent data node
        cc.game.addPersistRootNode(this.node);

        firebase.auth().onAuthStateChanged((user) => 
        {
            if (user) 
            {
                this.GetDataFromFirebase();
            }
        });
    }

    start () 
    {
        // init node pool
        this.coin_pool = new cc.NodePool();
        this.coin_num = 100;
        for (let i = 0; i < 100; i++)
            this.coin_pool.put(cc.instantiate(this.coin_prefab));
        
        this.heal_posion_pool = new cc.NodePool();
        this.heal_posion_num = 30;
        for (let i = 0; i < 30; i++)
            this.heal_posion_pool.put(cc.instantiate(this.heal_posion_prefab));
    }

    GetDataFromFirebase(){
        // get data from firebase
        // TODO
        let uid = firebase.auth().currentUser.uid;
        // let uid = "";
        let ref = firebase.database().ref("Player/" + uid);

        this.curName = firebase.auth().currentUser.displayName;
        this.curEmail = firebase.auth().currentUser.email;

        ref.once("value").then((snapshot) => 
        {
            let info = snapshot.val();

            this.HP = info.HP;
            this.heal = info.heal;
            this.dash = info.dash;
            this.damage = info.damage;
            this.next_health = info.next_health;
            this.next_heal = info.next_heal;
            this.next_dash = info.next_dash;
            this.next_damage = info.next_damage;
            this.money = info.money;
            this.total_kills = info.total_kills;
            this.total_death = info.total_death;
            this.total_clear = info.total_clear;
            this.total_damage_made = info.total_damage_made;
            this.total_damage_taken = info.total_damage_taken;
            this.total_money_get = info.total_money_get;
            this.total_money_spent = info.total_money_spent;
            this.total_upgrades = info.total_upgrades;
            this.total_playtime = info.total_playtime;
            this.total_Boss_killed = info.total_Boss_killed;
            this.Warrior_lock = info.Warrior_lock;
            this.Viking_lock = info.Viking_lock;
            this.Archor_lock = info.Archor_lock;
            this.Wizard_lock = info.Wizard_lock;
            this.Assassin_lock = info.Assassin_lock;
            this.curMasterVolume = info.curMasterVolume;
            this.curMusicVolume = info.curMusicVolume;
            this.curSFXVolume = info.curSFXVolume;
            this.CameraShakeEnable = info.CameraShakeEnable;
        })
        .catch((error) =>
        {
            console.log(error.message);
            
            this.HP = 100;
            this.heal = 0;
            this.dash = 0;
            this.damage = 0;
            this.next_health = 100;
            this.next_heal = 100;
            this.next_dash = 100;
            this.next_damage = 100;
            this.money = 0;
            this.total_kills = 0;
            this.total_death = 0;
            this.total_clear = 0;
            this.total_damage_made = 0;
            this.total_damage_taken = 0;
            this.total_money_get = 0;
            this.total_money_spent = 0;
            this.total_upgrades = 0;
            this.total_playtime = 0;
            this.total_Boss_killed = 0;
            this.role = "Warrior";
            this.Warrior_lock = false;
            this.Viking_lock = true;
            this.Archor_lock = true;
            this.Wizard_lock = true;
            this.Assassin_lock = true;
            this.curMasterVolume = 0.5;
            this.curMusicVolume = 0.3;
            this.curSFXVolume = 0.3;
            this.CameraShakeEnable = true;
        })
        .finally(() => 
        {
            this.setVolume();
        });
    }

    update (dt) 
    {
        // rounding for some data
        this.next_health = Math.ceil(this.next_health);
        this.next_heal = Math.ceil(this.next_heal);
        this.next_dash = Math.ceil(this.next_dash);
        this.next_damage = Math.ceil(this.next_damage);

        this.scene = cc.director.getScene().name;
        // console.log(this.scene);
        // console.log(cc.find("Data").getComponent("Data").time);
    }

    Signup(name: string, email: string, password: string){
        firebase.auth().createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
            userCredential.user.updateProfile({
                displayName: name
            })
            .then(() =>
            {
                this.curName = name;
            })
            .catch(error =>
            {
                console.log(error.message);
            });
            this.curEmail = email;
            console.log("success", "sign up successfully");
            this.Login(email, password);
        })
        .catch(error =>{
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(errorCode, errorMessage);
        });
    }

    Login(email: string, password: string){
        firebase.auth().signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            console.log("log in successfully");
            cc.find("Canvas/bg").getComponent("LoginSignupMenuManager").PrepareToStartGame();
        })
        .catch(e => {
            console.log("error", "failed to sign up");
        });
    }

    ModifyCurName(NewName: string){
        firebase.auth().currentUser.updateProfile({displayName: NewName})
        .then(() =>
        {
            console.log("Name changed successful");
        })
        .catch(error =>
        {
            console.log(error.message);
            alert(error.message);
        });
    }

    ModifyCurPassword(NewPassword: string){
        firebase.auth().currentUser.updatePassword(NewPassword)
        .then(() =>
        {
            console.log("Password changed successful");
        })
        .catch(error =>
        {
            console.log(error.message);
            alert(error.message);
        })
    }
}
