const mysql = require('./db_util');

async function CourseProcess(req, res) {
    if(!req.session || !req.session.isLogin){
        res.status(403).json({ 
            responseCode: -1,
	        errorMessage: "You need to login before doing this operation."
        })
    } else if(req.session.role != 'admin'){
        res.status(403).json({ 
            responseCode: -1,
	        errorMessage: "You do not have permission to do this operation."
        })
    }else{
        doProcess(req.body, req, res);
    }
}

function doProcess(body, req, res){
    const courseId = body.courseId;

    new Promise((resolve, reject)=>{
        mysql.setCourse(resolve,reject,body);
    }).catch((err)=>{
        console.log(err);
        res.status(400).json({ 
            responseCode: -1,
            errorMessage: err.message,
        })
    }).then((result)=>{
        doTimeSlotProcess(body, req, res);
        
        doPreclusionsProcess(body, req, res);

        doPrerequisitesProcess(body, req, res);

        endRequestWithFinished(res);
        
    });
}

function doTimeSlotProcess(body, req, res){
    new Promise((resolve, reject)=>{
        mysql.setTimeSlot(resolve,reject,body.course_slots, body.courseId);
    }).catch((err)=>{
        console.log(err);
        res.status(400).json({ 
            responseCode: -1,
            errorMessage: err.message,
        })
    }).then();
}

function doPreclusionsProcess(body, req, res){
    new Promise((resolve, reject)=>{
        mysql.setPreclusions(resolve,reject,body.preclusions, body.courseId);
    }).catch((err)=>{
        console.log(err);
        res.status(400).json({ 
            responseCode: -1,
            errorMessage: err.message,
        })
    }).then();
}

function doPrerequisitesProcess(body, req, res){
    new Promise((resolve, reject)=>{
        mysql.setPrerequisites(resolve,reject,body.prerequisites, body.courseId);
    }).catch((err)=>{
        console.log(err);
        res.status(400).json({ 
            responseCode: -1,
            errorMessage: err.message,
        })
    }).then();
}

function endRequestWithFinished(res){
    res.status(200).json({ 
        responseCode: 0,
        errorMessage: "",
    });
}

module.exports = { CourseProcess }
