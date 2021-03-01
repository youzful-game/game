import * as Phaser from "phaser";

import GameOverState from "./GameOverState";
import GameState from "./GameState";
import LFBGameState from "./LFBGameState";
import YAPLAGameState from "./YAPLAGameState";
import KLSGameState from "./KLSGameState";
import BLANKGameState from "./BLANKGameState";
import JSEGameState from "./JSEGameState";
import LevelClearedState from "./LevelClearedState";
import VideoSelectState from "./VideoSelectState";
import HelpState from "./HelpState";
import InitState from "./InitState";
import MenuState from "./MenuState";
import RewardState from "./RewardState";
import LevelsState from "./LevelsState";
import PreInitState from "./PreInitState";

const config: Phaser.Types.Core.GameConfig = {
  backgroundColor: "#006f50",
  dom: {
      createContainer: true
  },
  height: 400,
  parent: "game-container",
  scene: [
    PreInitState,
    InitState,
    MenuState,
    LevelsState,
    GameState,
    LFBGameState,
    YAPLAGameState,
    KLSGameState,
    BLANKGameState,
    JSEGameState,
    LevelClearedState,
    RewardState,
    HelpState,
    GameOverState,
    VideoSelectState,
  ],
  type: Phaser.AUTO,
  width: 550,
};

export const game = new Phaser.Game(config);
