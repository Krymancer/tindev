const Developer = require('../model/Developer.js');
const ObjectId = require('mongoose').Types.ObjectId;

module.exports = {
    async store(request, response){
        console.log('New Like request');
        const targetDeveloperId = request.params.id;
        const developerId = request.headers.id;
        console.log(targetDeveloperId, developerId);
        const currentDeveloper = await Developer.findById(developerId);
        const targetDeveloper = await Developer.findById(targetDeveloperId);


        if(currentDeveloper.likes.includes(targetDeveloper._id)){
            return response.status(400).json({error: 'Target already liked'});
        }

        if(targetDeveloper.likes.includes(currentDeveloper._id)){
            console.log("macth");
            const developerSocket = request.connectedUsers[developerId];
            const targetSocket = request.connectedUsers[targetDeveloperId];

            if(developerSocket){
                request.io.to(developerSocket).emit('match', targetDeveloper);
            }

            if(targetSocket){
                request.io.to(targetSocket).emit('match', currentDeveloper);
            }
        }

        currentDeveloper.likes.push(targetDeveloper._id);
        await currentDeveloper.save();

        return response.json(currentDeveloper);
    }
};