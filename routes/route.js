
const express = require('express');
const router  = express.Router(); 

const multer = require('multer');
const storage = multer.diskStorage({
    destination: function(request, file, callback){
        callback(null, 'images/products');
    },

    filename:function(request, file, callback){
        callback(null, file.originalname);
    }
});
const upload = multer({
    storage:storage,
});

const controller = require('../controllers/controller.js');

const User = require('../model/User.js');
const Product = require('../model/Product.js');
const Review = require("../model/Review");


// USERS (ROUTE) 


router.post('/signup', controller.signup); 
router.post('/login', controller.login);
router.get('/logout', controller.logout);

router.get('/userProfile', controller.userProfile);

router.post('/updateinfo', controller.updateinfo);






// PRODS (ROUTE) 
router.post('/submit-prod', upload.single('image'), controller.createprod);

//router.post('/submit-update', controller.updateprod);



// REVIEW (ROUTE)
//router.post('/logout', controller.logout); 

 
   
module.exports = router;             