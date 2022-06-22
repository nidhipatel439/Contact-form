const { urlencoded } = require("express");
const express = require("express");
const mongo = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectId;
const path = require("path");

const app = express();
const port = 3000;

const dburl = "mongodb://localhost:27017";
var db;

//test connection
mongo.connect(dburl, (error, client) => {
    db = client.db("testdb");
})

app.use(urlencoded({ extended: true }))
app.use(express.json())

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");
app.use(express.static(path.join(__dirname, "public")));

//redirect to index page
app.get("/", (req, res) => {
    db.collection("students").find({}).toArray((err, result) => {
        // console.log(result);
        res.render("index", { title: "Home", student_list: result });
    });
})

//add request
app.get("/student/add", (req, res) => {
    res.render("add_student", { title: "Add" })
})
app.post("/student/add", (req, res) => {
    // save data in db
    db.collection("students").insertOne(req.body).then(() => {
        // go to index page
        res.redirect('/')
    })

})

//delete request
app.get("/student/delete/:id", (req, res) => {
    db.collection('students').deleteOne({ "_id": ObjectId(req.params.id) }).then(() => {
        res.redirect('/')
    })
    //reference : https://stackoverflow.com/a/10152586/17977703
})

//update request
app.get("/student/update/:id", (req, res) => {
    db.collection("students").findOne({ "_id": ObjectId(req.params.id) }).then((result) => {
        // console.log(result);
        res.render("update_student", { title: "Update", student: result })
    })
})
app.post("/student/update/:id", (req, res) => {
    db.collection("students").updateOne({ '_id': ObjectId(req.params.id) }, { $set: req.body }).then(() => {
        //go to index page
        res.redirect("/");
    })
})


app.listen(port, () => {
    console.log(`listening on ${port}`);
})