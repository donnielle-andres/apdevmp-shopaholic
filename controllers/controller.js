const express = require('express');
const app = express();
const CryptoJS = require('crypto-js');
//const {image} = req.files;
const passport = require('passport');

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
const router  = express.Router(); 

//MODELS
const Product = require('../model/Product');
const Review = require('../model/Review');
const User = require('../model/User');


const controller = {

    /** ACCOUNT 
     * - register
     * - log in
     * - update user's information
    */
   
    // REGISTER 
    signup: async (req, res) => {

        // gets user information for sign up 
        const new_user = new User({
            username: req.body.username,
            displayname: req.body.displayname,
            email: req.body.email,
            password: CryptoJS.AES.encrypt(req.body.password, "Shopaholic").toString(), // Hashes the password
            phonenum: req.body.phonenum,
            location: req.body.location,
            logged: "false",
            displaypic: "../public/img/default.png"
        }); 

        // saves the user information to become an account on the database
        try {
            const account = await new_user.save();
            //res.status(201).json(account)
            console.log("User Created" + account); 

            // req.flash("Success", "Successfully Signed Up!" + req.body.username);
            res.render('Account',{ 
                title: "Account Profile",  
                userinfo: account,
                //successRedirect: res.redirect('./views/Account.hbs')
            }) 

        } catch (error) {
            res.status(500).json("account existing" + error)
        } 
    },


    // LOGIN
    login: async (req, res) => {

        // gets log in information
        try {
            
            const user = await User.findOne({ username: req.body.username });
            !user && res.status(401).json("account username is wrong");
            
            const origpassword = CryptoJS.AES.decrypt(user.password, "Shopaholic").toString(CryptoJS.enc.Utf8);
            origpassword !== req.body.password && res.status(401).json("account password is wrong");

            User.findByIdAndUpdate(user._id, { "logged": "true" } ) // updates logged status
 
            //res.status(200).json(user);


            //successRedirect: res.redirect('./views/Account.html')
            res.render('Account',{ 
                title: "Account Profile",  
                userinfo: user,
                //successRedirect: res.redirect('./views/Account.hbs')
            })

            this.userProfile();
           
        } catch (error) {
            res.status(500).json(error);
            //failureRedirect: res.redirect('./index.html');
        }

    }, 


    // USER PROFILE
    userProfile: (req, res) => {
            req.session.user = user;
            req.session.save();
            res.send("User Logged in");
            console.log("User Logged in")

    },

    logout: (req, res) => {
        req.session.destroy();
        res.send("User Logged Out")
        console.log("User Logged Out")
    },


    // UPDATE INFORMATION
    updateinfo: async (req, res) => {

        User.findOne({username: req.body.username}).then((user) => {
                    user.email = req.body.email;
                    user.displayname =  req.body.email;
                    user.password = CryptoJS.AES.encrypt(req.body.password, "Shopaholic").toString();
                    user.phonenum = req.body.phonenum;

                user.save().then(() => res.json("Account Updated" + user))
                .catch((error) => 
                res.status(500).json("post review error" + error));
        })
    },

 

    search: async(req,res) => {
        const products = await Product.find({
            $text: {$search: req.body.searchbox}
            Product.create(req.body, (error,post) => {
            res.redirect('/');
            console.log("Product created" + post);
            })
        }
    },

    createprod: async(req,res) => {
        image.mv(path.resolve(__dirname,'public/images',image.name),(error) => {
            Product.create({
                ...req.body,
                image:'./images/products/' + image.name
            }, (error,post) => {
                res.redirect('/')
            });
        });
    },

    

    /**
     * REVIEW
     * - create
     * - retrieve
     */

    // POST REVIEW TO SELLER PAGE
    postreview: async (req, res) => {

            // gets the information of seller 
            // ** still doesnt work for buyer

        // gets review information
        const new_review = new Review({ 
            sellerUN: seller.username,
            buyerUN: req.body.buyerUN,
            productName: req.body.productName,
            reviewdesc: req.body.reviewdesc, 
            rate: req.body.rate
        })

        // saves new review for the seller by the buyer
        try {
            const review = await new_review.save();
            res.status(201).json(review) 
            
        } catch (error) {
            res.status(500).json("post review error");
            console.log(error); 
        }
    },





    // RETRIEVE POSTED
    viewreviews: async (req, res) => {
        // when the review tab is clicked
        // all reviews of the seller will be shown
        
        // gets the account username 
        try {
            const acc_reviews = await Review.findOne({sellerUN: req.body.sellerUN});
            res.status(200).json(acc_reviews); 

        } catch (error) {
            res.status(500).json(error);
        }
        
    }


};

module.exports = controller;