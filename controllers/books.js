const sql = require('mssql')
require('dotenv').config()

const connection = {
  user: process.env.SQL_USERNAME,
  password: process.env.SQL_PASSWORD,
  server: process.env.SQL_SERVER,
  database: process.env.SQL_DATABASE,
  options: {
    enableArithAbort: true,
    trustServerCertificate: true,
  },
}
sql.connect(connection);
 const getBookList = async (req, res) => {
  try {
    const query= `select
    ISBN13,
    title,
    Price_kr,
    ath.FirstName  + ' ' + ath.LastName as authors
from books bk left outer join Authors ath
    on bk.PublisherID = ath.ID`
      const result = await sql.query(query)
      res.status(200).render('index.pug', {status: 'success', books: result.recordset })
    } catch (err) {
      console.log('ERROR!!!', err)
      res.status(500).send('Something went wrong!');
    }
}
const getOneBook = async (req, res) => {
  try {
   const queryBook = `select ISBN13,
   title as Titel, Language as språk,
   Price_kr as Pris, FirstName + ' ' + LastName as Författare
   from books left outer join Authors
   on Books.PublisherID = Authors.ID
   where ISBN13 =  @ISBN`
   const queryStockBalance = `select isnull(cast(Total as varchar),'ej i lager') as Total,
   city, Name
    from BookStores bk
   outer apply (
       select *
   from stockBalance st
   where bk.ID = st.StoreID
       and st.ISBN = @ISBN
   ) as T`

   const configure =  await sql.connect(connection);
    const book = await configure
    .request()
    .input('ISBN', sql.NVarChar, req.params.isbn)
    .query(queryBook)
    const stockBalanceInfo = await configure
    .request()
    .input('ISBN', sql.NVarChar, req.params.isbn)
    .query(queryStockBalance)
    if (book.recordset && book.recordset.length > 0 && stockBalanceInfo.recordset) {
    res.status(200).render('oneBook.pug', {status: 'success',
    books: book.recordset,
    stores: stockBalanceInfo.recordset})
    } else {
      res.status(404).send("The book is not found!");
    }
  } catch (err) {
    console.log('ERROR!!!', err)
    res.status(500).send('Something went wrong!');
  }
}
const pageNotFound = (req, res) => {
  res.status(404).send('<h1>Page not found</h1>')
}

module.exports = {
  getBookList,
  getOneBook,
  pageNotFound
}
