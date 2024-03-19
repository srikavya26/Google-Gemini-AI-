import { useState } from "react";
const App = () => {
  const [value, setValue] = useState("")
  const [error, setError] = useState("")
  const [chatHistory, setchatHistory] = useState([])
  const supriseOptions = [
    'who won the latest Novel Peace Price?',
    'Where does pizza come from?',
    'What is Ai'
  ]
  const suprise = () => {
    const randomValue = supriseOptions[Math.floor(Math.random() * supriseOptions.length)]
    setValue(randomValue)
  }
  const getResponse = async () => {
    if (!value) {
      setError("Error! Please ask a question!")
      return
    }
    try {
      const options = {
        method: 'POST',
        body: JSON.stringify({
          history: chatHistory,
          message: value
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      }
      const response = await fetch('http://localhost:8000/gemini', options)
      const data = await response.text()
      console.log(data)
      setchatHistory(oldChatHistory => [...oldChatHistory, {
        role: "user",
        parts: value
      },
      {
        role: "model",
        part: data
      }
      ])
      setValue("")
    } catch (error) {
      console.log(error)
      setError("Something went wrong! Please try again later.")
    }
  }
  const clear = () => {
    setValue("")
    setError("")
    setchatHistory([])
  }
  return (
    <div className="app">
      <p>What do you want to know?
        <button className="suprise" onClick={suprise} disabled={!chatHistory}>Surprise me</button>
      </p>
      <div className="input-container">
        <input value={value}
          placeholder="When is Christmas..?"
          onChange={(e) => setValue(e.target.value)}
        />
        {!error && <button onClick={getResponse}>Ask Me</button>}
        {error && <button onClick={clear}>Clear</button>}

      </div>
      {error && <p>{error}</p>}
      <div className="search-result">
        {chatHistory.map((chatItem, _index) => <div key={"_index"}>
          <p className="answer">{chatItem.role} : {chatItem.parts}</p>
        </div>)}
      </div>

    </div>
  )
}

export default App;
