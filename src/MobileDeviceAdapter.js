class MobileDeviceAdapter {

    static handleShootButton(game) {
        let shootButton = document.getElementById("shoot_btn");
        shootButton.addEventListener('click', () => {
            game.player.shootTop();
        });
    }

    static handleTouchPad(game) {
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
                game.keys.add('ArrowUp');
                game.keys.delete('ArrowDown');
            } else if (deltaY > 0) {
                game.keys.add('ArrowDown');
                game.keys.delete('ArrowUp');
            } else /* if (deltaY === 0) */ {
                game.keys.clear();
            }
        });

        canvas.addEventListener('touchend', (e) => {
            game.keys.clear();
        });
    }

    static handleUI() {
        // показываем кнопку "Shoot"
        document.getElementById("shoot_btn").style.display = "Block";
        // и меняем надпись с правилами игры
        document.getElementById("description").innerText = "Перемещай морского конька с помощью тачпада и используй кнопку в правом нижнем углу для стрельбы. \n" +
            "Для победы необходимо за 30 секунд набрать 100 очков";
    }
}