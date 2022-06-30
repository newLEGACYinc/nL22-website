import './App.css';
import { Route, Routes } from 'react-router-dom';
import HoLApp from './higherorlower/HoLApp';
import Homepage from './homepage/Home';
import KayfableApp from './kayfable/KayfableApp';
import AdminApp from './admin/AdminApp';
import Header from './components/Navbar'

function App() {
  return (
    <div className="App">
      {/* <Header /> */}
      <Routes>
        <Route exact path="/" element={<Homepage />} />
        <Route exact path="/higherorlower" element={<HoLApp />} />
        <Route exact path="/kayfable" element={<KayfableApp />} />
        <Route exact path="/admin" element={<AdminApp />} />
      </Routes>
    </div>
  );
}

export default App;
