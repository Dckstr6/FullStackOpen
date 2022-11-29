import { useState, useEffect} from 'react'
import axios from 'axios'

const App = () => {
  const [findText, findChange] = useState('');
  const [countries,setCountries] = useState([]);
  const hook = () => {
    axios.get('https://restcountries.com/v3.1/all').then(
      (response) => {console.log(`Receieved ${response.data.length} entries`);setCountries(countries.concat(response.data))}
    )
  }
  const handleFindChange = (event) => {
    findChange(event.target.value);
  }


  useEffect(hook,[]);
  let results = [];
  for(var temp of countries){
    if(temp.name.official.toLowerCase().includes(findText)){
      results.push(temp);
    }
  }
  return (
    <div>
      <h2>Country Info Form</h2>
      <form>
        <div>
          Find Countries: <input value={findText} onChange={handleFindChange}></input>
        </div>
      </form>
      <h2>Country Search Results</h2>
        {results.length===1 &&
          <Info results={results}></Info>
        }
        {results.length > 1 && results.length <= 10 &&
          results.map((a)=>
              <div key={a.cca2}>{a.name.official} 
                <Button handler={() => {findChange(a.name.official.toLowerCase())}}></Button>
              </div>
          )
        }
        {results.length > 10 && findText!="" &&
          <div>Too many results, please try different search</div>
        }
    </div>
  );
}

const Button = (props) => {
  return(
    <button onClick={props.handler}>Show</button>
  )
}

const Info = ({results}) => {
  return (
    <>
          <h3>{results[0].name.official}</h3>
          <div>Capital: {results[0].capital[0]}</div>
          <div>Area: {results[0].area}</div>
          <h4>Languages</h4>
          <div>
            <ul>
            {Object.entries(results[0].languages).map((a)=>
              <li key={a[0]}>{a[1]}</li>
            )}
            </ul>
          </div>
          <h4>Flag</h4>
          <img src={results[0].flags.png}></img>
    </>
  )
}

export default App;
