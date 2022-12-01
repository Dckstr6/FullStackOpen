const mongoose = require('mongoose');

if (process.argv.length < 3) {
    console.log('Please provide the password as an argument: node mongo.js <password>');
    process.exit(1);
}

const password = process.argv[2];

const name = process.argv[3];
const number = process.argv[4];

const url = `mongodb+srv://dcsktr:${password}@cluster0.zcoilrs.mongodb.net/?retryWrites=true&w=majority`

const personSchema = new mongoose.Schema({
    name:String,
    number:String,
    id:Number,
})

const Person = mongoose.model('Person',personSchema);

if(name && number){
    mongoose.connect(url).then(
        (result)=>{
            console.log("Connected");
            const person = new Person({
                name:name,
                number:number,
            })
            return person.save();
        }
    ).then(
        () => {
            console.log("Person Saved!");
            return mongoose.connection.close();
        }
    ).catch(
        (err) => console.log(err)
    )
}

else{
    res = [];
    mongoose.connect(url).then(
        () => {
            Person.find({}).then(
                (result)=>{
                    console.log("Phonebook:")
                    result.forEach(person => console.log(person.name, person.number));            
                    mongoose.connection.close()
                }
            )
        }
    )
}