const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

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
app.use(express.static('build'))
app.use(cors());

persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.get('/api/persons',(request,response)=>{
    response.json(persons);
})

app.get('/info',(request,response)=>{
    response.send(`<div>Phonebook has info for ${persons.length} people</div><br>
    <div>${new Date()}</div>`)
})

app.get('/api/persons/:id',(request,response)=>{
    const id = Number(request.params.id);
    const person = persons.find((x)=>x.id===id);
    if(person){
        response.json(person);
    }
    else{
        response.status(404).end();
    }
})

app.delete('/api/persons/:id',(request,response)=>{
    const id = Number(request.params.id);
    persons = persons.filter(x => x.id!==id);
    response.status(204).end();
})

app.post('/api/persons',(request,response)=>{
    const body = request.body;
    if(!body.name || !body.number){
        return response.status(400).json({
            error:'name and/or number missing'
        })
    }
    else if(persons.find(x=>x.name===body.name)){
        return response.status(400).json({
            error:'name already present in phonebook'
        })
    }
    else{
        const newObj = {name:body.name,number:body.number,id:generateId()}
        persons = persons.concat(newObj);
        response.json(newObj);
    }
})

app.put('/api/persons/:id',(request,response)=>{
    const body = request.body;
    if(!body.name || !body.number){
        return response.status(400).json({
            error:'name and/or number missing'
        })
    }
    const replId = persons.find(x=>x.name===body.name);
    if(!replId){
        return response.status(400).json({
            error: 'person id not found'
        })
    }
    else{
        const modObj = {name:body.name,number:body.number,id:replId};
        persons = persons.filter(x => x.id!==replId);
        persons.concat(modObj);
        response.json(modObj);
    }
})

const generateId = () => {
    let maxId = persons.reduce((a,b)=>Math.max(a,b.id),-Infinity);
    return maxId + 1;
}

const PORT = process.env.PORT || 3002;
app.listen(PORT,()=>{
    console.log(`Express server started on port ${PORT}`);
})
