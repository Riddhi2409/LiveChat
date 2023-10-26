const mongoose = require("mongoose");
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userModal = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    confirmPassword: {
        type: String,
        validate: {
            validator: function(val){
                return val== this.password;
            },
            message: 'Password and confirm Password does not match!'
        }  
    }
})

userModal.pre('save',async function(next){
    if (!this.isModified('password')) return next();
    this.password=await bcrypt.hash(this.password,12);

    this.confirmPassword = undefined;
    next();
})

userModal.methods.comparePasswordIndb = async function(pswd,pswddb){
    return await bcrypt.compare(pswd,pswddb);
}

module.exports=mongoose.model('User',userModal);