require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')


const app = express()

app.get('/', (req, res) => {
    res.send('Fucking Better Better Better Better Than More')
})

//middleware section
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use(cors())

//import transactions router V2
const RouterV2 = require('./route/route')
app.use(RouterV2)

const PORT = process.env.PORT || 3000

app.listen(PORT,  () => {
    console.log(`server is listening at port: ${PORT}`)
})