import { useState, useEffect, useContext } from 'react';
import {AppSettingsContext} from "../appSettingsContext";
import EventItem from "./EventItem";

function EventListOngoing() {
  const { contract } = useContext(AppSettingsContext);
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
    const eventsCount = await contract.lastEventId();
    setEventsCount(eventsCount);
  }

  useEffect(() => {
    getEventsCount();
  }, []);

  return (
    <>
      Total events: {eventsCount}
      <div className="grid grid-cols-3 gap-4">
        {events.map((event) => <EventItem key={event.id} {...event}/>)}
      </div>
    </>
  );
}

export default EventListOngoing;
