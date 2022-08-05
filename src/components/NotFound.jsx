import { Link } from "react-router-dom";
import { MdSearchOff, MdHome } from 'react-icons/md';

function EventItem() {
  return (
    <>
      <div className="text-xl font-bold text-center mt-8">
        <MdSearchOff size="4em" className="inline-block my-4"/>
        <br/>
        Page not found
      </div>
      <br/>
      <div className="text-center">
        <Link to="/" className="underline">
          <MdHome size="1.2em" className="inline-block"/> go to main page
        </Link>
      </div>
    </>
  )
}

export default EventItem;
