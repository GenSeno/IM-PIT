// Example route setup in your main router configuration
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import DashboardHeader from './components/DashboardHeader';
import UserDetails from './components/UserDetails';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<DashboardHeader />} />
        <Route path="/user/:id" element={<UserDetails />} />
        {/* Other routes */}
      </Routes>
    </Router>
  );
}

export default App;
