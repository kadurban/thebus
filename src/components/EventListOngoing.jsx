import { useState, useEffect, useContext } from 'react';
import { MdMoreHoriz } from 'react-icons/md';
import { AppSettingsContext } from "../appSettingsContext";
import FootballEventItem from "./FootballEventItem";

function EventListOngoing() {
  const { contract } = useContext(AppSettingsContext);
  const [ eventsCount, setEventsCount ] = useState(null);
  const [ events, setEvents ] = useState([]);
  const [ lastLoadedEvent, setLastLoadedEvent ] = useState([]);

  const getEventsCount = async () => {
    const eventsCount = await contract.lastEventId();
    setEventsCount(eventsCount);
  };

  const getLatestEventsData = async (limit) => {
    let requestedEvents = [];
    for (let count = eventsCount; count > 0 && count > eventsCount - limit; count--) {
      console.log('eventsCount - limit', eventsCount - limit);
      const eventData = await contract.getEventData(count);
      requestedEvents.push({ id: count, ...eventData });
      setLastLoadedEvent(count);
    }
    setEvents(requestedEvents);
  };

  const loadOneMore = async (lastLoadedEvent) => {
    lastLoadedEvent--;
    if (lastLoadedEvent <= 0) return;
    console.log('000000');
    const eventData = await contract.getEventData(lastLoadedEvent);
    setEvents([...events, { id: lastLoadedEvent, ...eventData }]);
    setLastLoadedEvent(lastLoadedEvent);
  };

  useEffect(() => {
    getEventsCount();
  }, []);

  useEffect(() => {
    if (eventsCount > 0) getLatestEventsData(3);
  }, [ eventsCount ]);

  return (
    <>
      <h1 className="page-title">
        Events <small>({eventsCount})</small>
      </h1>
      <div className="grid grid-cols-3 gap-8">
        {events.map((event) => <FootballEventItem key={event.id} {...event}/>)}
      </div>

      <div className="flex my-8">
        {lastLoadedEvent > 1 && (
          <button className="flex m-auto btn btn-white" onClick={() => loadOneMore(lastLoadedEvent)}>
            <MdMoreHoriz size="1.5rem" className="mr-2"/> Show more events
          </button>
        )}
      </div>
    </>
  );
}

export default EventListOngoing;
