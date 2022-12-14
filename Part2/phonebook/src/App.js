import { useState, useEffect} from 'react'
import personService from './services/persons'

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState('');
  const [newNumber,setNewNumber]= useState('');
  const [filterInput,setFilter] = useState('');
  const [successMessage,setSuccessMessage] = useState(null);
  const [errorMessage,setErrorMessage] = useState(null);

  useEffect(() => {
    personService.getAll().then((response)=>{setPersons(persons.concat(response))})
  },[]);

  const nameFormHandler = function(event){
    event.preventDefault();
    let temp = persons.findIndex((x)=>x.name===newName);
    if(temp!==-1){
        if(window.confirm(`${persons[temp].name} already exists. Modify Record?`)){
          const modContact = {name:newName,number:newNumber};
          personService.update(persons[temp].id,modContact).then(
            (response)=>setPersons(persons.map(person=>person.name===response.name?{...person,number:response.number}:person))
          ).catch(
            (error)=>{
            setErrorMessage(error.response.data.error);
            setTimeout(()=>setErrorMessage(null),3000);
            personService.getAll().then(
              (response)=>{setPersons(response.map(x=>x))}
            )});
        }
    }
    else{
      const new_contact = {name:newName,number:newNumber};
      personService.create(new_contact).then((response)=>{
        setPersons(persons.concat(response));
        setSuccessMessage(`Added  ${newName}`);
        setTimeout(()=>{setSuccessMessage(null)},3000);
      }).catch((error)=>{
        setErrorMessage(error.response.data.error);
        setTimeout(()=>{setErrorMessage(null)},3000);
      })
    }
    setNewName('');
    setNewNumber('');
  }

  const handleNameChange = (event) => {
    setNewName(event.target.value);
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value);
  }


  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <form>
        <div>
          filter: <input type="text" value={filterInput} onChange={handleFilterChange}/>
        </div>
      </form>
      <h2>Add a new Record</h2>
      <SuccessNotification message={successMessage} />
      <ErrorNotification message = {errorMessage}/>
      <form onSubmit={nameFormHandler}>
        <div>
          name: <input value={newName} onChange={handleNameChange}/>
        </div>
        <div>
          number: <input value={newNumber} onChange={handleNumberChange}/>
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>

      <h2>Numbers</h2>
      <div>
        {persons.filter((a)=>a.name.toLowerCase().includes(filterInput)).map((a)=>
          <div key={a.id}>{a.name} {a.number} 
            <button onClick={()=>{if(window.confirm(`Delete ${a.name}?`)){personService.remove(a.id).then(
              (response)=>{alert("Delete successful");setPersons(persons.filter(x=>x.id!==a.id))})
            }}}>Delete Entry</button>
          </div>
        )}
      </div>
    </div>
  )
}

const SuccessNotification = ({message}) => {
  if(message==null){
    return null;
  }
  const errorStyle = {
    color:'green',
    background:'lightgrey',
    fontSize:20,
    borderStyle:'solid',
    borderRadius:5,
    padding:10,
    marginBottom:10
  }
  return (
    <div style={errorStyle}>{message}</div>
  )
}

const ErrorNotification = ({message}) => {
  if(message==null){
    return null;
  }
  const errorStyle = {
    color:'red',
    background:'lightgrey',
    fontSize:20,
    borderStyle:'solid',
    borderRadius:5,
    padding:10,
    marginBottom:10
  }
  return (
    <div style={errorStyle}>{message}</div>
  )
}

export default App