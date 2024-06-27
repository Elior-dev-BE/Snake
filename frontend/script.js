document.addEventListener('DOMContentLoaded', function() {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    const scoreElement = document.getElementById('score');
    const resetButton = document.getElementById('reset');

    const box = 20;
    const canvasSize = 400;
    canvas.width = canvasSize;
    canvas.height = canvasSize;

    let snake = [{ x: 9 * box, y: 10 * box }];
    let food = { x: Math.floor(Math.random() * 19 + 1) * box, y: Math.floor(Math.random() * 19 + 1) * box };
    let direction;
    let score = 0;
    let game;

    document.addEventListener('keydown', setDirection);
    document.getElementById('left').addEventListener('click', () => setDirection({ keyCode: 37 }));
    document.getElementById('up').addEventListener('click', () => setDirection({ keyCode: 38 }));
    document.getElementById('down').addEventListener('click', () => setDirection({ keyCode: 40 }));
    document.getElementById('right').addEventListener('click', () => setDirection({ keyCode: 39 }));
    resetButton.addEventListener('click', resetGame);

    async function getHighestScore() {
        const response = await fetch('http://localhost:3000/highest-score');
        const data = await response.json();
        return data.highestScore;
    }

    async function updateHighestScore(score) {
        const response = await fetch('http://localhost:3000/highest-score', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ score })
        });
        const data = await response.json();
        return data.highestScore;
    }

    function setDirection(event) {
        if (event.keyCode === 37 && direction !== 'RIGHT') direction = 'LEFT';
        else if (event.keyCode === 38 && direction !== 'DOWN') direction = 'UP';
        else if (event.keyCode === 39 && direction !== 'LEFT') direction = 'RIGHT';
        else if (event.keyCode === 40 && direction !== 'UP') direction = 'DOWN';
    }

    function collision(newHead, snake) {
        for (let segment of snake) {
            if (newHead.x === segment.x && newHead.y === segment.y) {
                return true;
            }
        }
        return false;
    }

    async function handleGameOver() {
        clearInterval(game);
        const highestScore = await updateHighestScore(score);
        alert(`Game Over! Your score: ${score}. Highest score: ${highestScore}`);
    }

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        for (let segment of snake) {
            ctx.fillStyle = 'lightgreen';
            ctx.fillRect(segment.x, segment.y, box, box);

            ctx.strokeStyle = 'darkgreen';
            ctx.strokeRect(segment.x, segment.y, box, box);
        }

        ctx.fillStyle = 'red';
        ctx.fillRect(food.x, food.y, box, box);

        let snakeX = snake[0].x;
        let snakeY = snake[0].y;

        if (direction === 'LEFT') snakeX -= box;
        if (direction === 'UP') snakeY -= box;
        if (direction === 'RIGHT') snakeX += box;
        if (direction === 'DOWN') snakeY += box;

        if (snakeX === food.x && snakeY === food.y) {
            score++;
            scoreElement.textContent = score;
            food = { x: Math.floor(Math.random() * 19 + 1) * box, y: Math.floor(Math.random() * 19 + 1) * box };
        } else {
            snake.pop();
        }

        let newHead = { x: snakeX, y: snakeY };

        if (snakeX < 0 || snakeY < 0 || snakeX >= canvas.width || snakeY >= canvas.height || collision(newHead, snake)) {
            handleGameOver();
        } else {
            snake.unshift(newHead);
        }
    }

    function startGame() {
        direction = undefined;
        score = 0;
        scoreElement.textContent = score;
        snake = [{ x: 9 * box, y: 10 * box }];
        food = { x: Math.floor(Math.random() * 19 + 1) * box, y: Math.floor(Math.random() * 19 + 1) * box };
        game = setInterval(draw, 100);
    }

    function resetGame() {
        clearInterval(game);
        startGame();
    }

    startGame();
});
