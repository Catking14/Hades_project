const {ccclass, property} = cc._decorator;

@ccclass
export default class Statistics extends cc.Component {

    private Kills: number;
    private Deaths: number;
    private DamageMade: number;
    private DamageTaken: number;
    private GameCleared: number;
    private Gold: number;
    private Spend: number;
    private BossKills: number;
    private LevelUP: number;
    private TotalPlaytime: number;

    private MainMenuManager: any;

    onLoad(){
        this.MainMenuManager = cc.find("Canvas/bg/MainMenu").getComponent("MainMenuManager");
        this.Kills = this.MainMenuManager.Kills;
        this.Deaths = this.MainMenuManager.Deaths;
        this.DamageMade = this.MainMenuManager.DamageMade;
        this.DamageTaken = this.MainMenuManager.DamageTaken;
        this.GameCleared = this.MainMenuManager.GameCleared;
        this.Gold = this.MainMenuManager.Gold;
        this.Spend = this.MainMenuManager.Spend;
        this.BossKills = this.MainMenuManager.BossKills;
        this.LevelUP = this.MainMenuManager.LevelUP;
        this.TotalPlaytime = this.MainMenuManager.TotalPlaytime;
    }

    start () {
        this.node.getChildByName("LeftPage").getChildByName("kills")
        .getChildByName("value").getComponent(cc.Label).string += this.Kills;

        this.node.getChildByName("LeftPage").getChildByName("deaths")
        .getChildByName("value").getComponent(cc.Label).string += this.Deaths

        this.node.getChildByName("LeftPage").getChildByName("damage_made")
        .getChildByName("value").getComponent(cc.Label).string += this.DamageMade

        this.node.getChildByName("LeftPage").getChildByName("damage_taken")
        .getChildByName("value").getComponent(cc.Label).string += this.DamageTaken

        this.node.getChildByName("LeftPage").getChildByName("game_cleared")
        .getChildByName("value").getComponent(cc.Label).string += this.GameCleared;

        this.node.getChildByName("RightPage").getChildByName("gold")
        .getChildByName("value").getComponent(cc.Label).string += this.Gold;

        this.node.getChildByName("RightPage").getChildByName("spend")
        .getChildByName("value").getComponent(cc.Label).string += this.Spend;

        this.node.getChildByName("RightPage").getChildByName("boss_kills")
        .getChildByName("value").getComponent(cc.Label).string += this.BossKills;

        this.node.getChildByName("RightPage").getChildByName("level_up")
        .getChildByName("value").getComponent(cc.Label).string += this.LevelUP;

        this.node.getChildByName("RightPage").getChildByName("total_playtime")
        .getChildByName("value").getComponent(cc.Label).string += this.TotalPlaytime;
    }

    // update (dt) {}
}
