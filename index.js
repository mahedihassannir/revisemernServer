const express = require('express');
const app = express()

const port = process.env.PORT || 5000

const cors = require("cors")

const jwt = require("jsonwebtoken")

app.use(cors())


app.use(express.json())
require("dotenv").config()


// main heder part done



const { MongoClient, ServerApiVersion, Db } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_EMAIL}:${process.env.DB_PASS}@cluster0.p7bqic0.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();
        // here is all database related work

        // dbs
        const registerdData = client.db("registerdUserData").collection("Userdatas")
        const foods = client.db("foods").collection("food")
        const UserCardData = client.db("UserCardData").collection("usercart")

        // ends

        app.get("/food", async (req, res) => {

            const cursor = foods.find()

            const result = await cursor.toArray()
            res.send(result)



        })
        // food products url make done

        app.post("/cart", async (req, res) => {
            // this ouser data from the client side card
            const user = req.body
            console.log(user);

            // then insert one when the user click add to cart btn 
            const result = await UserCardData.insertOne(user)

            // then res send from here
            res.send(result)
        })

        app.get("/carts", async (req, res) => {


            const email = req.query.email
            console.log(email);
            if (!email) {
                res.send([])
            }

            const query = { email: email }
            console.log(query);

            const result = await UserCardData.find(query).toArray()

            res.send(result)





        })




        // jwt 

        app.post('/jwt', (req, res) => {

            const user = req.body

            const token = jwt.sign(user, process.env.JWT_TOKEN, {
                expiresIn: "1d"
            })
            // send the token in the client side
            res.send({ token })

        })


        // here is all database related work ends


        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);







// basic response is done
app.get("/", (req, res) => {
    res.send("serer is running ")
})

app.listen(port, () => {
    console.log(`server is running port ${port}`);
})




