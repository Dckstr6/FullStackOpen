const personRouter = require('express').Router();
const logger = require('../utils/logger');


// response from mongodb is javascript array, but response to front end has to be in json
personRouter.get('/',(request,response)=>{
    //response.json(persons);
    Person.find({}).then(
        (persons)=>response.json(persons)
    )
})

personRouter.get('/info',(request,response)=>{
    Person.find({}).then(
        (persons)=>response.send(`<div>Phonebook has info for ${persons.length} people</div><br><div>${new Date()}</div>`)
    )
})

personRouter.get('/:id',(request,response,next)=>{
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

personRouter.delete('/:id',(request,response,next)=>{
    const id = String(request.params.id);
    // persons = persons.filter(x => x.id!==id);
    // response.status(204).end();
    Person.findByIdAndDelete(id).then(
        () => response.status(204).end()
    ).catch(
        (error) => next(error)
    )
})

personRouter.post('/',(request,response,next)=>{
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

personRouter.put('/:id',(request,response,next)=>{
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

module.exports = personRouter;
