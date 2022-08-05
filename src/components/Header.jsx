import {useContext, useState} from "react";
import { useMoralis } from "react-moralis";
import { MdAccountBalanceWallet, MdLogout } from "react-icons/md";
import Menu from "./Menu";

function Header() {
  // const { isAdmin } = useContext(AppSettingsContext);
  const { authenticate, isAuthenticated, logout } = useMoralis();
  // const [ menuOpened, setMenuOpened ] = useState(false);

  return (
    <div className="Header w-full sm:px-0 sm:sticky sm:top-0 bg-default">
      <div className="flex justify-between relative">
        <Menu/>
        <div className="flex">
          {!isAuthenticated ? (
            <button className="py-1 px-4 sm:mr-4 flex items-center btn-gold self-center" onClick={() => authenticate()}>
              <MdAccountBalanceWallet size="1.4em" className="mr-2"/> Connect
            </button>
          ) : (
            <button className="p-4 flex items-center text-gold" onClick={() => logout()}>
              <MdLogout size="1.4em" className="mr-2 sm:mr-0"/> <span className="sm:hidden">Disconnect</span> {/*{isAdmin && <span className="text-red-500 pl-1">(A)</span>}*/}
            </button>
          )}
        </div>
      </div>
      <hr/>
    </div>
  );
}

export default Header;
