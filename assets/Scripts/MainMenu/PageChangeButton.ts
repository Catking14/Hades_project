const {ccclass, property} = cc._decorator;

@ccclass
export default class PageChangeButton extends cc.Component {

    onLoad(){
        let PageChangetButton = new cc.Component.EventHandler();
        PageChangetButton.target = this.node;
        PageChangetButton.component = "PageChangeButton";
        PageChangetButton.handler = "handlePageChange";
        this.node.getComponent(cc.Button).clickEvents.push(PageChangetButton);
    }

    // start () {}

    // update (dt) {}

    handlePageChange(){
        let target: number;
        if(this.node.name == "ChangePageOneButton") target = 1;
        else if(this.node.name == "ChangePageTwoButton") target = 2;
        else target = 3;
        cc.find("Canvas/bg/MainMenu").getComponent("MainMenuManager").ChangePage(target);
    }
}
