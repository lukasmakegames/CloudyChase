
import Phaser from "phaser";
import MainMenu from "./scenes/MenuScene";
import { GameScene } from "./scenes/GameScene";
import { LoadingScene } from "./scenes/LoadingScene";
import { GameOverScene } from "./scenes/GameOverScene";
import { WinScene } from "./scenes/WinScene";

new Phaser.Game({
    type: Phaser.AUTO,
    backgroundColor: 0x000000,
    scale: {
        width: 1920,
        height: 1080,
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    physics: {
        default: 'arcade',
        arcade: {
            debug: !true 
        }
    },
    scene: [LoadingScene, MainMenu, GameScene, GameOverScene, WinScene],
});
