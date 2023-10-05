import './App.css';
import { Route, Routes } from 'react-router-dom';
import VotingApp from './voting/VotingApp';
import AdminApp from './admin/Admin';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<VotingApp />} />
        <Route path="/admin" element={<AdminApp />} />
      </Routes>
    </div>
  );
}

export default App;