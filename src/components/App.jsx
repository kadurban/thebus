import {
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom";

import Header from "./Header";
import EventCreate from "./EventCreate";
import EventList from "./EventList";

function App() {
  return (
    <Router>
      <div className="container mx-auto flex flex-col items-center justify-items-stretch">
        <Header/>
        <Routes>
          <Route path="/" element={<EventList/>} />
          {/*<Route path="/" element={<EventList/>} />*/}
          <Route path="/create" element={<EventCreate/>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
