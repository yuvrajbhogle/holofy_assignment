import React from 'react';
import './App.css';
import DragNDrop from './components/DragNDrop'


const data = [
  {position:"TopLeft",items:[]},
  {position:"TopRight",items:[]},
  {position:"BottomLeft",items:["vidContainer"]},
  {position:"BottomRight",items:[]}
]

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <DragNDrop data={data}/>
      </header>
    </div>
  );
}

export default App;
