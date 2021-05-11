const express = require('express')
const route = express.Router()
//
const {
  getBookList,
  getOneBook,
  pageNotFound
} = require('../controllers/books')

route.get('/',getBookList)
route.get('/book/:isbn' , getOneBook)
route.get('*', pageNotFound)
module.exports = route