const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId
const EmployeeSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true
    },
    address: {
        type: String

    },
    phone: {
        type: Number,

        // unique: true
    },
    joiningDate: {
        type: Date,

        dafault: Date.now()

    },
    contract: {
        type: Number
    },
    documents: {
        type: Array,
        //required: true
    },
    wfoWfh: {
        type: String
    },
    assets: {
        type: String
    },
    salary: {
        type: Number,
        required: true
    },
    documentsId: {
        type: String,
        default: ""

    }
}, { timestamps: true }
)

module.exports = mongoose.model("Employee", EmployeeSchema)