import { NavLink } from "react-router-dom";
import {useContext, useState} from 'react';
import { MdMenu, MdHome, MdAddBox } from 'react-icons/md';
import { FaBitcoin } from 'react-icons/fa';
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
        <NavLink to="/" className="p-4 flex items-center" onClick={() => handleMenuToggle()}>
          <MdHome size="2em" className="mr-4"/> Main page
        </NavLink>
        <NavLink to="/earn" className="p-4 flex items-center" onClick={() => handleMenuToggle()}>
          <FaBitcoin size="1.7em" className="ml-1 mr-4"/> Earn
        </NavLink>
        {isAdmin && <NavLink to="/admin/setup-event" className="p-4 flex items-center" onClick={() => handleMenuToggle()}>
          <MdAddBox size="2em" className="mr-4"/> Add event
        </NavLink>}
      </div>
    </div>
  );
}

export default Menu;
