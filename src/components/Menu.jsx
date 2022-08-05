import { NavLink } from "react-router-dom";
import {useContext, useState} from 'react';
import { MdAdd, MdHome } from 'react-icons/md';
import { FaBitcoin } from 'react-icons/fa';
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
      <button className="hidden sm:block p-4" onClick={() => handleMenuToggle()}>
        <MdMenu size="2em" color="#a59447"/>
      </button>
      <div className={`flex sm:${ isMenuOpened ? 'block' : 'hidden'} sm:absolute sm:w-full sm:shadow-xl sm:z-50 sm:top-full bg-default`}>
      {/*<div className="flex sm:hidden">*/}
        <NavLink to="/" className="p-4 flex items-center text-gold" onClick={() => handleMenuToggle()}>
          <MdHome size="2em" className="mr-4"/> <span className="text-gray-700">Main page</span>
        </NavLink>
        <NavLink to="/earn" className="p-4 flex items-center text-gold" onClick={() => handleMenuToggle()}>
          <FaBitcoin size="2em" className="mr-4"/> <span className="text-gray-700">Earn</span>
        </NavLink>
        {isAdmin && <NavLink to="/admin/setup-event" className="p-4 flex items-center text-gold" onClick={() => handleMenuToggle()}>
          <MdAdd size="2em" className="mr-4"/> <span className="text-gray-700">Setup event</span>
        </NavLink>}
      </div>
    </div>
  );
}

export default Menu;
