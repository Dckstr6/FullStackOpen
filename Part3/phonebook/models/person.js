const mongoose = require('mongoose');
const password = "Pranay123";

const url = `mongodb+srv://dcsktr:${password}@cluster0.zcoilrs.mongodb.net/?retryWrites=true&w=majority`;

mongoose.connect(url).then(
    ()=>console.log("Connected to MongoDB")
).catch(
    ()=>console.log("Error in connecting to MongoDB")
);

const personSchema = new mongoose.Schema({
    name:{type:String,minLength:3},
    number:{type:String, minLength:5, validate:{validator:function(v){
        return /\d{2,3}-\d{3,}/.test(v);
    }, message: props => `${props.value} is not a valid phone number`}}
})

// This is to make the id of mongodb a string from an object because front end needs string/numeric id
personSchema.set('toJSON',{
    transform:(document,returnedObject)=>{
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
    }
})

module.exports = mongoose.model('Person',personSchema);

