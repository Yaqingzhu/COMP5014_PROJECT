import React from 'react';

import AdminDashboard from './AdminDashboard';
import StudentDashboard from './StudentDashboard';
import ProfDashboard from './ProfDashboard';

export const Dashboard = ({ user }) => {
  switch (user.role) {
    case 'admin':
      return <AdminDashboard />;
    case 'student':
      return <StudentDashboard user={user} />;
    case 'prof':
      return <ProfDashboard user={user} />;
    default:
      return null;
  }
};

export default Dashboard;
