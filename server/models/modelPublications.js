    'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema

module.exports = (app) => {
    const CommentSchema = new Schema({
        postedBy: {
            type      : Schema.Types.ObjectId,
            ref       : 'User'
        },
        comment       : String,
        date          : String,
        update        : String,
        answer: [{
            postedBy  : {
                type  : Schema.Types.ObjectId,
                ref   : 'User'
            },
            comment   : String,
            date      : String,
        }],
    })

    const PublicationSchema = new Schema({
        business: {
            type      : String,
            maxlength : [100, "[modelPublication/business]: Maximo 100 caracteres"],
            trim      : true
        },
        title: {
            type      : String,
            maxlength : [100, "[modelPublication/title]: Maximo 100 caracteres"],
            trim      : true
        },
        image: {
            type      : String,
            default   : 'No disponible'
        },
        path: String,
        description: {
            type      : String,
            maxlength : [500, "[modelPublication/description]: Maximo 500 caracteres"],
            trim      : true
        },
        categories    : {String},
        typePublication: {
            type      : String,
        },

        creationDate: {
            hour: {
                type      : String,
            },
            date: {
                type      : String,
            },
        },
        updateDate: {
            hour: {
                type      : String,
                default   : ''
            },
            date: {
                type      : String,
                default   : ''
            },
        },

        postedBy: {
            type      : Schema.Types.ObjectId,
            ref       : "User"
        },

        totalLikes: {
            type      : Number,
            default   : 0
        },
        totalDislikes: {
            type      : Number,
            default   : 0
        },
        totalComments : Number,

        comments      : [CommentSchema],
    })

    return mongoose.model('Publication', PublicationSchema)
}
