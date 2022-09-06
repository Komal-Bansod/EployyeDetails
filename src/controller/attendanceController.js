const constant = require("../constant.js")
const attendanceModel = require('../model/attendanceModel')
const employeModel = require('../model/employeModel')
const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId
var moment = require('moment')
const axios = require('axios').default;


const isValidObjectId = function (ObjectId) {
    return mongoose.Types.ObjectId.isValid(ObjectId)
}

const createDetails = async function getEmployee(req, res) {
    const server = constant.httpCodes.HTTP_SERVER_ERROR

    try {
        let newCreateStatus = constant.httpCodes.NEWLYCREATED

        const attendanceBody = req.body
        const response = await axios.get('http://localhost:3000/getEmployee');

        const { date, employee } = attendanceBody
        let attendance = response.data.data
        let arr = []

        for (const empl of attendance) {
            const obj = {}

            obj.employeId = empl._id

            for (const emp of employee) {
                let createDetails = {}

                createDetails.date = date
                createDetails.employeeId = empl._id,
                createDetails.inTime = emp.inTime,
                createDetails.outTime = emp.outTime
                arr.push(createDetails)
                console.log(createDetails)

            }



        }

        const createAttendaceDetails = await attendanceModel.create(arr)

        return res.status(newCreateStatus).send({ status: true, message: constant.messages.ATTENDANCE.SUCCESS, data: createAttendaceDetails })

    }
    catch (err) {
        res.status(server).send({ status: false, message: err.message })
    }

}



const updateAttendance = async function (req, res) {
    const server = constant.httpCodes.HTTP_SERVER_ERROR

    try {
        const success = constant.httpCodes.HTTP_SUCCESS
        const badRequest = constant.httpCodes.HTTP_BAD_REQUEST
        let updateAttendanceData = req.body
        //  let attendanceId = req.params.attendanceId
        let date = req.query.date


        const { inTime, outTime } = updateAttendanceData


        if (!isValidObjectId(attendanceId)) {
            return res.status(badRequest).send({ status: false, message: constant.messages.EMPLOYE.PARAM, data: null })
        }
        const AteendanceByEmployeeId = await attendanceModel.findById(attendanceId)
        if (!AteendanceByEmployeeId) {
            return res.status(badRequest).send({ status: false, message: constant.messages.EMPLOYE.ABCENTID, data: null })
        }

        let updateAttendance = await attendanceModel.updat(AteendanceByEmployeeId, updateAttendanceData, { new: true })

        console.log(updateAttendance)

        res.status(success).send({ status: true, message: constant.messages.ATTENDANCE.UPDATE, data: AteendanceByEmployeeId })

    }

    catch (err) {
        res.status(server).send({ status: false, message: err.message })
    }

}

const getAttendaceByDate = async function (req, res) {
    const server = constant.httpCodes.HTTP_SERVER_ERROR

    try {

        const success = constant.httpCodes.HTTP_SUCCESS
        let date = req.query.date
        let attendanceObj = {}
        if (date) {
            attendanceObj.date = date
        }

        let attendance = await attendanceModel.find(attendanceObj)

        return res.status(success).send({ status: true, message: constant.messages.ATTENDANCE.GET, count: attendance.length, data: attendance })
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

        let date = req.params.date

        const findAttendanceId = await attendanceModel.deleteMany({ date: date })
        if (findAttendanceId) {
            return res.status(success).send({ status: true, message: constant.messages.ATTENDANCE.DELETE, data: findAttendanceId })

        }
    }

    catch (err) {
        res.status(server).send({ status: false, message: err.message })
    }

}

module.exports = { createDetails, updateAttendance, getAttendaceByDate, deleteAttendanceById }

































        //     if (!isValidObjectId(attendanceId)) {
        //         return res.status(badRequest).send({ status: false, message: constant.messages.EMPLOYE.PARAM, data: null })
        //     }
        //   //  let delteAttendanceId = await attendanceModel.findById(attendanceId)
        // console.log(delteAttendanceId);
        // if (!delteAttendanceId) {
        //     return res.status(badRequest).send({ status: false, message: constant.messages.EMPLOYE.ABCENTID, data: null })
        // }