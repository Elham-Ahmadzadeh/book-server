const express = require('express')
const route = express.Router()

const {
  getBookList,
  getOneBook
} = require('../controllers/books')

route.get('/',getBookList)

route.get('/book/:isbn' , getOneBook)

module.exports = route