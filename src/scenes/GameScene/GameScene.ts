import { GameBackground } from "../../components/GameBackground";
import { ScoresWidget } from "../../components/ScoresWidget";
import { BestScoreService } from "../../components/services/BestScoreService";
import { GAME_OVER_SCENE, GAME_SCENE } from "../../constants/scenes";
import { BaseScene } from "../BaseScene";
import { INTERACT_EVENT } from "./events";

// @TODO add health bar dino
// @TODO add damage red tint dino
// @TODO food add power
// @TODO power bar
// @TODO special attack


export class GameScene extends BaseScene {

    protected static readonly BIRD_GRAVITY = 400;
    protected static get baseJumpForce() {
        return this.BIRD_GRAVITY * 2;
    };
    protected static readonly LANDSCAPE_SPEED = 6;
    protected static readonly FIREBALL_SPEED = 6;
    protected static readonly BACKGROUND_SPEED = 0.6;
    protected static readonly SPAWN_PIPES_INTERVAL = 1100;

    protected isTurned: boolean = false;
    protected isGameOver: boolean = false;
    protected isGameStarted: boolean = false;
    protected bgSprite: GameBackground;
    protected landscape: Phaser.GameObjects.TileSprite;
    protected landscapeTop: Phaser.GameObjects.TileSprite;

    protected interactToPlayWidget: Phaser.GameObjects.Text;

    protected bird: Phaser.Types.Physics.Arcade.ImageWithDynamicBody;
    protected dino: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
    protected ball: Phaser.GameObjects.Image;
    protected pipes: Phaser.Physics.Arcade.Group;
    protected fireballs: Phaser.Physics.Arcade.Group;
    protected foods: Phaser.Physics.Arcade.Group;

    protected pipeFrameIndex: number;

    protected wingAudio: Phaser.Sound.BaseSound;
    protected hitAudio: Phaser.Sound.BaseSound;

    protected scoreWidget: ScoresWidget;
    protected score: number = 0;

    protected lastDinoPosY: number = -1;
    protected nextDinoPosY: number = -1;

    protected emitter: Phaser.GameObjects.Particles.ParticleEmitter;

    constructor() {
        super(GAME_SCENE);
    }

    protected get isGameActive() {
        return !this.isGameOver && this.isGameStarted;
    }

    public create(): void {
        this.isGameOver = false;
        this.isGameStarted = false;
        this.isTurned = false;
        this.score = 0;

        this.nextDinoPosY = -1;
        const { screenHeight, screenWidth } = this.getScreenSize();
        this.lastDinoPosY = screenHeight / 2;

        this._setupBackground();
        this._setupLandscape();
        this._setupBird();
        this._setupDino();
        this._setupPipes();
        this._setupScoreWidget();
        this._setUpClickToPlayWidget();
        this._registerInteractionEvents();

        this.physics.add.collider(this.landscape, this.bird, undefined, undefined, this);
        this.physics.add.collider(this.landscapeTop, this.bird, undefined, undefined, this);

        this.fireballs = this.physics.add.group();
        this.physics.add.overlap(this.pipes, this.fireballs, (_, fireball) => {
            fireball.destroy();
        });


        this.foods = this.physics.add.group();
        this.physics.add.overlap(this.bird, this.foods, (_, food) => {
            this.scoreWidget.setScore(++this.score);
            food.destroy();
        });

        this.wingAudio = this.sound.add('wing');
        this.hitAudio = this.sound.add('hit');

        this.time.addEvent({ delay: GameScene.SPAWN_PIPES_INTERVAL, callback: this.addPipes, callbackScope: this, loop: true });
        this.time.addEvent({ delay: GameScene.SPAWN_PIPES_INTERVAL * 3, callback: this.deletePipes, callbackScope: this, loop: true });

        this.emitter = this.add.particles(0, 32, 'brush', {
            speedX: -1000,
            lifespan: 200,
            scale: { start: 2, end: 0 },
            follow: this.bird,
        });
    }

    public update(time: number, d: number) {
        const delta = d * 0.1;
        if (!this.isGameOver) {
            this.bgSprite.tilePositionX += GameScene.BACKGROUND_SPEED * delta;
            this.landscape.tilePositionX += GameScene.LANDSCAPE_SPEED * delta;
            this.landscapeTop.tilePositionX += GameScene.LANDSCAPE_SPEED * delta;
        }

        if (this.isGameActive) {
            this.pipes.getChildren().forEach((pipe) => {
                if (pipe instanceof Phaser.GameObjects.TileSprite) {
                    pipe.x -= GameScene.LANDSCAPE_SPEED * delta;
                } else if (pipe instanceof Phaser.GameObjects.RenderTexture) {
                    pipe.x -= GameScene.LANDSCAPE_SPEED * delta;
                }
            });

            this.fireballs.getChildren().forEach((fireball) => {
                if (fireball instanceof Phaser.GameObjects.Image) {
                    fireball.x += GameScene.FIREBALL_SPEED * delta;
                    const { screenWidth } = this.getScreenSize();
                    if (fireball.x > screenWidth) {
                        fireball.destroy()
                    }
                }
            });

            this.foods.getChildren().forEach((food) => {
                if (food instanceof Phaser.GameObjects.Image) {
                    food.x -= GameScene.LANDSCAPE_SPEED * delta;
                    if (food.x < 0) {
                        food.destroy()
                    }
                }
            });


            if (this.nextDinoPosY >= 0) {
                let k = 0.03;
                let interpolationDinoY = Phaser.Math.Interpolation.Bezier(
                    [this.dino.y, this.nextDinoPosY],
                    k);
                this.dino.y = interpolationDinoY;
                this.ball.y = this.dino.y;
                if (this.dino.y < this.nextDinoPosY + 64 && this.dino.y > this.nextDinoPosY - 64) {
                    this.lastDinoPosY = this.nextDinoPosY;
                    this.nextDinoPosY = -1;
                }
            }

        }
    }

    public endGame() {
        if (!this.isGameOver) {
            this.isGameOver = true;

            this.hitAudio.play();
            this.bird.setVelocity(0);
            this.registry.set('score', this.score);
            BestScoreService.getInstance().updateIfScoreBetter(this.score);

            this.bird.destroy();
            this.scoreWidget.destroy();

            this.game.scene.start(GAME_OVER_SCENE);
        }
    }

    public startGame() {
        if (!this.isGameOver && !this.isGameStarted) {
            this.isGameStarted = true;
            this.isTurned = false;

            this.bird.body.setGravityY(GameScene.BIRD_GRAVITY * 2);
            this.bird.body.setAllowGravity(true);
            this.bird.scaleY = 1;
            this.interactToPlayWidget.destroy();
        }
    }

    protected jump() {
        if (this.isGameActive) {

            if (!this.isTurned) {
                this.bird.setVelocityY(-GameScene.baseJumpForce);
                this.bird.body.setGravityY(-GameScene.BIRD_GRAVITY * 2);
                this.bird.setFlipY(true);
                this.emitter.setY(-32);
            } else {
                this.bird.setVelocityY(GameScene.baseJumpForce);
                this.bird.body.setGravityY(GameScene.BIRD_GRAVITY * 2);
                this.bird.setFlipY(false);
                this.emitter.setY(32);

            }
            this.isTurned = !this.isTurned;

            this.wingAudio.play();

            this.addFireball(this.bird.x, this.bird.y);
        }
    }

    protected addFireball(x: integer, y: integer) {
        const fireball = this.add.image(x, y, "fireball").setOrigin(0.5, 1);
        this.physics.add.existing(fireball, false);
        this.fireballs.add(fireball);

        (fireball.body as Phaser.Physics.Arcade.Body).setAllowGravity(false);
    }


    protected addPipes() {
        if (this.isGameActive) {
            const { width: pipeFrameWidth } = this.sys.textures.getFrame('pipe', 0);
            const { screenHeight, screenWidth } = this.getScreenSize();
            const availableHeight = screenHeight - this.landscape.height;
            const scoreZoneHeight = screenHeight / 3;

            const setupPipeBody = (body: Phaser.Physics.Arcade.Body) => {
                body.setImmovable();
                body.setAllowGravity(false);
            };

            const topPipeHeight = Phaser.Math.Between(availableHeight / 9, availableHeight / 2);
            const bottomPipeHeight = availableHeight - topPipeHeight - scoreZoneHeight;
            const spawnPipesX = screenWidth + pipeFrameWidth;

            const spawn = Phaser.Math.RND.between(0, 1);

            if (spawn == 0) {

                const pTop = this.add.tileSprite(spawnPipesX, topPipeHeight, 52, topPipeHeight, 'pipe', this.pipeFrameIndex)
                    .setFlipY(true)
                    .setOrigin(0.5, 1);

                this.physics.add.existing(pTop, false);
                this.pipes.add(pTop);
                setupPipeBody(pTop.body as Phaser.Physics.Arcade.Body);

            }

            if (spawn == 1) {

                const pBottom = this.add.tileSprite(spawnPipesX, availableHeight, 52, bottomPipeHeight, 'pipe', this.pipeFrameIndex)
                    .setOrigin(0.5, 1);
                this.physics.add.existing(pBottom, false);
                this.pipes.add(pBottom);
                setupPipeBody(pBottom.body as Phaser.Physics.Arcade.Body);

            }

            const spawnFoodY = spawn == 0 ? Phaser.Math.RND.between(topPipeHeight, screenHeight - scoreZoneHeight) : Phaser.Math.RND.between(0, topPipeHeight);
            this.addFood(spawnPipesX, spawnFoodY)

            if (this.nextDinoPosY == -1) {
                this.nextDinoPosY = spawn == 0 ? topPipeHeight + ((screenHeight - scoreZoneHeight) / 2) : topPipeHeight / 2;

            }
        }
    }

    protected addFood(x: integer, y: integer) {
        const food = this.add.image(x, y, "food").setOrigin(0.5).setScale(0.5);
        this.physics.add.existing(food, false);
        this.foods.add(food);

        (food.body as Phaser.Physics.Arcade.Body).setAllowGravity(false);
    }

    public deletePipes() {
        if (this.isGameActive) {
            this.pipes.getChildren().forEach((pipe) => {
                if (pipe instanceof Phaser.GameObjects.TileSprite && pipe.x < -pipe.width) {
                    pipe.destroy();
                }
            });
        }
    }

    private _setupBackground() {
        this.bgSprite = GameBackground.AddToScene(this);
    }

    private _setupBird() {
        const { screenHeight, screenWidth } = this.getScreenSize();
        this.bird = this.physics.add.image(screenWidth / 2, screenHeight / 2, 'bird').setOrigin(0.5);
        const { body, displayWidth, displayHeight } = this.bird;

        this.bird.setOrigin(0.5, 0.5).setDepth(2);

        body.setSize(displayWidth / 4, displayHeight / 2);
        body.setAllowGravity(false);
        body.setCollideWorldBounds(false);
        body.setAllowRotation(false);
    }

    private _setupDino() {
        const { screenHeight, screenWidth } = this.getScreenSize();
        this.dino = this.physics.add.sprite(screenWidth / 1.25, screenHeight / 2, 'dino').setOrigin(0.5).play("fly");
        const { body, displayWidth, displayHeight } = this.dino;

        this.dino.setOrigin(0.5, 0.5).setDepth(2);
        this.dino.setFlipX(true);

        body.setSize(displayWidth / 2, displayHeight / 2);
        body.setAllowGravity(false);
        body.setCollideWorldBounds(false);
        body.setAllowRotation(false);

        this.ball = this.add.image(screenWidth / 1.25, screenHeight / 2, 'ball').setOrigin(0.5);
        this.ball.setOrigin(-1, 0.5).setDepth(1);

    }

    private _setupScoreWidget() {
        const { screenHeight } = this.getScreenSize();
        this.scoreWidget = ScoresWidget.AddToScene(this, screenHeight / 8);
        this.scoreWidget.setDepth(5).setOrigin(.5);
    }

    private _setUpClickToPlayWidget() {
        const { screenWidth, screenHeight } = this.getScreenSize();
        this.interactToPlayWidget = this.add.text(screenWidth / 2, screenHeight / 8 * 3, "interactToPlay")
            .setOrigin(.5);
    }

    private _setupLandscape() {
        const landscapeTexture = this.sys.textures.get('landscape');
        const { screenHeight, screenWidth } = this.getScreenSize();

        const { height: landscapeImageHeight } = landscapeTexture.getSourceImage();
        this.landscape = this.add.tileSprite(0, screenHeight - landscapeImageHeight, screenWidth, landscapeImageHeight, 'landscape')
            .setOrigin(0)
            .setDepth(1);

        this.landscapeTop = this.add.tileSprite(0, 0, screenWidth, 1, 'landscape')
            .setOrigin(0)
            .setDepth(1)
            .setVisible(false);

        this.physics.add.existing(this.landscape, false);
        ((body: Phaser.Physics.Arcade.Body) => {
            body.allowGravity = false;
            body.setCollideWorldBounds(true);
        })(this.landscape.body as Phaser.Physics.Arcade.Body)


        this.physics.add.existing(this.landscapeTop, false);
        ((body: Phaser.Physics.Arcade.Body) => {
            body.allowGravity = false;
            body.setCollideWorldBounds(true);
        })(this.landscapeTop.body as Phaser.Physics.Arcade.Body)
    }

    private _setupPipes() {
        this.pipes = this.physics.add.group();
        this.pipes.setDepth(1);
        this.physics.add.overlap(this.pipes, this.bird, this.endGame, undefined, this);

        this.pipeFrameIndex = Phaser.Math.Between(0, 1);
    }

    private interactCallback = () => {
        if (this.isGameStarted) {
            this.jump();
        } else {
            this.startGame();
        }
    };

    private _registerInteractionEvents() {
        //prevent interact duplicate
        this.events.off(INTERACT_EVENT, this.interactCallback);

        //interact event
        this.events.on(INTERACT_EVENT, this.interactCallback);

        this.bgSprite.on('pointerdown', () => {
            this.events.emit(INTERACT_EVENT);
        });

        this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER).on('up', () => {
            this.events.emit(INTERACT_EVENT);
        });

        this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE).on('up', () => {
            this.events.emit(INTERACT_EVENT);
        });
    }
}
