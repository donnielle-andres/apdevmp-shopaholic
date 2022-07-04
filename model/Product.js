var mongoose = require('mongoose');

/*
    SCHEMA: Product Information
    Desc: Information needed to list a product
*/

var ProdSchema = new mongoose.Schema({
    sellername : {
        type : String,
    },

    prodname: {
        type: String,
        required: true
    },  

    prodpric: {
        type: Number,
        required: true,
        min: 0
    },

    prodcate: {
        type: String,
        required: true
    },  

    proddesc: {
        type: String,
        required: true
    },  

    prodcond: {
        type: String,
        required: true
    },      

    prodvers: {
        type: String,
        required: true
    },      

    prodimg: {
        type: Array
    },
    
    prodpaym: {
        type: String
    },

    prodship: {
        type: String
    },

    prodrevi: {
        //revby : mongoose.SchemaType.ObjectId,
        revby : String,
        revtxt : String
    }
});
 
module.exports = mongoose.model('Product', ProdSchema);