class Game {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.background = new Background(this);
        this.player = new Player(this);
        this.input = new InputHandler(this);
        this.ui = new UI(this);
        this.keys = [];
        this.enemies = [];
        this.particles = [];
        this.explosions = [];
        this.enemyTimer = 0;
        this.enemyInterval = 1000;
        this.ammo = 20;
        this.maxAmmo = 50;
        this.ammoTimer = 0;
        this.ammoInterval = 500;
        this.gameOver = false;
        this.score = 0;
        this.winningScore = 100;
        this.gameTime = 0;
        this.timeLimit = 30 * 1000;
        this.speed = 1;
        this.debug = false;
    }

    update(deltaTime) {
        if (!this.gameOver) this.gameTime += deltaTime;
        if (this.gameTime > this.timeLimit) this.gameOver = true;
        this.background.update();
        this.background.layer4.update();
        this.player.update(deltaTime);
        if (this.ammoTimer > this.ammoInterval) {
            if (this.ammo < this.maxAmmo) this.ammo++;
            this.ammoTimer = 0;
        } else {
            this.ammoTimer += deltaTime;
        }
        // Обновляем и удаляем шестеренки (частицы)
        this.particles.forEach(p => p.update());
        this.particles = this.particles.filter(p => !p.markedForDeletion);
        // Обновляем и удаляем взрывы (explosions)
        this.explosions.forEach(ex => ex.update(deltaTime));
        this.explosions = this.explosions.filter(ex => !ex.markedForDeletion);

        this.enemies.forEach(enemy => {
            enemy.update();
            // если игрок столкнулся с врагом, то...
            if (this.checkCollision(this.player, enemy)) {
                enemy.markedForDeletion = true;
                this.addExplosion(enemy); // добавляем взрыв
                this.addParticles(enemy.lives, enemy); // добавляем разлетающиеся частицы, их количество равно жизням врага, с которым столкнулся игрок 
                // Если наш игрок столкнулся с Рыбкой-Удачей
                if (enemy.type === 'lucky')
                    this.player.enterPowerUp(); // Активируем "Энергетический режим"
                else if (!this.gameOver) this.score--; // Если столкнулся с другим врагом - отнимаем из жизни игрока одну жизнь
            }
            this.player.projectiles.forEach(projectile => {
                // Если пуля попала в врага
                if (this.checkCollision(projectile, enemy)) {
                    enemy.lives--; // уменьшаем жизни врага на единицу
                    this.addParticles(1, enemy); // добавляем одну разлетающуюся "частицу"
                    projectile.markedForDeletion = true; // удаляем пулю
                    // Проверяем, если у врага не осталось жизней
                    if (enemy.lives <= 0) {
                        enemy.markedForDeletion = true; // удаляем врага 
                        this.addExplosion(enemy); // добавляем взрыв
                        // Если мы уничтожили большого врага (тип hive)  
                        if (enemy.type === 'hive') {
                            for (let i = 0; i < 5; i++) {
                                // создаем массив из 5-ти дронов
                                this.enemies.push(new Drone(this,
                                    enemy.x + Math.random() * enemy.width, enemy.y + Math.random() *
                                    enemy.height * 0.5));
                            }

                        };
                        if (!this.gameOver) this.score += enemy.score; // увеличиваем количество очков игрока       
                        if (this.isWin()) this.gameOver = true;  // проверяем условие победы
                    }
                }
            })
        });

        this.enemies = this.enemies.filter(enemy => !enemy.markedForDeletion);

        if (this.enemyTimer > this.enemyInterval && !this.gameOver) {
            this.addEnemy();
            this.enemyTimer = 0;
        } else {
            this.enemyTimer += deltaTime;
        }
    }

    draw(context) {
        this.background.draw(context); // Сначала рисуем фон (первые три слоя)
        this.player.draw(context); // а потом все остальные объекты игры: игрока, UI, враги и т.п.
        this.ui.draw(context);
        this.particles.forEach(particle => particle.draw(context));
        this.enemies.forEach(enemy => enemy.draw(context));
        this.explosions.forEach(ex => ex.draw(context));
        this.background.layer4.draw(context); // Рисуем 4-ый слой, чтобы он был спереди всех объектов
    }

    addEnemy() {
        const randomize = Math.random();
        if (randomize < 0.3) this.enemies.push(new Angler1(this));
        else if (randomize < 0.6) this.enemies.push(new Angler2(this));
        else if (randomize < 0.7) this.enemies.push(new HiveWhale(this));
        else this.enemies.push(new LuckyFish(this));
    }

    addParticles(number, enemy) {
        for (let i = 0; i < number; i++) {
            this.particles.push(new Particle(this, enemy.x + enemy.width * 0.5, enemy.y + enemy.height * 0.5));
        };
    }

    addExplosion(enemy) {
        const randomize = Math.random();
        if (randomize < 0.5) {
            this.explosions.push(new SmokeExplosion(this, enemy.x + enemy.width * 0.5,
                enemy.y + enemy.height * 0.5));
        } else {
            this.explosions.push(new FireExplosion(this, enemy.x + enemy.width * 0.5,
                enemy.y + enemy.height * 0.5));
        }
    }

    checkCollision(rect1, rect2) {
        return (
            rect1.x < rect2.x + rect2.width &&
            rect2.x < rect1.x + rect1.width &&
            rect1.y < rect2.y + rect2.height &&
            rect2.y < rect1.y + rect1.height)
    }

    isWin() {
        return this.score >= this.winningScore;
    }
}