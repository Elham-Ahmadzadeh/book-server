const express = require('express')
require('dotenv').config()
const path = require('path')
const app = express()
const books = require('./routes/books')
require('dotenv').config()
const port = process.env.PORT || 3001
app.use('/', books)
app.set('view engine', 'pug')

app.listen(port, () => {
  console.log(`server is listening to port ${port}`)
})


