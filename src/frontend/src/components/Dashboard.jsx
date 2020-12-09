import React from 'react';

import AdminDashboard from './AdminDashboard';
import StudentDashboard from './StudentDashboard';
import ProfDashboard from './ProfDashboard';

export const Dashboard = ({ user, setUser }) => {
  switch (user.role) {
    case 'admin':
      return <AdminDashboard setUser={setUser} />;
    case 'student':
      return <StudentDashboard user={user} setUser={setUser} />;
    case 'prof':
      return <ProfDashboard user={user} setUser={setUser} />;
    default:
      return null;
  }
};

export default Dashboard;
