const Developer = require('../model/Developer.js');
const ObjectId = require('mongoose').Types.ObjectId;

module.exports = {
    async store(request, response){
        const targetDeveloperId = request.params.id;
        const developerId = request.headers.id;

        if(!ObjectId.isValid(targetDeveloperId)){
            return response.status(400).json({error: 'Target id is not valid'});
        }else if(!ObjectId.isValid(developerId)){
            return response.status(400).json({error: 'Developer id is not valid'});
        }

        const currentDeveloper = await Developer.findById(developerId);
        const targetDeveloper = await Developer.findById(targetDeveloperId);

        if(!targetDeveloper){
            return response.status(400).json({error: 'Developer not exists'});
        }

        if(currentDeveloper.likes.includes(targetDeveloper._id)){
            return response.status(400).json({error: 'Target already liked'});
        }

        if(targetDeveloper.likes.includes(currentDeveloper._id)){
            console.log("macth");
        }

        currentDeveloper.likes.push(targetDeveloper._id);
        await currentDeveloper.save();

        return response.json(currentDeveloper);
    }
};