const { Given, When, Then, Before, After } = require("cucumber");
const assert = require("assert").strict
const sinon = require("sinon");
const mysql = require('../../../db_util');
const http = require('http');
const app = require('../../../index');
const request = require('supertest');
const session =  require('supertest-session');


let server;
let res;
let authenticatedSession;
let testSession;

new Promise((resolve, reject)=>{
    mysql.insertNewUserLoginInformation(resolve, 123, 't')
}).then((result)=>{
    if(result){
        
    }
});

server = http.createServer(app);
    server.listen();


Given("course json file {string}", function (arg1){
    testSession = session(app);
    console.log(arg1)
    return testSession.post('/login').send({id: 123, password: 't'}).expect(200).then(function(){
        return testSession.post('/courseop').send(JSON.parse(arg1)).expect(200).then(function (rr){
            res = rr;
            console.log(arg1 + 'end') 
        });
    });
    
} );

Given("without login, course json file {string}", function (arg1){
    return session(app).post('/courseop').send(JSON.parse(arg1)).then(function(rr){
        res = rr;
    });
} );

Then("return a json with responseCode equals to {int}", function (arg1){
    console.log('response');
    assert.equal(arg1, res.body.responseCode);
} );

Then("time_slots table has a row with course id {int} and day {int}", function(arg1, arg2){
    console.log('time slot');
    const connection = mysql.getDBConnection();
    connection.connect();
    return new Promise((resolve, reject)=>{
        connection.query('SELECT 1 AS result FROM course_slots WHERE course_id = ? AND course_slots_day = ?;', [
            arg1, arg2
        ], (error, results) => {  
            const rest = results[0] ? results[0].result : -1;
            console.log(results)
            console.log(error)
            resolve(rest);
        })
    }).then(function(resolve){
        assert.equal(1, resolve);
    })
    
} );

Then("prerequisites table has a row with course id {int} and prerequisites {int}", function (arg1, arg2){
    console.log(arg1);
    console.log(arg2);

    return new Promise((resolve, reject)=>{
        connection.query('SELECT 1 AS result FROM prerequisites WHERE course_id = ? AND prerequisites_course_id = ?', [
            arg1, arg2
        ], (error, results) => {  
            const rest = results[0] ? results[0].result : -1;
            resolve(rest);
        })
    }).then(function(resolve){
        assert.equal(1, resolve);
    })
    
    ; 
} );

Then("preclusions table has a row with course id {int} and preclusions {int}", function (arg1, arg2){
    return new Promise((resolve, reject)=>{
        connection.query('SELECT 1 AS result FROM preclusions WHERE course_id = ? AND preclusions_course_id = ?', [
            arg1, arg2
        ], (error, results) => {  
            const rest = results[0] ? results[0].result : -1;
            resolve(rest);
        })
    }).then(function(resolve){
        assert.equal(1, resolve);
    });
} );

Then("course table has a row with course id {int} and course name {string}", function (arg1, arg2){

    return new Promise((resolve, reject)=>{
        connection.query('SELECT 1 AS result FROM course WHERE course_id = ? AND course_name = ?', [
            arg1, arg2
        ], (error, results) => {  
            const rest = results[0] ? results[0].result : -1;
            resolve(rest);
        })
    }).then(function(resolve){
        assert.equal(1, resolve);
    });
} );

Then("course table has a row with course id {int} and course status {string}", function (arg1, arg2){
    return new Promise((resolve, reject)=>{
        connection.query('SELECT 1 AS result FROM course WHERE course_id = ? AND course_status = ?', [
            arg1, arg2
        ], (error, results) => {  
            const rest = results[0] ? results[0].result : -1;
            resolve(rest);
        })
    }).then(function(resolve){
        assert.equal(1, resolve);
    });

   
} );