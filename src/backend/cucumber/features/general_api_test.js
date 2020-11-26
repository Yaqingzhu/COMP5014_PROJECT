const { Given, Then } = require('cucumber');
const assert = require('assert').strict;
const util = require('../../general_APIs');

const req = {
    session: {
        role: '',
        login: false
    }
};

Given('a session role is {string}', function (arg1) {
    req.session.role = arg1;
});

Then('vaildation for admin is {int} for student is {int} for prof is {int}', function (arg1, arg2, arg3) {
    assert.equal(Boolean(arg1), util.validateAdmin(req));
    assert.equal(Boolean(arg2), util.validateStudent(req));
    assert.equal(Boolean(arg3), util.validateProf(req));
});

Given('a session login is {int}', function (arg1) {
    req.session.login = Boolean(arg1);
});

Then('vaildation login is {int}', function (arg1) {
    assert.equal(Boolean(arg1), util.validateLogin(req));
});
