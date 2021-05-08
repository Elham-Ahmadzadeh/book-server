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

sql.connect(connection)
 const getBookList = async (req, res) => {
  try {
      const result = await sql.query(`
                                          select ISBN13,
                                                 title as Titel,
                                                 Price_kr as Pris,
                                                 FirstName  + ' ' + LastName as Författare
                                                 from books left outer join Authors
                                                 on Books.PublisherID = Authors.ID;`)
      res.status(200).render('index.pug', {status: 'success', books: result.recordset })
    } catch (err) {
      console.log('ERROR!!!', err)
      res.status(404).send(err.message)
    }
}
const getOneBook = async (req, res) => {
  try {
    const book = await sql.query(
     `select ISBN13,
     title as Titel, Language as språk,
     Price_kr as Pris, FirstName + ' ' + LastName as Författare
     from books left outer join Authors
     on Books.PublisherID = Authors.ID
     where ISBN13 =  ${req.params.isbn}`
    )
    const stockBalanceInfo = await sql.query(`
    SELECT isnull(cast(Total as varchar),'ej i lager') as Total,
    city, Name
     FROM BookStores bk
    OUTER APPLY (
        SELECT *
    FROM stockBalance st
    WHERE bk.ID = st.StoreID
        and st.ISBN = ${req.params.isbn}
    ) AS T
    `)
    res.status(200).render('oneBook.pug', {status: 'success',
    books: book.recordset,
    booksInfo: stockBalanceInfo.recordset})
  } catch (err) {
    console.log('ERROR!!!', err)
    res.status(404).send(err.message)
  }
}
module.exports = {
  getBookList,
  getOneBook
}
