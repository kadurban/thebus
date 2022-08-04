import { NavLink } from "react-router-dom";
import {useContext, useState} from 'react';
import { FaFutbol, FaPlusSquare } from 'react-icons/fa';
import { MdAdd, MdHome } from 'react-icons/md';
import { MdMenu } from 'react-icons/md';
import { AppSettingsContext } from '../appSettingsContext';

function Menu() {
  const { isAdmin } = useContext(AppSettingsContext);
  const [ isMenuOpened, setIsMenuOpened ] = useState(false);

  const handleMenuToggle = () => {
    setIsMenuOpened(!isMenuOpened);
  };

  return (
    <div className="flex">
      <button className="hidden sm:block px-4 py-3" onClick={() => handleMenuToggle()}>
        <MdMenu size="2em" color="#a59447"/>
      </button>
      <div className={`flex sm:${ isMenuOpened ? 'block' : 'hidden'} sm:absolute sm:w-full sm:shadow-xl sm:z-50 sm:top-full bg-default`}>
      {/*<div className="flex sm:hidden">*/}
        <NavLink to="/" className="p-3 flex items-center text-gold" onClick={() => handleMenuToggle()}>
          <MdHome size="2em" className="mr-2"/> Main page
        </NavLink>
        {isAdmin && <NavLink to="/admin/setup-event" className="p-3 flex items-center text-gold" onClick={() => handleMenuToggle()}>
          <MdAdd size="2em" className="mr-2"/> Setup event
        </NavLink>}
      </div>
    </div>
  );
}

export default Menu;
