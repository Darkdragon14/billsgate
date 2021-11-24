import { NavLink } from 'react-router-dom';

export const Navigation = () => (
  <nav>
    <ul>
      <li><NavLink className={({ isActive }) => isActive? "current": ''} to='/'>Home</NavLink></li>
      <li><NavLink className={({ isActive }) => isActive? "current": ''} to='/about'>About</NavLink></li>
      <li><NavLink className={({ isActive }) => isActive? "current": ''} to='/contact'>Contact</NavLink></li>
    </ul>
  </nav>
);