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

    // LIFE-CYCLE CALLBACKS:

    onLoad () 
    {
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyPressed, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyRelease, this);
    }

    start () {

    }

    // update (dt) {}

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
                        let arh = cc.instantiate(this.archor);

                        arh.setPosition(cur_role.getPosition());

                        cc.find("LobbyManager").getComponent("LobbyManager").follow.destroy();
                        cc.find("LobbyManager").getComponent("LobbyManager").follow = arh;
                        cc.find("Canvas/New Node").addChild(arh);
                        // cc.find("LobbyManager").getComponent("LobbyManager").follow = arh;

                        cc.find("Canvas/lobby/" + cur_role.name).active = true;
                        this.node.active = false;
                    }
                    else if(role == "Viking" && cur_role.name != role)
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
                    else if(role == "Wizard" && cur_role.name != role)
                    {
                        console.log("something?")
                        let wiz = cc.instantiate(this.wizard);

                        wiz.setPosition(cur_role.getPosition());

                        cc.find("LobbyManager").getComponent("LobbyManager").follow.destroy();
                        cc.find("LobbyManager").getComponent("LobbyManager").follow = wiz;
                        cc.find("Canvas/New Node").addChild(wiz);
                        // cc.find("LobbyManager").getComponent("LobbyManager").follow = wiz;

                        cc.find("Canvas/lobby/" + cur_role.name).active = true;
                        this.node.active = false;
                    }
                    else if(role == "Assassin" && cur_role.name != role)
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

        console.log(this.node.name);

        this.pop_up = cc.instantiate(this.emoji);
        this.pop_up.setPosition(0, 50);
        this.node.addChild(this.pop_up);

        this.pop_hint = cc.instantiate(this.hint);
        this.pop_hint.getComponent(cc.Label).string = "[F] switch to " + this.node.name;
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
    }
}
