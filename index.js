const e = require('express');
const path = require('path')

const express = require('express');
const app = express();
const mysql = require('mysql');
const Joi = require('joi');
const bodyParser = require('body-parser');
const { min } = require('underscore');
const { func, valid } = require('joi');
const { response } = require('express');


// View Engine Setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.listen(3000, () => {});

app.use(bodyParser.urlencoded({ extended: false }))


app.use(express.json())


var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "password",
    database: "sample",
    insecureAuth: true

});

con.connect((err) => {
    if (err)
        throw err;
    console.log("MySql connected...\n");

});


app.get("/", (req, res) => {
    res.render('index', {})

});

app.get("/showAllData", (require, response) => {


    con.query('select * from Data', (err, result) => {
        if (err) throw err;
        console.log(result);
        counter = 1;

        response.render('showData', { data: result });

    });

});



app.post("/data", (req, response) => {

    const er = validateReq(req.body);
    if (er) {
        response.send(er.details);
        return;
    }

    let id = req.body.id;
    let name = req.body.name;
    var q = `insert into Data values( ${id}, '${name}' )`;
    con.query(q, (err, res) => {
        if (err) throw err;
        console.log("insert success...");
        response.send('insert success');

    });

});


app.post('/updateData', (req, response) => {

    const er = validateReq(req.body);
    if (er) {
        response.send(er.details);
        return;
    }
    const id = req.body.id;
    con.query(`select * from Data where id = ${id}`, (err, result) => {

        if (err) throw err;

        if (result.length <= 0) {
            response.send(`No record found with id = ${id}`);
            return;
        }

        con.query(`update Data set name = '${req.body.name}' where id = ${id}`, (err, result) => {
            response.send('update success');
        });

    });

});


app.post('/delete', (req, response) => {

    const schema = Joi.object({
        id: Joi.number()
            .integer()
            .min(1)
            .required()
    });

    const err = schema.validate(req.body).error;

    if (err) {
        response.send(err);
        return;
    }

    const id = req.body.id;

    con.query(`select * from Data where id = ${id}`, (err, result) => {
        if (err) throw err;
        if (result.length <= 0) {
            response.send('No record found');
            return;
        }
        con.query(`delete from Data where id = ${id}`, (err, result) => {
            if (err) throw err;
            response.send("Delete success...");
        });

    });


});


function validateReq(input) {

    const schema = Joi.object({
        id: Joi.number()
            .integer()
            .min(1)
            .required(),

        name: Joi.string()
            .alphanum()
            .min(1)
            .max(19)
            .required()

    });

    return schema.validate(input).error;

}























// function showTables() {
//     con.query("Show tables", (err, res) => {
//         if (err) throw err;
//         console.log(res);
//     });
// }

// function createTables() {
//     con.query("create table Data(id int , name varchar(20))");
// }   con.query("create table Data(id int , name varchar(20))");
// }