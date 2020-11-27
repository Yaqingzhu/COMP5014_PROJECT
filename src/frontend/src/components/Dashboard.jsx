import React from 'react';

import AdminDashboard from './AdminDashboard';
import StudentDashboard from './StudentDashboard';

export const Dashboard = ({ user }) => {
  switch (user.role) {
    case 'admin':
      return <AdminDashboard />;
    case 'student':
      return <StudentDashboard user={user} />;
    default:
      return null;
  }
};

export default Dashboard;
