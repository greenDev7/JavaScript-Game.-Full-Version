class UI {
    constructor(game) {
        this.game = game;
        this.fontSize = 25;
        this.fontFamily = 'Helvetica';
        this.color = 'white';
    }

    draw(context) {
        context.save();
        context.fillStyle = this.color;
        context.shadowOffsetX = 2;
        context.shadowOffsetY = 2;
        context.shadowColor = 'black';
        context.font = this.fontSize + 'px ' + this.fontFamily;
        // очки
        context.fillText('Score: ' + this.game.score, 20, 40);
        // таймер
        const formattedTime = (this.game.gameTime * 0.001).toFixed(1);
        context.fillText('Timer: ' + formattedTime, 20, 100);
        // сообщения о победе/проигрыше
        if (this.game.gameOver) {
            context.textAlign = 'center';
            let message1;
            let message2;
            if (this.game.isWin()) {
                message1 = 'Победа!';
                message2 = 'Отличная работа!';
            } else {
                message1 = 'Попробуй еще раз!';
                message2 = 'В следующий раз все получится!';
            }
            context.font = '70px ' + this.fontFamily;
            context.fillText(message1, this.game.width * 0.5, this.game.height * 0.5 - 20);
            context.font = '25px ' + this.fontFamily;
            context.fillText(message2, this.game.width * 0.5, this.game.height * 0.5 + 20);
        }
        // рисуем количество патронов в левом верхнем углу игрового поля
        if (this.game.player.powerUp) context.fillStyle = '#ffffbd'; // устанавливаем цвет
        for (let i = 0; i < this.game.ammo; i++) {
            context.fillRect(5 * i + 20, 50, 3, 20);
        }
        context.restore();
    }
}