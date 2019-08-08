const axios = require('axios');
const Developer = require('../model/Developer.js');
const ObjectId = require('mongoose').Types.ObjectId;

module.exports = {
    async store(request, response){

        const username = request.body.username.toLowerCase();

        const userExists = await Developer.findOne({ user: username });

        if(userExists){
            return response.json(userExists);   
        }

        const userData = await axios.get(`https://api.github.com/users/${username}`);

        const { name, bio, avatar_url: avatar } = userData.data;
        const developer = await Developer.create({
            name,
            user: username,
            bio,
            avatar
        });

        return response.json(developer);
    },

    async index(request, response){
        const currentUserId = request.headers.id;

        if(!ObjectId.isValid(currentUserId)){
            return response.status(400).json({error: 'Developer id is not valid'});
        }

        const currentUser = await Developer.findById(currentUserId);

        if(!currentUser){
            return response.status(400).json({error: 'Developer is not valid'});
        }



        const users = await Developer.find({
            $and: [
                { _id: { $ne: currentUser._id } },
                { _id: {$nin: currentUser.likes} },
                { _id: {$nin: currentUser.dislikes }}
            ]
        });

        return response.json(users);
    }
};