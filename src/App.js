import './App.css';
import { Route, Routes } from 'react-router-dom';
import VotingApp from './voting/VotingApp';
import AdminApp from './admin/Admin';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route exact path="/" element={<VotingApp />} />
        <Route exact path="/admin" element={<AdminApp />} />
      </Routes>
    </div>
  );
}

export default App;