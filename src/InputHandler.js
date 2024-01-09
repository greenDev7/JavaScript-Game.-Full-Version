class InputHandler {
    constructor(game) {
        this.game = game;
        
        window.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
                this.game.keys.add(e.key);
            } else if (e.key === ' ') {
                this.game.player.shootTop();
            } else if (e.key === 'd') {
                this.game.debug = !this.game.debug;
            }
        });

        window.addEventListener('keyup', (e) => {
            this.game.keys.delete(e.key);
        });
    }
}