const express = require('express');
const app = express();
const port = 3000;

let highestScore = 0;

app.use(express.json());

app.get('/highest-score', (req, res) => {
    res.json({ highestScore });
});

app.post('/highest-score', (req, res) => {
    const { score } = req.body;
    if (score > highestScore) {
        highestScore = score;
    }
    res.json({ highestScore });
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

