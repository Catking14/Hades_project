// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class LobbyShop extends cc.Component {

    @property(cc.Prefab)
    menu: cc.Prefab = null;

    shop_menu: cc.Node = null;

    // whether the player in the range to talk
    _in_range: boolean = false;

    // key status
    _f_pressed: boolean = false;

    // pop up hint
    @property(cc.Prefab)
    hint: cc.Prefab = null;
    pop_hint: cc.Node = null;

    // LIFE-CYCLE CALLBACKS:

    onLoad () 
    {
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyPressed, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyRelease, this);
        console.log(this._in_range, this._f_pressed);
    }

    start () {

    }

    // update (dt) {}

    onKeyPressed(event)
    {
        switch(event.keyCode)
        {
            case cc.macro.KEY.f:
                if(this._in_range && !this._f_pressed && this.shop_menu == null)
                {
                    this.shop_menu = cc.instantiate(this.menu);

                    cc.find("Canvas/Main Camera").addChild(this.shop_menu);
                    cc.find("Data").getComponent("Data").in_shop = true;
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

        this.pop_hint = cc.instantiate(this.hint);
        this.pop_hint.getComponent(cc.Label).string = "[F] Shop";
        cc.find("Canvas/Main Camera").addChild(this.pop_hint);
    }

    onePreSolve(contact, self, other)
    {
        if(this.shop_menu)
        {
            this.pop_hint.destroy();
        }
    }

    onEndContact(contact, self, other)
    {
        this._in_range = false;

        if(this.shop_menu)
        {
            cc.find("Data").getComponent("Data").in_shop = false;
            this.shop_menu.destroy();
            this.shop_menu = null;
        }

        if(this.pop_hint)
        {
            this.pop_hint.destroy();
        }
    }
}
