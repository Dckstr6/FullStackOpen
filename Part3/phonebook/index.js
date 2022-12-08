const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const Person = require('./models/person');
const logger = require('./utils/logger');

// Middleware usage
const app = express();
app.use(express.json());
app.use(morgan((tokens,request,response)=>{
    const res = [
        tokens.method(request,response),
        tokens.url(request,response),
        tokens.status(request,response),
        tokens['response-time'](request,response),'ms'
    ];
    if(res[0]=='POST'){
        res.push(JSON.stringify(request.body));
    }
    return res.join(' ');
}))
// app.use(express.static('build'))
app.use(cors());


// response from mongodb is javascript array, but response to front end has to be in json
app.get('/api/persons',(request,response)=>{
    //response.json(persons);
    Person.find({}).then(
        (persons)=>response.json(persons)
    )
})

app.get('/info',(request,response)=>{
    Person.find({}).then(
        (persons)=>response.send(`<div>Phonebook has info for ${persons.length} people</div><br><div>${new Date()}</div>`)
    )
})

app.get('/api/persons/:id',(request,response,next)=>{
    const id = String(request.params.id);
    //const person = persons.find((x)=>x.id===id);
    // if(person){
    //     response.json(person);
    // }
    // else{
    //     response.status(404).end();
    // }
    Person.findById(id).then(
        (person) => {if(person){response.json(person)}else{response.status(404).end()}}
    ).catch(
        (error) => next(error)
    )
})

app.delete('/api/persons/:id',(request,response,next)=>{
    const id = String(request.params.id);
    // persons = persons.filter(x => x.id!==id);
    // response.status(204).end();
    Person.findByIdAndDelete(id).then(
        () => response.status(204).end()
    ).catch(
        (error) => next(error)
    )
})

app.post('/api/persons',(request,response,next)=>{
    const body = request.body;
    if(!body.name || !body.number){
        return response.status(400).json({
            error:'name and/or number missing'
        })
    }
    else{
        const newObj = new Person({name:body.name,number:body.number});
        // persons = persons.concat(newObj);
        // response.json(newObj);
        newObj.save().then(
            (savedPerson) => response.json(savedPerson)
        ).catch(
            (error) => next(error)
        )
    }
})

app.put('/api/persons/:id',(request,response,next)=>{
    const body = request.body;
    const id = request.params.id;
    if(!body.name || !body.number){
        return response.status(400).json({
            error:'name and/or number missing'
        })
    }
    if(!id){
        return response.status(400).json({
            error: 'person id not found'
        })
    }
    else{
        // don't create new model of Person here
        const modObj = {name:body.name,number:body.number};
        // persons = persons.filter(x => x.id!==replId);
        // persons.concat(modObj);
        // response.json(modObj);
        Person.findByIdAndUpdate(id,modObj,{new:true,runValidators:true,context:'query'}).then(
            () => response.json(modObj)
        ).catch(
            (error) => next(error)
        )
    }
})

const errorHandler = (error, request, response, next) => {
    console.error(error.message)
    if (error.name === 'CastError') {
      return response.status(400).send({ error: 'malformatted id' })
    } 
    else if(error.name === 'ValidationError'){
        return response.status(400).send({error: error.message})
    }
    next(error)
}
app.use(errorHandler);

const PORT = process.env.PORT || 3002;
app.listen(PORT,()=>{
    logger.info(`Express server started on port ${PORT}`);
})
