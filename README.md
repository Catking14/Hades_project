# Hades_project
Software Studio 2023 final project

### 遊戲流程

### 主流程

    主選單 => 大廳 => 戰鬥關卡 => BOSS => 結算
    收集金幣解鎖新角色、技能
  
### 遊戲要素

    4種(以上)角色隨金幣解鎖，
    3種(以上)關卡風格
  
### 角色

- [x] 坦克
- [x] 射手
- [x] 法師
- [x] 戰士
- [ ] 奶媽
- [x] 刺客
  
### 素材

---

#### 角色

<!-- 
瑟雷西：https://luizmelo.itch.io/ghost-warrior-3

李星: https://ansimuz.itch.io/gothicvania-church-pack

亞所: https://luizmelo.itch.io/martial-hero

雞毛撢子: https://luizmelo.itch.io/evil-wizard-2

貓貓: https://luizmelo.itch.io/pet-cat-pack -->

坦克: https://dreamir.itch.io/viking
`砍擊(普攻)，丟石頭，抵擋指定方向攻擊, Dash`  
戰士: https://luizmelo.itch.io/martial-hero-3
`砍擊(普攻)，丟石頭，增傷上buff, Dash`  
射手: https://luizmelo.itch.io/huntress-2
`射箭(普攻)，丟石頭，冰凍箭, Dash`  
法師: https://luizmelo.itch.io/wizard-pack
`火球(普攻)，丟石頭，範圍招, Dash`  
刺客: https://luizmelo.itch.io/dark-knight
`戳刺(普攻)，丟石頭，瞬獄影殺陣, Dash`  

<!-- https://luizmelo.itch.io/hero-knight
https://luizmelo.itch.io/knight-pack
https://luizmelo.itch.io/knights-pack
https://luizmelo.itch.io/fire-worm 
https://aamatniekss.itch.io/fantasy-knight-free-pixelart-animated-character -->

#### 怪物

https://luizmelo.itch.io/monsters-creatures-fantasy
https://clembod.itch.io/bringer-of-death-free
https://elthen.itch.io/2d-pixel-art-minotaur-sprites
https://chierit.itch.io/boss-demon-slime
https://dreamir.itch.io/goblins-pack
https://ansimuz.itch.io/gothicvania-patreon-collection
https://darkpixel-kronovi.itch.io/undead-executioner

#### 特效

https://ansimuz.itch.io/explosion-animations-pack
https://pimen.itch.io/fire-spell-effect-02
https://nyknck.itch.io/effectnpt

#### 關卡

https://assetstore.unity.com/packages/2d/environments/topdown-tileset-mega-bundle-rogue-adventure-238463


#### UI

按鍵UI:https://greatdocbrown.itch.io/gamepad-ui

### cocos creator 版本

    沿用2.4.8

### 評語

1. 地圖視角類型要早點確定
2. 大量敵人出現時，如何維持系統運作效能
3. 敵人之間的互動正確性(正確碰撞, 不會穿插)
4. 特效衝滿就對"  要適度調整遊玩體驗，不然一直死掉重新開始遊戲會讓玩家疲憊  （James）

隨機關卡可以多設計，2.5D？特效上感覺可以有很多發揮空間，多人連線也可以早一點開始，成長系統可能會比較難demo  

這款游戲有點複雜，可能做出很多敵人以及skill游戲才不會無聊  

死了都要重來可能會玩到很生氣或很膩，所以道具、技能要更多樣化、吸引人；素材、特效要用心找一下  

個人覺得Hades的特色還需要有連招跟史詩級的打擊音效，讓整個打擊感上升

### 實作

#### 角色攻擊系統互動

分成4個group，分別是

- player (角色本身)  
需要實作 `damage()` ，當角色被攻擊時會 call 這個 function ，傳入的參數為傷害數值跟效果(目前還沒有效果)
- enermy (怪物本身)  
需要實作 `damage()`
- player_attack (角色的攻擊，像是劍的揮擊或是飛出去的火球、箭矢)  
與 enermy 碰撞時，會 call enermy 的 `damage()`
- enermy_attack (怪物的攻擊)  
與 player 碰撞時，會 call player 的 `damage()`
