const express = require('express')
const app = express()
const port = 3000

app.get('/hi', (req, res) => {
    res.send('I am from express')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})