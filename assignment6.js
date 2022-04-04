
const express = require("express");
const session = require("express-session");
const app = express();
const fs = require("fs");
const { JSDOM } = require('jsdom');

// static path mappings
app.use("/js", express.static("./public/js"));
app.use("/css", express.static("./public/css"));
app.use("/img", express.static("./public/imgs"));
app.use("/fonts", express.static("./public/fonts"));
app.use("/html", express.static("./public/html"));
app.use("/media", express.static("./public/media"));


app.use(session(
    {
        secret: "extra text that no one will guess",
        name: "comp1537ID",
        resave: false,
        // create a unique identifier for that client
        saveUninitialized: true
    })
);


app.get("/", function (req, res) {

    if (req.session.loggedIn) {
        res.redirect("./app/html/profile", "utf8");
    } else {

        let doc = fs.readFileSync("./app/html/login.html", "utf8");

        res.set("Server", "Wazubi Engine");
        res.set("X-Powered-By", "Wazubi");
        res.send(doc);
    }
});


app.get("/profile", function (req, res) {
    // check for a session first!
    if (req.session.loggedIn) {
        let profile = fs.readFileSync("./app/html/profile.html", "utf8");
        let profileDOM = new JSDOM(profile);

        // great time to get the user's data and put it into the page!
        profileDOM.window.document.getElementsByTagName("title")[0].innerHTML
            = req.session.name + "'s Profile";
        profileDOM.window.document.getElementById("profile_name").innerHTML
            = "Welcome back " + req.session.name;

        res.set("Server", "Wazubi Engine");
        res.set("X-Powered-By", "Wazubi");
        res.send(profileDOM.serialize());

    } else {
        // not logged in - no session and no access, redirect to home!
        res.redirect("/");
    }

});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Notice that this is a "POST"
app.post("/login", function (req, res) {
    const mysql = require("mysql2");
    const connection = mysql.createConnection({
        host: "127.0.0.1",
        user: "root",
        password: "",
        database: "assignment6"
    });
    let myResult = null;
    connection.connect();
    let usr = req.body.email;
    let pwd = req.body.password;
    console.log(usr + " : " + pwd);
    connection.execute(
        "SELECT * FROM A01304056_user WHERE A01304056_user.email_address = ? AND A01304056_user.password = ?",
        [usr, pwd],
        function (error, results, fields) {
            // results is an array of records, in JSON format
            // fields contains extra meta data about results
            //console.log("Results from DB", results, "and the # of records returned", results.length);
            // hmm, what's this?
            if (results.length < 1) {
                myResult = '{ "status": "fail" }'
                console.log("no such user");
            } else if (error) {
                myResult = results[0];
                // in production, you'd really want to send an email to admin
                // or in the very least, log it. But for now, just console
                console.log(error);
                myResult = '{ "status": "fail" }'
            } else {
                myResult = results[0];
                myResult["status"] = "success";
                req.session.loggedIn = true;
            }
            // // let's get the data but output it as an HTML table
            // let table = "<table><tr><th>ID</th><th>Name</th><th>Email</th></tr>";
            // for (let i = 0; i < results.length; i++) {
            //     table += "<tr><td>" + results[i].ID + "</td><td>" + results[i].user_name + "</td><td>"
            //         + results[i].email_address + "</td></tr>";
            // }
            // // don't forget the '+'
            // table += "</table>";
            // res.send(table);
            res.send(myResult);
            connection.end();
        }
    );
});

app.get("/logout", function (req, res) {

    if (req.session) {
        req.session.destroy(function (error) {
            if (error) {
                res.status(400).send("Unable to log out")
            } else {
                // session deleted, redirect to home
                res.redirect("/");
            }
        });
    }
});


// RUN SERVER
let port = 8000;
app.listen(port, function () {
    console.log("Listening on port " + port + "!");
});

// // https://expressjs.com/en/guide/routing.html


// // REQUIRES
// const express = require("express");
// const app = express();
// app.use(express.json());
// const fs = require("fs");

// // just like a simple web server like Apache web server
// // we are mapping file system paths to the app's virtual paths

// app.use("/css", express.static("./public/css"));
// app.use("/img", express.static("./public/img"));
// app.use("/js", express.static("./public/js"));



// // app.set('views', __dirname + '/app/html');
// // app.set('view engine', 'ejs');
// // app.engine('html', require('ejs').renderFile);

// app.get("/", function (req, res) {
//     //retrieve and send an HTML document from the file system
//     //let doc = fs.readFileSync("./app/html/index.html", "utf8");
//     //res.send(doc);

//     res.sendFile(__dirname + '/app/html/index.html');
// });

// //app.get("/css", function (req, res) {
//     // just send some plain text
//     //let css = fs.readFileSync("/Users/taylorji/Desktop/comp1537/JiSangwooCOMP1537Assignment3/style3.css", "utf8");
//     //res.send(css);
// //});

// app.get("/helloHTML", function (req, res) {
//     // hard-coded HTML
//     res.send("<html><head><title>Hi!</head><body><p>Hello!</p></body></html>");
// });


// app.get("/schedule", function (req, res) {

//     let doc = fs.readFileSync("./app/data/cstschedule.xml", "utf8");

//     // just send the text stream
//     res.send(doc);

// });

// app.get("/schedule", function (req, res) {

//     let doc = fs.readFileSync("./app/data/cstschedule.xml", "utf8");

//     // just send the text stream
//     res.send(doc);

// });

// app.get("/date", function (req, res) {

//     // set the type of response:
//     res.setHeader("Content-Type", "application/json");
//     let options = { weekday: "long", year: "numeric", month: "long", day: "numeric" };
//     let d = new Date();

//     res.send({ currentTime: d.toLocaleDateString("en-US", options) });

// });

// app.get("/stocks", function (req, res) {

//     let formatOfResponse = req.query["format"];

//     // e.g.,: http://localhost:8000/weekdays?format=html
//     // e.g.,: http://localhost:8000/weekdays?format=json
//     if (formatOfResponse == "html") {
//         // MIME type
//         res.setHeader("Content-Type", "text/html");
//         res.send(fs.readFileSync("./app/data/stocks-html.js", "utf8"));

//     } else if (formatOfResponse == "json") {
//         // MIME type
//         res.setHeader("Content-Type", "application/json");
//         res.send(fs.readFileSync("./app/data/stocks-json.js", "utf8"));

//     } else {
//         // just send JSON message
//         res.send({ status: "fail", msg: "Wrong format!" });
//     }

// });

// // for page not found (i.e., 404)
// app.use(function (req, res, next) {
//     // this could be a separate file too - but you'd have to make sure that you have the path
//     // correct, otherewise, you'd get a 404 on the 404 (actually a 500 on the 404)
//     res.status(404).send("<html><head><title>Page not found!</title></head><body><p>Nothing here.</p></body></html>");
// });


// // for page not found (i.e., 404)
// app.use(function (req, res, next) {
//     // this could be a separate file too - but you'd have to make sure that you have the path
//     // correct, otherewise, you'd get a 404 on the 404 (actually a 500 on the 404)
//     res.status(404).send("<html><head><title>Page not found!</title></head><body><p>Nothing here.</p></body></html>");
// });

// // RUN SERVER
// let port = 8000;
// app.listen(port, function () {
//     console.log("Example app listening on port " + port + "!");
// });
