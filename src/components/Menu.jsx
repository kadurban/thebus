import { NavLink } from "react-router-dom";
import { FaFutbol, FaUser } from 'react-icons/fa';
import { useMoralis } from "react-moralis";

function Menu() {
  const { authenticate, isAuthenticated, logout } = useMoralis();

  return (
    <div className="flex flex-row w-full justify-between">
      <div>
        <NavLink to="/" className="p-4 flex">
          <FaFutbol className="pr-2 mt-1 w-8"/> Football
        </NavLink>
      </div>
      <div>
        {!isAuthenticated ? (
          <button className="p-4 flex link-gold" onClick={() => authenticate()}>
            <FaUser className="pr-2 mt-1 w-8"/> Connect
          </button>
        ) : (
          <div className="flex">
            <button className="p-4 flex link-gold" onClick={() => logout()}>
              Disconnect
            </button>
          </div>
        )}
      </div>
      {/*<NavLink to="/create" className="p-4 flex" activeClassName="font-bold">
        <FaPlusSquare className="pr-2 w-8"/> Create event
      </NavLink>*/}
    </div>
  );
}

export default Menu;
