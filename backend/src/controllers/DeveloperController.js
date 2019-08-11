const axios = require('axios');
const Developer = require('../model/Developer.js');
const ObjectId = require('mongoose').Types.ObjectId;

module.exports = {
    async store(request, response){
        console.log('New User store request');

        const username = request.body.username.toLowerCase();
        
        if(!username || username === ''){
            console.log('Invalid or empty id');
            return response.status(400).json({error: 'Developer id is not valid'});            
        }

        const userExists = await Developer.findOne({ user: username });
        
        if(userExists){
            console.log('User already existis');
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

        console.log('New User stored');
        return response.json(developer);
    },

    async index(request, response){
        console.log('New Users list request');

        const currentUserId = request.headers.id;

        if(!ObjectId.isValid(currentUserId)){
            console.log('Invalid id');
            return response.status(400).json({error: 'Developer id is not valid'});
        }

        const currentUser = await Developer.findById(currentUserId);

        if(!currentUser){
            console.log('Id not existis');
            return response.status(400).json({error: 'Developer is dont existis'});
        }

        const users = await Developer.find({
            $and: [
                { _id: { $ne: currentUser._id } },
                { _id: {$nin: currentUser.likes} },
                { _id: {$nin: currentUser.dislikes }}
            ]
        });

        console.log('Returing Users list');
        return response.json(users);
    }
};