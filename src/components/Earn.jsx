import { useEffect, useState, useContext } from 'react';
import { AppSettingsContext } from "../appSettingsContext";
import { FaBitcoin } from "react-icons/fa";

function Earn() {
  const { contract } = useContext(AppSettingsContext);
  const [ promoterPercent, setPromoterPercent ] = useState();

  useEffect(() => {
    getPromoterPercent();

    async function getPromoterPercent() {
      const isConnectedAddressAdmin = await contract.promoterPercent();
      setPromoterPercent(isConnectedAddressAdmin);
    }
  }, []);

  return (
    <>
      <h1 className="text-xl font-bold text-center">
        Earn crypto. We share with you 50/50.
      </h1>
      <div className="text-content text-center">
        <FaBitcoin size="5em" className="inline-block mb-6"/>
        <br/>
        For every vote placed by someone who was invited by you you will get <b>{ promoterPercent }%</b>
      </div>
    </>
  );
}

export default Earn;
