const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express()
const port = process.env.PORT || 5000
require('dotenv').config()

// middle wares
app.use(cors())
app.use(express.json())



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.7haskyh.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri)
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
    try{
        const serviceCollection = client.db('cloudKitchen').collection('services');
        const reviewCollection = client.db('cloudKitchen').collection('reviews')

        app.get('/services', async(req, res) => {
            const query = {}
            const cursor = serviceCollection.find(query)
            const services = await cursor.toArray()
            res.send(services)
        })

        app.post('/services', async(req, res) => {
            const service = req.body;
            const result = serviceCollection.insertOne(service)
            res.send(result)
        })


        app.get('/services/:id', async(req, res) => {
            const id = req.params.id;
            const query = {_id: ObjectId(id)}
            const service = await serviceCollection.findOne(query)
            res.send(service)
        })

        // Reviews api

        app.get('/reviews', async(req, res) => {
            let query = {}
            if(req.query.email){
                query = {
                    email: req.query.email
                }
            }
            const cursor = reviewCollection.find(query)
            const reviews = await cursor.toArray()
            res.send(reviews)
        })

        app.post('/reviews', async(req, res) => {
            const review = req.body;
            const result = reviewCollection.insertOne(review)
            res.send(result)
        })

        app.patch('/reviews/:id', async(req, res) =>{
            const id = req.params.id;
            const status = req.body.status
            const query = {_id: ObjectId(id)}
            const updatedDoc = {
                $set:{
                    status: status
                }
            }
            const result = await reviewCollection.updateOne(query, updatedDoc)
            res.send(result)
        })

        app.delete('/reviews/:id', async(req, res) => {
            const id = req.params.id;
            const query = {_id: ObjectId(id)}
            const result = await reviewCollection.deleteOne(query)
            res.send(result)
        })
    }
    finally{

    }

}
run().catch(err => console.error(err))


app.get('/', (req, res) => {
    res.send('cloud kitchen server is running')
})

app.listen(port, () => {
    console.log(`cloud kitchen server running on ${port}`)
})