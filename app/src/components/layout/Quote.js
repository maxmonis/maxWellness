import React, { useState, useEffect } from "react"
import request from "../../functions/request"

const Quote = () => {
  const [quote, setQuote] = useState(null)
  const getQuote = async () => {
    setQuote(null)
    try {
      const quotes = await request("https://type.fit/api/quotes")
      const index = Math.floor(Math.random() * quotes.length)
      setQuote(quotes[index])
    } catch (err) {
      console.error(err)
      setQuote({
        text: "Be the change you want to see in the world",
        author: "Mohandas Gandhi",
      })
    }
  }
  useEffect(() => {
    getQuote()
    // eslint-disable-next-line
  }, [])
  return (
    <div className="quote">
      {!quote ? (
        <h4>Loading quote...</h4>
      ) : (
        <>
          <h4>{quote.text}</h4>
          <h5>-{quote.author || "Anonymous"}</h5>
        </>
      )}
    </div>
  )
}

export default Quote
