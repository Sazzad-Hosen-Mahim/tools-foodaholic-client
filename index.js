const express = require('express')
const { MongoClient} = require('mongodb')
const ObjectId = require('mongodb').ObjectId;
const cors = require('cors')
const app = express()
const port = 5000

// middleware

app.use(cors())
app.use(express.json())

//foodaholic-app
//VfbaVl9xkamt16j0

const uri = "mongodb+srv://foodaholic-app:VfbaVl9xkamt16j0@cluster0.3rsuy99.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true});
async function run(){
    try{
        await client.connect();
        const database = client.db("food-love");
        const serviceCollection = database.collection('services');

        console.log('database connected');
        app.post("/services", async(req, res) => {
            const service = req.body;
            const result = await serviceCollection.insertOne(service);

            console.log(result);
            res.json(result);
        })
        //update data into collection

        app.put('/services/:id([0-9a-fA-f]{24})', async (req, res) => {
          const id = req.params.id.trim();
          console.log("updating id", id)
          const updatedService = req.body;
          const filter = {_id: new ObjectId(id)};
          const options = {upsert: true}
          const updateDoc = {
            $set: {
              name: updatedService.name,
              price: updatedService.price,
              nutritions: updatedService.nutritions,
              comment: updatedService.comment,
              img: updatedService.img,
            },
          }
          const result = await serviceCollection.updateOne(filter, updateDoc, options,)
          console.log('updating', id)
          res.json(result);
        });

        // get all services

        app.get("/services", async(req, res) =>{
          const cursor = serviceCollection.find({});
          const service = await cursor.toArray();
          res.send(service);
        });
        // get a single service
        app.get('/services/:id([0-9a-fA-F]{24})', async(req, res) =>{
          const id = req.params.id.trim();
          console.log('getting specific services', id);
          const query = {_id: ObjectId(id)};
          const service = await serviceCollection.findOne(query);
          res.json(service);
        });

        // delete data from collection 
        app.delete('/services/:id([0-9a-fA-F]{24})', async(req, res) => {
          const id = req.params.id.trim();
          const query = {_id: ObjectId(id)};
          const result = await serviceCollection.deleteOne(query);
          res.json(result);
        });
    }finally{

    }
}
run().catch(console.dir)

app.get('/', (req, res) => {
  res.send('Hello World!')
});



app.listen(port, () => {
  console.log(`Foodaholic running on ${port}`)
})