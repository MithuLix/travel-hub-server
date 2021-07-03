const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();
const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
const port = 5000;
//mongo database require
const objectId = require('mongodb').ObjectId;
const MongoClient = require('mongodb').MongoClient;
const { ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.sckbv.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

//db working/not
app.get("/",(req, res) => { res.send("TravelHub Server-Database connected!");})

//DB connection between client-server
client.connect(err => {
//Database
    const Destinations = client.db("travelHub").collection("destinations");
    const Orders = client.db("travelHub").collection("orders");
    const Reviews = client.db("travelHub").collection("reviews");
    const Admin = client.db("travelHub").collection("admins");



//HOME
    //get destinations
    app.get('/getDestinations', (req, res) => {
        Destinations.find({})
        .toArray((err, documents) => {res.send(documents)})
    })
    app.get('/getDestinations/:id', (req, res)=>{
        Destinations.find({_id : ObjectId(req.params.id)})
        .toArray((err, documents)=>{ res.send(documents[0])})
    })
    // -------------------------------



//BookingPanel
    //new Book
    app.post('/newBooking', (req, res) => {
        Orders.insertOne(req.body)
        .then(result => {res.send(result.insertedCount > 0)})
    })
    //show BookingList
    app.get('/getBookingList', (req, res) => {
        Orders.find({email : req.query.email})
        .toArray((err, documents) => {res.send(documents)})
    })
    //add a review
    app.post('/addReview', (req, res) => {
        Reviews.insertOne(req.body)
        .then(result => {res.send(result.insertedCount > 0)})
    })
    //get reviews
    app.get('/getReviews', (req, res) => {
        Reviews.find({})
        .toArray((err, documents) => {res.send(documents)})
    })
    // -----------------------------



// AdminPanel
    //All Order List
    app.get('/allOrderList', (req, res) => {
        Orders.find({})
        .toArray((err, documents) => {res.send(documents)})
    });
    //update Orders
    app.patch('/updateOrder/:id', (req, res) => {
        Destinations.updateOne({_id: ObjectId(req.params.id)}, 
                        {$set: {status: req.body.status}})
        .then(result => {res.send(result.modifiedCount > 0)})
    })
    //create destinations
    app.post('/addDestinations', (req, res) => {
        Destinations.insertOne(req.body)
        .then(result => {res.send(result.insertedCount > 0)})
    });
    //deleteDestination
    app.delete('/deleteDestination/:id', (req, res) => {
        Destinations.deleteOne({_id :objectId(req.params.id)})
        .then(result => {res.send(result.deletedCount > 0)})
    })
    //makeAdmin
    app.post('/makeAdmin', (req, res) => {
        Admin.insertOne(req.body)
        .then(result => {res.send(result.insertedCount > 0)})
    });
    //getAdmin
    app.get('/getAdmin', (req, res) => {
        Admin.find({})
        .toArray((err, documents) => {res.send(documents)})
    });
    // -----------------------------

  });

app.listen(process.env.PORT || port)
