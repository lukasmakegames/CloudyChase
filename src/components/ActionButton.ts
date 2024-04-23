
export class ActionButton extends Phaser.GameObjects.Text {
    protected static readonly HOVER_SCALE = .95;
    protected static readonly TEXT_COLOR = "#970e22";

    constructor(scene: Phaser.Scene, label: string, posX: number, posY: number) {
        super(scene, posX, posY, label, {
            padding: {
                left: 40,
                right: 40,
                top: 20,
                bottom: 20
            },
            fontSize: "24px",
            color: ActionButton.TEXT_COLOR,
            backgroundColor: "white"
        });

        this.setOrigin(.5);

        this.setInteractive();
        this.on("pointerdown", () => {
            this.setScale(ActionButton.HOVER_SCALE, ActionButton.HOVER_SCALE);
        });
        this.on("pointerup", () => {
            this.setScale(1, 1);
        });
   }

   public onClick(handleOnClick: () => void) {
        this.on("pointerdown", handleOnClick);

        return this;
   }
}
