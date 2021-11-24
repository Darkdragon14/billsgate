import { Routes, Route } from 'react-router-dom';
import { Home } from '../pages/Home';
import { About } from '../pages/About';
import { Contact } from '../pages/Contact';

export const Router = () => (
  <Routes>
    <Route exact path='/' element={Home()}></Route>
    <Route exact path='/about' element={About()}></Route>
    <Route exact path='/contact' element={Contact()}></Route>
  </Routes>
);