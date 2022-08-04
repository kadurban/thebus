import {
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom";
import { useEffect, useState } from "react";
import { useMoralis } from "react-moralis";
import { ethers } from "ethers";
import { AppSettingsContext } from "../appSettingsContext";
import Header from "./Header";
import EventBuckets from "./EventBuckets";
import SetupEvent from "./admin/SetupEvent";
import EventListOngoing from "./EventListOngoing";

function App() {
  const { user, isAuthenticated } = useMoralis();
  const [ isAdmin, setIsAdmin ] = useState(false);
  const [ signer, setSigner ] = useState(null);
  const [ contract, setContract ] = useState(null);
  const [ provider, setProvider ] = useState(null);
  const [ isWeb3Supported, setIsWeb3Supported ] = useState(false);

  useEffect(() => {
    console.log('App initial useEffect()');
    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(window.eventManagerContractAddress, window.eventManagerContractAbi, signer);
      setIsWeb3Supported(true);
      setSigner(signer);
      setContract(contract);
      setProvider(provider);
    }
  }, []);

  useEffect(() => {
    const ensureAddressIsAdmin = async () => {
      const isConnectedAddressAdmin = await contract.ensureAdminByAddress(user.attributes.ethAddress);
      setIsAdmin(isConnectedAddressAdmin);
    };
    isAuthenticated ? ensureAddressIsAdmin() : setIsAdmin(false);
  }, [ isAuthenticated ]);

  return (
    <Router>
      <AppSettingsContext.Provider value={{ isWeb3Supported, provider, isAdmin, signer, contract }}>
      <div className="container mx-auto flex flex-col items-center justify-items-stretch">
        <Header/>
        <div className="container mx-auto p-4">
          <Routes>
            <Route path="/" element={<EventListOngoing/>} />
            <Route path="/events/:eventId" element={<EventBuckets/>} />
            <Route path="/admin/setup-event" element={<SetupEvent/>} />
            <Route path="*" element={<h2 className="text-xl font-bold">404 - Page not found.</h2>}/>
          </Routes>
        </div>
      </div>
      </AppSettingsContext.Provider>
    </Router>
  );
}

export default App;
