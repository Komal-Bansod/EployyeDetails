const constant = require("../constant.js")
const attendanceModel = require('../model/attendanceModel')
const employeModel = require('../model/employeModel')
const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId
var moment = require('moment')


const isValidObjectId = function (ObjectId) {
    return mongoose.Types.ObjectId.isValid(ObjectId)
}

function validateDate(testdate) {
    var date_regex = /^\d{2}\/\d{2}\/\d{4}$/;

    return date_regex.test(testdate);
}

const createDetails = async function getEmployee(req, res) {
    const server = constant.httpCodes.HTTP_SERVER_ERROR

    try {
        let newCreateStatus = constant.httpCodes.NEWLYCREATED
        const badRequest = constant.httpCodes.HTTP_BAD_REQUEST
        const success = constant.httpCodes.HTTP_SUCCESS
        const attendanceBody = req.body
        const { date, inTime, outTime, name } = attendanceBody

        const attendanceRecord = await attendanceModel.find({ "date": date })
        let findEmployee = await employeModel.find().sort({ _id: -1 })
        // if(!validateDate(date)){
        //     return res.status(badRequest).send({status: true, message: constant.messages.ATTENDANCE.DATE, data: null})
        // }
        absentEMployee = await attendanceModel.find({ $and: [{ date: date }, { inTime: null }, { outTime: null }] }).count()

        presentEmployee = attendanceRecord.length - absentEMployee

        if (attendanceRecord.length == 0) {
            let arr = []
            for (var a of findEmployee) {
                let obj = {}
                obj.date = date
                obj.employeeId = a._id
                obj.name = a.name
                obj.inTime = null
                obj.outTime = null
                arr.push(obj)
            }
            const newAttendance = await attendanceModel.create(arr)
            return res.status(newCreateStatus).send({ status: true, message: constant.messages.ATTENDANCE.SUCCESS, data: newAttendance })
        }
        else {

            for (var a of findEmployee) {
                let unique = []

                for (var b of attendanceRecord) {
                    if (findEmployee.length > attendanceRecord.length) {
                        unique.push({
                            date: date,
                            employeeId: a._id,
                            name: a.name,
                            inTime: null,
                            outTime: null

                        })
                        let attendancek = await attendanceModel.create(unique)
                        return res.status(newCreateStatus).send({ status: true, message: constant.messages.ATTENDANCE.SUCCESS, data: attendancek })

                    }
                    else {
                        return res.status(newCreateStatus).send({ status: true, message: constant.messages.ATTENDANCE.SUCCESS, data: attendanceRecord.length, absentEMployee, presentEmployee, attendanceRecord })
                    }
                }
            }
        }

    }

    catch (err) {
        res.status(server).send({ status: false, message: err.message })
    }

}


/////////////////////////////////////////////////////////////

const updateAttendance = async function (req, res) {
    const server = constant.httpCodes.HTTP_SERVER_ERROR

    try {
        const success = constant.httpCodes.HTTP_SUCCESS
        const badRequest = constant.httpCodes.HTTP_BAD_REQUEST
        let updateAttendanceData = req.body
        let date = req.query.date
        const { employee } = updateAttendanceData
        let arr = []
        for (let empl of employee) {
            let employeeId = empl.employeeId
            let name = empl.name
            let inTime = empl.inTime
            let outTime = empl.outTime
            console.log(arr)

            let updateAttendance = await attendanceModel.updateMany({ employeeId: employeeId }, { $set: { inTime: inTime, outTime: outTime, name: name } }, { new: true })
        }
        return res.status(success).send({ status: true, message: constant.messages.ATTENDANCE.UPDATE, data: updateAttendanceData })

    }
    catch (err) {
        res.status(server).send({ status: false, message: err.message })
    }
}
const getAttendaceByDate = async function (req, res) {
    const server = constant.httpCodes.HTTP_SERVER_ERROR

    try {
        const badRequest = constant.httpCodes.HTTP_BAD_REQUEST
        const success = constant.httpCodes.HTTP_SUCCESS
        let date = req.query.date
        let presentEmployee = req.query.presentEmployee
        let absentEMployee = req.query.absentEMployee

        let attendanceObj = {}
        if (date) {
            attendanceObj.date = date
        }

        let attendance1 = await attendanceModel.find(attendanceObj)

        if (attendance1) {

            absentEMployee = await attendanceModel.find({ $and: [{ date: date }, { inTime: null }, { outTime: null }] }).count()

            presentEmployee = attendance1.length - absentEMployee


        }
        return res.status(success).send({ status: true, message: constant.messages.ATTENDANCE.GETDATA, totalEmployee: attendance1.length, presentEmployee: presentEmployee, absentEMployee: absentEMployee, data: attendance1 })
    }

    catch (err) {
        res.status(server).send({ status: false, message: err.message })
    }

}

///////////////////////////////////////////////////////////////////////////////////////////

const deleteAttendanceById = async function (req, res) {
    const server = constant.httpCodes.HTTP_SERVER_ERROR

    try {
        const success = constant.httpCodes.HTTP_SUCCESS
        const badRequest = constant.httpCodes.HTTP_BAD_REQUEST
        let date = req.query.date
        let attendanceId = req.query.attendanceId
        if (!date) {
            return res.status(badRequest).send({ status: false, message: constant.messages.ATTENDANCE.DATEINPARAMA, data: null })
        }


        const findDate = await attendanceModel.find({ date: date })
        console.log(findDate)
        if (findDate.length == 0) {
            return res.status(badRequest).send({ status: false, message: constant.messages.ATTENDANCE.ABCENTID, data: null })

        } else {
            const deleteDate = await attendanceModel.deleteMany({ date: date })
            return res.status(success).send({ status: true, message: constant.messages.ATTENDANCE.DELETE, data: deleteDate })

        }

    }

    catch (err) {
        res.status(server).send({ status: false, message: err.message })
    }

}








module.exports = { createDetails, updateAttendance, getAttendaceByDate, deleteAttendanceById }



















