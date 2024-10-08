import React from 'react'

import WeatherComponent from './WeatherDisplay'
import { ToastContainer } from 'react-toastify'

const App = () => {
  return (
    <div>
  
    <WeatherComponent/>
    <ToastContainer />
    </div>
  )
}

export default App
