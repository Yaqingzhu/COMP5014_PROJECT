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
            console.log(rr.body) 
        });
    });
    
} );

Given("without login, course json file {string}", function (arg1){
    return session(app).post('/courseop').send(JSON.parse(arg1)).then(function(rr){
        res = rr; 
    });
} );

Then("return a json with responseCode equals to {int}", function (arg1){
    assert.equal(arg1, res.body.responseCode);
} );

Then("time_slots table has a row with course id {int} and day {int}", function(arg1, arg2){
        const jres= JSON.parse(res.body.coursePayload)
        assert.equal(arg2, jres.course_slots[0].day);
        assert.equal(arg1, jres.courseId);
} );

Then("prerequisites table has a row with course id {int} and prerequisites {int}", function (arg1, arg2){
    const jres= JSON.parse(res.body.coursePayload)
    assert.equal(arg2, jres.prerequisites[0]);
    assert.equal(arg1, jres.courseId); 
} );

Then("preclusions table has a row with course id {int} and preclusions {int}", function (arg1, arg2){
    const jres= JSON.parse(res.body.coursePayload)
    assert.equal(arg2, jres.preclusions[0]);
    assert.equal(arg1, jres.courseId); 
} );

Then("course table has a row with course id {int} and course name {string}", function (arg1, arg2){
    const jres= JSON.parse(res.body.coursePayload)
    assert.equal(arg2, jres.courseName);
    assert.equal(arg1, jres.courseId); 
} );

Then("course table has a row with course id {int} and course status {string}", function (arg1, arg2){
    const jres= JSON.parse(res.body.coursePayload)
    assert.equal(arg2, jres.courseStatus);
    assert.equal(arg1, jres.courseId); 
} );