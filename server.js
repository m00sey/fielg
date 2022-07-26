const express = require('express');
const app = express();
const port = 3000;

let count = 1;

app.get('/hi', (req, res) => {
    count += 1;
    res.send(`I am from express ${count}`);
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
})