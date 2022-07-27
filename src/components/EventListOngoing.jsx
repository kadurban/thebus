import { useState, useEffect } from 'react';
import { ethers } from "ethers";
import EventItem from "./EventItem";

function EventListOngoing() {
  const [ signer, setSigner ] = useState(null);
  const [ contract, setContract ] = useState(null);
  const [ eventsCount, setEventsCount ] = useState(null);
  const [ events, setEvents ] = useState([]);

  // async function getEventsCount() {
  //   const eventsCount = await contract.getEventsCount();
  //   console.log('+++');
  //   console.log(eventsCount);
  //   setEventsCount(eventsCount);
  //
  //   if (eventsCount > 0) {
  //     for (let i = 1; i <= eventsCount && i <= 9; i++) {
  //       await getEventData(i);
  //     }
  //   }
  // }
  //
  // async function getEventData(id) {
  //   const { pot, title, voteSize, buckets } = await contract.getEventData(id);
  //   setEvents([...events, { id, pot, title, voteSize, buckets }])
  // }

  async function getEventsCount() {
    console.log('+++', contract)
    const eventsCount = await contract.getEventsCount();
    setEventsCount(eventsCount);
  }

  useEffect(() => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(window.soccerContractAddress, window.soccerContractAbi, signer);
    setSigner(signer);
    setContract(contract);
    // console.log('===', signer, contract);
    // getEventsCount();
  }, []);

  // useEffect(() => {
  //   if (contract && signer) {
  //     console.log('===')
  //     getEventsCount();
  //   }
  // }, [ signer, contract ]);

  return (
    <div className="container mx-auto">
      Total events: {eventsCount}
      <hr/>
      <div className="grid grid-cols-3 gap-4">
        {events.map((event) => <EventItem key={event.id} {...event}/>)}
      </div>
    </div>
  );
}

export default EventListOngoing;
