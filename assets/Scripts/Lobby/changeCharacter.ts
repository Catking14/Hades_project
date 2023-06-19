// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class CharChange extends cc.Component {

    // whether the player in the range to talk
    _in_range: boolean = false;

    // key status
    _f_pressed: boolean = false;

    // playable roles
    @property(cc.Prefab)
    warrior: cc.Prefab = null;

    @property(cc.Prefab)
    archor: cc.Prefab = null;
    
    @property(cc.Prefab)
    viking: cc.Prefab = null;

    @property(cc.Prefab)
    wizard: cc.Prefab = null;

    @property(cc.Prefab)
    assassin: cc.Prefab = null;

    // pop up block
    @property(cc.Prefab)
    emoji: cc.Prefab = null;
    pop_up: cc.Node = null;

    // pop up hint
    @property(cc.Prefab)
    hint: cc.Prefab = null;
    pop_hint: cc.Node = null;

    // role unlock status
    Warrior_lock: boolean = false;
    Viking_lock: boolean = true;
    Archor_lock: boolean = true;
    Wizard_lock: boolean = true;
    Assassin_lock: boolean = true;

    // music effects
    @property(cc.AudioClip)
    buy: cc.AudioClip = null;

    @property(cc.AudioClip)
    error: cc.AudioClip = null;

    // LIFE-CYCLE CALLBACKS:

    onLoad () 
    {
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyPressed, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyRelease, this);
    }

    start () 
    {
        this.Warrior_lock = cc.find("Data").getComponent("Data").Warrior_lock;
        this.Wizard_lock = cc.find("Data").getComponent("Data").Wizard_lock;
        this.Viking_lock = cc.find("Data").getComponent("Data").Viking_lock;
        this.Assassin_lock = cc.find("Data").getComponent("Data").Assassin_lock;
        this.Archor_lock = cc.find("Data").getComponent("Data").Archor_lock;
    }

    update (dt) 
    {
        if(this.pop_hint != null)
        {
            if(this.node.name == "Archor" && cc.find("Data").getComponent("Data").Archor_lock)
            {
                this.pop_hint.getComponent(cc.Label).string = "[F] pay $ 1 to get help of " + this.node.name;
            }
            else if(this.node.name == "Assassin" && cc.find("Data").getComponent("Data").Assassin_lock)
            {
                this.pop_hint.getComponent(cc.Label).string = "[F] pay $ 1 to get help of " + this.node.name;
            }
            else if(this.node.name == "Viking" && cc.find("Data").getComponent("Data").Viking_lock)
            {
                this.pop_hint.getComponent(cc.Label).string = "[F] pay $ 1 to get help of " + this.node.name;
            }
            else if(this.node.name == "Wizard" && cc.find("Data").getComponent("Data").Wizard_lock)
            {
                this.pop_hint.getComponent(cc.Label).string = "[F] pay $ 1 to get help of " + this.node.name;
            }
            else
            {
                this.pop_hint.getComponent(cc.Label).string = "[F] switch to " + this.node.name;
            }
        }
    }

    onKeyPressed(event)
    {
        switch(event.keyCode)
        {
            case cc.macro.KEY.f:
                if(this._in_range && !this._f_pressed)
                {
                    // switch character
                    let role = this.node.name;

                    // current character
                    let cur_role = cc.find("LobbyManager").getComponent("LobbyManager").follow;

                    if(role == "Warrior" && cur_role.name != role)
                    {
                        let war = cc.instantiate(this.warrior);

                        war.setPosition(cur_role.getPosition());

                        // change follow and deactive chosen role, also reactive original role
                        cc.find("LobbyManager").getComponent("LobbyManager").follow.destroy();
                        cc.find("LobbyManager").getComponent("LobbyManager").follow = war;
                        cc.find("Canvas/New Node").addChild(war);
                        // cc.find("LobbyManager").getComponent("LobbyManager").follow = war;

                        cc.find("Canvas/lobby/" + cur_role.name).active = true;
                        this.node.active = false;
                    }
                    else if(role == "Archor" && cur_role.name != role)
                    {
                        if(!cc.find("Data").getComponent("Data").Archor_lock)
                        {
                            let arh = cc.instantiate(this.archor);

                            arh.setPosition(cur_role.getPosition());

                            cc.find("LobbyManager").getComponent("LobbyManager").follow.destroy();
                            cc.find("LobbyManager").getComponent("LobbyManager").follow = arh;
                            cc.find("Canvas/New Node").addChild(arh);
                            // cc.find("LobbyManager").getComponent("LobbyManager").follow = arh;

                            cc.find("Canvas/lobby/" + cur_role.name).active = true;
                            this.node.active = false;
                        }
                        else if(cc.find("Data").getComponent("Data").money >= 1)
                        {
                            cc.find("Data").getComponent("Data").Archor_lock = false;

                            cc.audioEngine.playEffect(this.buy, false);
                        }
                        else
                        {
                            cc.audioEngine.playEffect(this.error, false);
                        }
                    }
                    else if(role == "Viking" && cur_role.name != role)
                    {
                        if(!cc.find("Data").getComponent("Data").Viking_lock)
                        {
                            let vik = cc.instantiate(this.viking);

                            vik.setPosition(cur_role.getPosition());

                            cc.find("LobbyManager").getComponent("LobbyManager").follow.destroy();
                            cc.find("LobbyManager").getComponent("LobbyManager").follow = vik;
                            cc.find("Canvas/New Node").addChild(vik);
                            // cc.find("LobbyManager").getComponent("LobbyManager").follow = vik;

                            cc.find("Canvas/lobby/" + cur_role.name).active = true;
                            this.node.active = false;
                        }
                        else if(cc.find("Data").getComponent("Data").money >= 1)
                        {
                            cc.find("Data").getComponent("Data").Viking_lock = false;

                            cc.audioEngine.playEffect(this.buy, false);
                        }
                        else
                        {
                            cc.audioEngine.playEffect(this.error, false);
                        }
                    }
                    else if(role == "Wizard" && cur_role.name != role)
                    {
                        if(!cc.find("Data").getComponent("Data").Wizard_lock)
                        {
                            let wiz = cc.instantiate(this.wizard);

                            wiz.setPosition(cur_role.getPosition());

                            cc.find("LobbyManager").getComponent("LobbyManager").follow.destroy();
                            cc.find("LobbyManager").getComponent("LobbyManager").follow = wiz;
                            cc.find("Canvas/New Node").addChild(wiz);
                            // cc.find("LobbyManager").getComponent("LobbyManager").follow = wiz;

                            cc.find("Canvas/lobby/" + cur_role.name).active = true;
                            this.node.active = false;
                        }
                        else if(cc.find("Data").getComponent("Data").money >= 1)
                        {
                            cc.find("Data").getComponent("Data").Wizard_lock = false;

                            cc.audioEngine.playEffect(this.buy, false);
                        }
                        else
                        {
                            cc.audioEngine.playEffect(this.error, false);
                        }
                    }
                    else if(role == "Assassin" && cur_role.name != role)
                    {
                        if(!cc.find("Data").getComponent("Data").Assassin_lock)
                        {
                            let asa = cc.instantiate(this.assassin);

                            asa.setPosition(cur_role.getPosition());

                            cc.find("LobbyManager").getComponent("LobbyManager").follow.destroy();
                            cc.find("LobbyManager").getComponent("LobbyManager").follow = asa;
                            cc.find("Canvas/New Node").addChild(asa);
                            // cc.find("LobbyManager").getComponent("LobbyManager").follow = asa;

                            cc.find("Canvas/lobby/" + cur_role.name).active = true;
                            this.node.active = false;
                        }
                        else if(cc.find("Data").getComponent("Data").money >= 1)
                        {
                            cc.find("Data").getComponent("Data").Assassin_lock = false;

                            cc.audioEngine.playEffect(this.buy, false);
                        }
                        else
                        {
                            cc.audioEngine.playEffect(this.error, false);
                        }
                    }
                }

                this._f_pressed = true;
                break;
            default:
                break;
        }
    }

    onKeyRelease(event)
    {
        switch(event.keyCode)
        {
            case cc.macro.KEY.f:
                this._f_pressed = false;
                break;
            default:
                break;
        }
    }

    onBeginContact(contact, self, other)
    {
        this._in_range = true;

        // console.log(this.node.name);

        this.pop_up = cc.instantiate(this.emoji);
        this.pop_up.setPosition(0, 50);
        this.node.addChild(this.pop_up);

        this.pop_hint = cc.instantiate(this.hint);
        
        // if(this.node.name == "Archor" && cc.find("Data").getComponent("Data").Archor_lock)
        // {
        //     this.pop_hint.getComponent(cc.Label).string = "[F] pay $ 1 to get help of " + this.node.name;
        // }
        // else if(this.node.name == "Assassin" && cc.find("Data").getComponent("Data").Assassin_lock)
        // {
        //     this.pop_hint.getComponent(cc.Label).string = "[F] pay $ 1 to get help of " + this.node.name;
        // }
        // else if(this.node.name == "Viking" && cc.find("Data").getComponent("Data").Viking_lock)
        // {
        //     this.pop_hint.getComponent(cc.Label).string = "[F] pay $ 1 to get help of " + this.node.name;
        // }
        // else if(this.node.name == "Wizard" && cc.find("Data").getComponent("Data").Wizard_lock)
        // {
        //     this.pop_hint.getComponent(cc.Label).string = "[F] pay $ 1 to get help of " + this.node.name;
        // }
        // else
        // {
        //     this.pop_hint.getComponent(cc.Label).string = "[F] switch to " + this.node.name;
        // }

        cc.find("Canvas/Main Camera").addChild(this.pop_hint);
    }

    // onPreSolve(contact, self, other)
    // {
    //     this._in_range = true;
    // }

    onEndContact(contact, self, other)
    {
        this._in_range = false;
        this.pop_up.destroy();
        this.pop_hint.destroy();

        this.pop_hint = null;
    }
}
