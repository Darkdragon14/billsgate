import './App.css';
import { Navigation } from './components/NavBard';
import { Router } from './components/Router';

function App() {
  return (
    <div className='app'>
      <h1>React Router Demo</h1>
      <Navigation />
      <Router />
    </div>
  );
}

export default App;
