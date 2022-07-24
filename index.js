const express = require('express');
const { MongoClient, ServerApiVersion } = require('mongodb');
const cors = require('cors');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.pabg0.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
console.log("connected to mongodb");

async function run() {
    try{
        await client.connect();
        const database = client.db("bookDeliverySystem");
        const booksCollection = database.collection("books");
        const purchaseBookDetails = database.collection("purchasedBook");

        // POST API
        app.post('/books', async(req, res) => {
          const books = req.body;
          console.log(books);
          const result = await booksCollection.insertOne(books);
          console.log("book inserted -", result);
          res.json(result);
        });

        // Get all books
        app.get('/books', async(req, res) => {
          const cursor = booksCollection.find({});
          const books = await cursor.toArray();
          console.log(books);
          res.json(books);
        });

        // Purchased Book
        app.post('/purchasedBook', async(req, res) => {
          const purchasedBookInfo = req.body;
          // const result = await purchaseBookDetails.insertOne(purchasedBookInfo);
          console.log("purchased book -", purchasedBookInfo);
          // res.json(result);
        });
    }
    finally{
        // await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})