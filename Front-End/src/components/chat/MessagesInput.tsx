import React, {useState} from "react"

export default function MessagesInput({
  send,}:
   {
      send: (val:string) => void
   }) {
  const [value, setValue] = useState("")
  return (
    <>
      <input
        onChange={(e)=>setValue(e.target.value)}
        placeholder="Un message CHAT ?..."
        value={value}/>
      <button onClick={() => send(value)}>Envoie</button>
    </>
  )
}
