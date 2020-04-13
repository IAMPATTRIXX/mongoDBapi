require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')

//MongoDB Atlas connection string
//mongodb+srv://dragonbebo1:<password>@cluster0-2ondk.gcp.mongodb.net/test?retryWrites=true&w=majority

const app = express()

app.get('/', (req, res) => {
    res.send('Hello World')
})

app.get('/products/:id', function (req, res, next) {
  res.json({msg: 'This is CORS-enabled for all origins!'})
})

app.listen(80, function () {
  console.log('CORS-enabled web server listening on port 80')
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
    console.log('Server is listenning at: : '+PORT)
})