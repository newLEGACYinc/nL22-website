import './App.css';
import { Route, Routes } from 'react-router-dom';
import VotingApp from './eoty/VotingApp';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route exact path="nL22" element={<VotingApp />} />
      </Routes>
    </div>
  );
}

export default App;