
export class ActionButton extends Phaser.GameObjects.BitmapText {
    protected static readonly HOVER_SCALE = .95;
    protected static readonly TEXT_COLOR = "#970e22";

    constructor(scene: Phaser.Scene, label: string, posX: number, posY: number) {
        super(scene, posX, posY, 'font', label, 64);

        this.setOrigin(.5);

        this.setInteractive();
        this.on("pointerdown", () => {
            this.setScale(ActionButton.HOVER_SCALE, ActionButton.HOVER_SCALE);
        });
        this.on("pointerup", () => {
            this.setScale(1, 1);
        });

        this.setDepth(5);

        scene.add.rectangle(posX,posY,this.width+40,this.height+20,0xffffff)
   }

   public onClick(handleOnClick: () => void) {
        this.on("pointerdown", handleOnClick);

        return this;
   }
}
