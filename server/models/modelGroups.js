'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema

module.exports = (app) => {
    const GroupsSchema = new Schema({
        name        : String,
        description   : String,
        category      : String,
        subcategory   : String,
        privacy:  { type: String}, //, enum: ["public", "private"] },
        creationDate  : {
            type      : Date,
            default   : Date.now
        },
        creator: {
            type: Schema.Types.ObjectId,
            ref: "User"
        },
        members: [{
            user: {type      : Schema.Types.ObjectId,
                   ref       : "User"},
            isAdmin   : {type: Boolean, default: false},
            date:  { type: Date, default: Date.now }
        }],

        requests: [{ // solicitudes al grupo
            sendBy:{
                type: Schema.Types.ObjectId,
                ref: "User"
            },
            comment: {type: String, default: 'Me gustaría ser parte de su comunidad'},
            date:  { type: Date, default: Date.now }
        }],
    })

    return mongoose.model('Group', GroupsSchema)
}
