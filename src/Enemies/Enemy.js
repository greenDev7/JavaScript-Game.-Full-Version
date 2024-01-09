class Enemy {
    constructor(game) {
        this.game = game;
        this.x = this.game.width;
        this.speedX = Math.random() * -90 - 270;
        this.markedForDeletion = false;
        this.frameX = 0;
        this.frameY = 0;
        this.maxFrame = 38;
    }

    update(deltaTime) {
        // Обновляем x-координату врага (уменьшаем ее на величину speedX)
        this.x += (this.speedX - this.game.speed) * deltaTime; // а также вычитаем this.game.speed чтобы враги появлялись равномерно, а не все разом
        // Помечаем врага как удаленного, если он полностью пересечет левую границу игрового поля
        if (this.x + this.width < 0) this.markedForDeletion = true;
        // sprite animation
        if (this.frameX < this.maxFrame) {
            this.frameX++;
        } else this.frameX = 0;
    }

    draw(context) {
        if (this.game.debug) { // в режиме дебага
            // нарисуем персонажу (врагу) рамку
            context.strokeRect(this.x, this.y, this.width, this.height);
            // и отобразим у каждого врага его жизни
            context.fillStyle = 'yellow'; // цвет количества жизней
            context.font = '20px Helvetica';
            context.fillText(this.lives, this.x, this.y - 5);
        }
        // Метод drawImage элемента canvas с 9-ю аргументами для "вырезания" кадров из спрайтшита
        context.drawImage(this.image, this.frameX * this.width, this.frameY * this.height, this.width, this.height,
            this.x, this.y, this.width, this.height);
    }
}