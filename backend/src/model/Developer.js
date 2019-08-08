const { Schema, model } = require('mongoose');

const DeveloperSchecma = new Schema({
    name:{
        type: String,
        required: true
    },
    user:{
        type: String,
        required: true
    },
    bio: {
        type: String
    },
    avatar: {
        type: String,
        required: true
    },
    likes: [{
        type: Schema.Types.ObjectId,
        ref: 'Developer'
    }],
    dislikes: [{
        type: Schema.Types.ObjectId,
        ref: 'Developer'
    }]
},
{
    timestamps: true
});

module.exports = model('Developer',DeveloperSchecma);