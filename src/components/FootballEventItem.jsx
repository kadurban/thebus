import { ethers } from "ethers";
import {useContext, useState} from "react";
import { MdLibraryAdd, MdBlock, MdMoney, MdUndo } from "react-icons/md";
import previewBg from '../images/bg-football.jpg';
import {AppSettingsContext} from "../appSettingsContext";
import {NavLink} from "react-router-dom";

// Maybe better to export from some config outside
const footballOutcomes = [
  '0-0', '0-1', '0-2', '0-3', '0-4',
  '1-0', '1-1', '1-2', '1-3', '1-4',
  '2-0', '2-1', '2-2', '2-3', '2-4',
  '3-0', '3-1', '3-2', '3-3', '3-4',
  '4-0', '4-1', '4-2', '4-3', '4-4'
];

function FootballEventItem({ id, pot, title, status, addresses, voteSize }) {
  const { isAdmin, contract } = useContext(AppSettingsContext);
  const [ isItPayoutModeOnForPickUpOutcome, setIsItPayoutModeOnForPickUpOutcome ] = useState(false);

  const setEventStatusToVotingDisabled = async () => {
    await contract.setEventStatusToVotingDisabled(id);
  }

  const payout = async (bucketIdx) => {
    if (!isAdmin) return null;
    alert(`Payout: id: ${id}; bucketIdx: ${bucketIdx};`);
    // await contract.payout(id, bucketIdx);
  };

  const submitVote = async (bucketIdx) => {
    // await contract.submitVote(id, bucketIdx);
    alert(`submitVote: id: ${id}; bucketIdx: ${bucketIdx}; "promoter" unset (fix it)`);

  };

  return (
    <div className="shadow-lg rounded-lg bg-white">
      <div className="rounded-t-lg bg-cover bg-center overflow-hidden" style={{ backgroundImage: `url(${previewBg})`}}>
        {/*<img src={previewBg} alt={title} className="-mt-20 z-30"/>*/}
        <h3 className="font-bold text-2xl text-center py-2 z-50 top-0 text-white text-center w-full bg-black/30">
          {title}
        </h3>
      </div>

      <div className="grid grid-cols-3 gap-2 text-center border-bottom-gold-light-1 bg-gray-50">
        <div className="text-sm">
          Vote size: <br/>
          <b className="text-xl text-gold">{ethers.utils.formatEther(voteSize)}</b>
        </div>
        <div className="text-sm">
          Winners get: <br/>
          <b className="text-xl text-gold">{ethers.utils.formatEther(pot)}</b>
        </div>
        <div className="text-sm">
          Votes total: <br/>
          <b className="text-xl text-gold">{addresses.length}</b>
        </div>
      </div>

      <div className="text-center py-2">
        Vote for outcome
      </div>

      <div className={`bg-white text-center transition-all ${isItPayoutModeOnForPickUpOutcome ? 'scale-125 shadow-2xl' : ''}`}>
        <div className="grid grid-cols-5 text-center">
          {footballOutcomes.map((outComeStr, idx) => (
            <div className="transition-all hover:scale-150" key={`event-${id}-bucket-${idx}`}>
              <button
                onClick={() => isItPayoutModeOnForPickUpOutcome ? payout(idx) : submitVote(idx, '')}
                disabled={status !== 0 && !isAdmin}
                className="text-lg block py-2 px-4 cursor-pointer hover:shadow-lg text-center w-full bg-white "
              >
                {outComeStr}
              </button>
            </div>
          ))}
        </div>
        {isItPayoutModeOnForPickUpOutcome && (
          <div className="grid grid-cols-1">
            <button
              className="btn btn-no-shadow flex items-center justify-center text-gray-600"
              onClick={() => setIsItPayoutModeOnForPickUpOutcome(false)}
            >
              <MdUndo size="1.4rem"/> <span className="ml-2">Cancel payout</span>
            </button>
          </div>
        )}
      </div>

      {isAdmin && <div className={`grid ${status === 1 ? 'grid-cols-1' : 'grid-cols-2'} text-center bg-gray-50`}>
        {status === 0 && <NavLink to="/admin/setup-event" className="btn btn-no-shadow flex items-center justify-center no-gold-hover">
          <MdLibraryAdd size="1.4rem"/> <span className="ml-2">Clone</span>
        </NavLink>}
        {status === 0 && <button className="btn btn-no-shadow flex items-center justify-center" onClick={setEventStatusToVotingDisabled}>
          <MdBlock size="1.4rem"/> <span className="ml-2">Stop bets</span>
        </button>}
        {status === 1 && <button
          className="btn btn-no-shadow flex items-center justify-center text-amber-600"
          onClick={() => setIsItPayoutModeOnForPickUpOutcome(true)}
        >
          <MdMoney size="1.4rem"/> <span className="ml-2">Payout</span>
        </button>}
      </div>}
    </div>
  );
}

export default FootballEventItem;
