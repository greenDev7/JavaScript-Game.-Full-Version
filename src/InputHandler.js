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
        
        // обработчик нажатия на кнопку "Shoot!"
        let fireButton = document.getElementById("shoot_btn");
        fireButton.addEventListener('click', () => {
            this.game.player.shootTop();
        });


        // Привязка тачпада для управления морским коньком
        let canvas = document.getElementById("canvas1");
        let initialY;

        canvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            initialY = e.touches[0].clientY;
        });

        canvas.addEventListener('touchmove', (e) => {
            let deltaY = e.touches[0].clientY - initialY;
            initialY = e.touches[0].clientY;

            if (deltaY < 0) {
                this.game.keys.add('ArrowUp');
                this.game.keys.delete('ArrowDown');
            } else if (deltaY > 0) {
                this.game.keys.add('ArrowDown');
                this.game.keys.delete('ArrowUp');
            }
        });

        canvas.addEventListener('touchend', (e) => {
            this.game.keys.clear();
        });
    }
}