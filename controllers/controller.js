const express = require('express');
const app = express();
const CryptoJS = require('crypto-js');
//const {image} = req.files;
const passport = require('passport');

const router  = express.Router(); 

//MODELS
const Product = require('../model/Product');
const Review = require('../model/Review');
const User = require('../model/User');
const { secret } = require('../config');


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
            password: CryptoJS.AES.encrypt(req.body.password, secret).toString(), // Hashes the password
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
    login: async (req, res, next) => {

        // gets log in information
        try {
            
            const user = await User.findOne({ username: req.body.username });
            !user && res.status(401).json("account username is wrong");
            
            const origpassword = CryptoJS.AES.decrypt(user.password, secret).toString(CryptoJS.enc.Utf8);
            origpassword !== req.body.password && res.status(401).json("account password is wrong");

            User.findByIdAndUpdate(user._id, { "logged": "true" } ) // updates logged status
 
            //res.status(200).json(user);

            req.session.user = user;
            req.session.save();
            //res.send("User Logged in" + user);
            console.log("User Logged in" + user)

            res.render('Account',{ 
                title: "Account Profile",  
                userinfo: user,
                successRedirect: './views/Account',
                failureRedirect: '../public/login'
            })

            

            //this.userProfile(); 
            
        } catch (error) {
            res.status(500).json(error);
            //failureRedirect: res.redirect('./index.html');
        }

    }, 




    // USER PROFILE
    userProfile: (req, res) => {
        let user = req.session.user
        res.render('Account',{ 
            title: "Account Profile",  
            userinfo: user,
            successRedirect: './views/Account',
            failureRedirect: '../public/login'
        }) 
        //return res.send(user)
    }, 


 
  
    logout: (req, res) => {
        req.session.destroy();
        //res.send("User Logged Out")
        res.redirect('./public/index.html')
        console.log("User Logged Out") 

    },


    // UPDATE INFORMATION
    updateinfo: async (req, res) => {

        User.findOne({username: req.body.username}).then((user) => {
                    user.location = req.query.location;
                    user.email = req.query.email;


                user.save().then(() => res.json("Account Updated" + user))
                .catch((error) => 
                res.status(500).json("post review error" + error));
        })

    }, 

 
    //SEARCH
    /*
    search: async(req,res) => {
        const products = await Product.find({
            $text: {$search: req.body.searchbox}
        Product.create(req.body, (error,post) => {
            res.redirect('/');
            console.log("Product created" + post);
    });*/
    

    createprod: async(req,res) => {
        let image = req.files;
        image.mv(path.resolve(__dirname,'public/images',image.name),(error) => {
            Product.create({
                ...req.body,
                image:'./images/products/' + image.name
            }, (error,post) => {
                res.redirect('/')
            });
        }); 
    },







    // retrieve all products of the selected user
    showOwnProducts: async (req, res) => {
        let user = req.body.username;

        try {
            const acc_products = await Review.findOne({sellerUN: user.username});
            res.status(200).json(acc_products); 

        } catch (error) {
            res.status(500).json(error);
        }
        
        
    }, 



    

    /**
     * REVIEWp
     * - post
     * - retrieve
     */

    // POST REVIEW TO SELLER PAGE
    postreview: async (req, res) => {

            // gets the information of seller 
            // ** still doesnt work for buyer
        let user = req.session.user;    // current user is posting a review
                                        // must get id of the shop

        // gets review information
        const new_review = new Review({ 
            sellerUN: seller.username,
            buyerUN: user.username,
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