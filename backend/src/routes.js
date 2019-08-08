const express = require('express');

const router = express.Router();

router.get('/', (request, response) => {
    return response.json({"name": request.query.name});
});

router.post('/addDev', (request, response)=>{
    return response.json(request.body);
});

module.exports = router;