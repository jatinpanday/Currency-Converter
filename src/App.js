import React, { useEffect, useState } from 'react';
import './App.css';
import CurrencyRow from './CurrencyRow';

const BASE_URL = 'https://api.exchangeratesapi.io/latest'

function App() {

  const[currencyOptions , setCurrencyOptions] = useState([])
  const[fromCurrency, setFromCrrency] =useState()
  const[toCurrency , setToCurrency] = useState()
  const[exchangeRate , setExchangeRate] =useState()
  const [amount ,setAmount] = useState(1)
  const[amountInFromCurrency ,setAmountInFromCurrency] =useState(true)
  

  let toAmount , fromAmount
  if (amountInFromCurrency) {
    fromAmount = amount
    toAmount = amount * exchangeRate
  }else{
    toAmount = amount
    fromAmount = amount / exchangeRate
  }

  useEffect(() => {
    fetch(BASE_URL)
      .then(res => res.json())
      .then(data => {
        const firstCurrency = Object.keys(data.rates)[0]
        setCurrencyOptions([data.base, ...Object.keys(data.rates)])
        setFromCrrency(data.base)
        setToCurrency(firstCurrency)
        setExchangeRate(data.rates[firstCurrency])

      })
  }, [])

  useEffect(() => {
    if ((fromCurrency != null && toCurrency != null)) {
      fetch(`${BASE_URL}?base=${fromCurrency}&Symbols=${toCurrency}`)
      .then(res => res.json())
      .then(data => setExchangeRate(data.rates[toCurrency]))
    }
  },[fromCurrency, toCurrency])
  
  function handleFromAmountChange(e){
    setAmount(e.target.value)
    setAmountInFromCurrency(true)
  }

  function handleToAmountChange(e){
  setAmount(e.target.value)
  setAmountInFromCurrency(false)
  }
  return (
    <>
      <h1>CURRENCY CONVERTER</h1>
      <CurrencyRow 
      currencyOptions={currencyOptions}
      selectedCurrency = {fromCurrency}
      onChangeAmount = {handleFromAmountChange}
      onChangeCurrency = {e => setFromCrrency(e.target.value)}
      amount = {fromAmount}
      />
      <div className="equals">=</div>
      <CurrencyRow 
      currencyOptions={currencyOptions}
      selectedCurrency = {toCurrency}
      onChangeAmount = {handleToAmountChange}
      onChangeCurrency={e => setToCurrency(e.target.value)}
      amount = {toAmount}
      />
    </>
  );
}

export default App;
