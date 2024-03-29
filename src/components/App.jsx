import {
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom";
import { useEffect, useState } from "react";
import { useMoralis } from "react-moralis";
import { ethers } from "ethers";
import { AppSettingsContext } from "../appSettingsContext";
import ErrorBoundary from "./ErrorBoundary";
import NotFound from "./NotFound";
import Header from "./Header";
import EventBuckets from "./EventBuckets";
import SetupEventForm from "./admin/SetupEventForm";
import EventListOngoing from "./EventListOngoing";
import Earn from "./Earn";

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
            <ErrorBoundary>
              <Header/>
              {contract && <div className="container mx-auto p-4 pt-8 sm:pt-4">
                <Routes>
                  <Route path="/" element={<EventListOngoing/>} />
                  <Route path="/earn" element={<Earn/>} />
                  <Route path="/events/:eventId" element={<EventBuckets/>} />
                  {isAdmin && <Route path="/admin/setup-event" element={<SetupEventForm/>} />}
                  <Route path="*" element={<NotFound/>}/>
                </Routes>
              </div>}
            </ErrorBoundary>
          </div>
        </AppSettingsContext.Provider>
      </Router>
  );
}

export default App;
