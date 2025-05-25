import { useState } from 'react'
import './App.css'
import TeamAssets from './components/TeamAssets'
import './components/TeamAssets.css'

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>NBA Draft Assets Viewer</h1>
      </header>
      <main>
        <TeamAssets />
      </main>
    </div>
  )
}

export default App
