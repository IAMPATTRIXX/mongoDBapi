require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')


const app = express()

app.get('/', (req, res) => {
    res.send('Hello World')
})


app.listen(80, function () {
  console.log('CORS-enabled web server listening on port 80')
})

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'https://hotel-booking-project-d6271.web.app/')
  res.header('Access-Control-Allow-Credentials', true)
  res.header('Access-Control-Allow-Methods','POST, GET, PUT, PATCH, DELETE, OPTIONS')
  res.header('Access-Control-Allow-Headers','Content-Type, Option, Authorization')
  return next()
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