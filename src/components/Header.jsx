import {useContext, useState} from "react";
import { useMoralis } from "react-moralis";
import { MdAccountBalanceWallet, MdLogout } from "react-icons/md";
import Menu from "./Menu";

function Header() {
  // const { isAdmin } = useContext(AppSettingsContext);
  const { authenticate, isAuthenticated, logout } = useMoralis();
  // const [ menuOpened, setMenuOpened ] = useState(false);

  return (
    <div className="Header w-full px-4 sm:px-0 sm:sticky sm:top-0 bg-default">
      <div className="flex justify-between relative">
        <Menu/>
        <div className="flex">
          {!isAuthenticated ? (
            <button className="p-3 pr-4 flex items-center text-gold" onClick={() => authenticate()}>
              <MdAccountBalanceWallet size="1.4em" className="mr-2"/> Connect
            </button>
          ) : (
            <button className="p-3 pr-4 flex items-center text-gold" onClick={() => logout()}>
              <MdLogout size="1.4em" className="mr-2"/> Logout {/*{isAdmin && <span className="text-red-500 pl-1">(A)</span>}*/}
            </button>
          )}
        </div>
      </div>
      <hr/>
    </div>
  );
}

export default Header;
