const { faker } = require('@faker-js/faker');
const mysql  = require('mysql2');
const express= require('express');
const app=express();
const path=require("path");
const methodOverride = require("method-override");

app.use(methodOverride("_method"));
app.use(express.urlencoded({ extended: true }));

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"/views"));

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  database: 'delta',
  password: 'Krishna@123',
});

let getRandomUser=() =>{
  return [
        faker.string.uuid(), 
        faker.internet.userName(), 
        faker.internet.email(), 
        faker.internet.password()

    
   ];
}

//Inserting new data 

// const q = "INSERT INTO user (id, username, email, password) VALUES ?";
// const data = [];
// for (let i = 0; i < 100; i++) {
//     data.push(getRandomUser());
// }



//connection.end();

//home route
app.get("/", (req, res) => {
    let q=`select count(*) from user`;
    try {
      connection.query(q,(err, result) => {
        if (err) throw err;
        let count=result[0]["count(*)"];
        res.render("home.ejs",{count});
      });
    } catch (err) {
      res.send("some error occured");
    }
    
});

//show route

app.get("/user", (req, res) => {
  let q = `SELECT * FROM user`;
  try {
    connection.query(q, (err, result) => {
      if (err) throw err;
      let users = result;
      //console.log(users);
      res.render("showusers.ejs", { users});
    });
  } catch (err) {
    res.send("some error occurred");
  }
});

// Edit Route
app.get("/user/:id/edit", (req, res) => {
  let { id } = req.params;
  let q = `SELECT * FROM user WHERE id='${id}'`;

  try {
    connection.query(q, (err, result) => {
      if (err) throw err;
      let user=result[0];
      res.render("edit.ejs",{user});
    });
  } catch (err) {
    console.log(err);
    res.send("some error in DB");
  }
});

// UPDATE (DB) Route
app.patch("/user/:id", (req, res) => {
    let { id } = req.params;
    let { password: formPass, username: newUsername } = req.body;
    let q = `SELECT * FROM user WHERE id='${id}'`;

    try {
        connection.query(q, (err, result) => {
            if (err) throw err;
            let user = result[0];
            if (formPass != user.password) {
                res.send("WRONG PASSWORD");
            }
            else{
              let q2 = `UPDATE user SET username='${newUsername}' WHERE id='${id}'`;
              connection.query(q2, (err, result) => {
                if (err) throw err;
                res.redirect("/user");
            });
            }
        });
    } catch (err) {
        console.log(err);
        res.send("some error in DB");
    }
});

//delete user
app.get("/user/:id/delete", (req, res) => {
  let { id } = req.params;
  let q = `DELETE FROM user WHERE id ='${id}'`;

  try {
    connection.query(q, (err, result) => {
      if (err) throw err;
      res.redirect("/user");
    });
  } catch (err) {
    console.log(err);
    res.send("some error in DB");
  }
});

//add new user 
app.get("/user/addnewuser", (req, res) => {
  //let q = `SELECT * FROM user WHERE id='${id}'`;
  res.render("addnew.ejs");
});

//added user query
app.post("/user/added", (req, res) => {
  
  let { id:formid, username: newUsername,email:formemail,password: formPass } = req.body;
  let q = "INSERT INTO user (id, username, email, password) VALUES (?,?,?,?)";
  let values =[formid, newUsername, formemail, formPass];
  try {
    connection.query(q, values, (err, result) => {
      if (err) throw err;
      res.redirect("/user");
    });

  } catch (err) {
    console.log(err);
    res.send("some error in DB");
  }
});

app.listen("8080",()=>{ 
     console.log("listening to port: 8080"); 
}); 


