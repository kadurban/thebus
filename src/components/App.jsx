import {
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom";

import Header from "./Header";
import EventBuckets from "./EventBuckets";
import EventListOngoing from "./EventListOngoing";

function App() {
  return (
    <Router>
      <div className="container mx-auto flex flex-col items-center justify-items-stretch">
        <Header/>
        <Routes>
          <Route path="/" element={<EventListOngoing/>} />
          <Route path="/events/:eventId" element={<EventBuckets/>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
