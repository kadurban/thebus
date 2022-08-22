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
      <h1 className="page-title">
        Earn crypto with us
      </h1>
      <br/>
      <div className="text-l font-bold sm:text-center">
        We share with you 50/50
      </div>
      <div className="text-content">
        {/*<FaBitcoin size="5em" className="inline-block mb-6"/>*/}
        {/*<br/>*/}
        For every vote placed by someone who was invited by you you will get <b>{ promoterPercent }%</b>
      </div>
    </>
  );
}

export default Earn;
