import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { SupabaseProvider } from './contexts/SupabaseContext';
import InstallPrompt from './components/InstallPrompt';
import Homepage from './pages/Homepage';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import HealthServices from './pages/HealthServices';
import BlogList from './pages/BlogList';
import BlogDetail from './pages/BlogDetail';
import SchoolJobs from './pages/SchoolJobs';
import HomeTuition from './pages/HomeTuition';

function App() {
  return (
    <SupabaseProvider>
      <Router>
        <InstallPrompt />
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/health" element={<HealthServices />} />
          <Route path="/blogs/:category" element={<BlogList />} />
          <Route path="/blog/:category/:slug" element={<BlogDetail />} />
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/school-jobs" element={<SchoolJobs />} />
          <Route path="/home-tuition" element={<HomeTuition />} />
        </Routes>
      </Router>
    </SupabaseProvider>
  );
}

export default App;