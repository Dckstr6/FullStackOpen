import { useState } from 'react'

const App = () => {
  const [goodCount, setGood] = useState(0);
  const [neutralCount, setNeutral] = useState(0);
  const [badCount, setBad] = useState(0);
  return (
    <div>
      <Head />
      <Button handler={() => {setGood(goodCount+1)}} text="Good" />
      <Button handler={() => {setNeutral(neutralCount+1)}} text="Neutral"/>
      <Button handler={() => {setBad(badCount+1)}} text="Bad"/>
      <Stats goodCount = {goodCount} neutralCount = {neutralCount}
      badCount = {badCount}/>
    </div>
  )
}

const Button = (props) => {
  return (
    <>
      <button onClick={props.handler}>{props.text}</button>
    </>
  )
}

const Head = () => {
  return (
    <h1>Give Feedback Here</h1>
  )
}

const StatisticLine = (props) => {
  return (
    <>
      <p>{props.text}: {props.value}</p>
    </>
  )
}

const Stats = (props) => {
  let total = props.goodCount + props.neutralCount + props.badCount;
  if(total===0){
    return (
      <>
        <p>Statistics are displayed when feedback is given</p>
      </>
    )
  }
  let average = (props.goodCount - props.badCount)/total;
  return (
    <>
      <h1>Statistics</h1>
      <table>
        <thead></thead>
        <tbody>
          <tr>
            <td><StatisticLine text= "Good" value = {props.goodCount}/></td>
          </tr>
          <tr>
            <td><StatisticLine text= "Neutral" value = {props.neutralCount}/></td>
          </tr>
          <tr>
            <td><StatisticLine text= "Bad" value = {props.badCount}/></td>
          </tr>
          <tr>
            <td><StatisticLine text= "Total" value = {total}/></td>
          </tr>
          <tr>
            <td><StatisticLine text= "Average" value = {average}/></td>
          </tr>
          <tr>
            <td><StatisticLine text= "Positive %" value = {props.goodCount/total}/></td>
          </tr>
        </tbody>
        <tfoot></tfoot>
      </table>
    </>
  )
}
export default App