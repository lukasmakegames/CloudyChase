
export class BestScoreService {
    protected static readonly LOCALSTORAGE_KEY = '_fp_g_bestScore_';
    protected static $_instance: BestScoreService;

    static getInstance() {
        if (!this.$_instance) {
            this.$_instance = new BestScoreService();
        }

        return this.$_instance;
    }

    protected constructor() {}

    public getBestScore(): string|null {
        return localStorage.getItem(BestScoreService.LOCALSTORAGE_KEY);
    }

    public updateIfScoreBetter(candidateScore: number) {
        const scoreStr = this.getBestScore() || '0';
        const oldScore = parseInt(scoreStr);

        if (oldScore && isFinite(oldScore) && oldScore > candidateScore) {
            return;
        }

        localStorage.setItem(BestScoreService.LOCALSTORAGE_KEY, String(candidateScore));
    }
}
