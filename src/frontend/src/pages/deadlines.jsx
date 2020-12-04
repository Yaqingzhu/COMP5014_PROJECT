import React from 'react';

import { useDeadlines } from '../api/useDeadlines';
import { setDeadlines } from '../api/academicAPI';
import Loader from '../components/Loader';
import DeadlinesForm from '../components/DeadlinesForm';

export const DeadlinesPage = () => {
  const { loading, deadlines, reload } = useDeadlines();

  const handleSave = data => {
    setDeadlines(data).then(() => {
      reload();
    });
  };

  return loading || !deadlines ? (
    <div className="text-center">
      <Loader />
    </div>
  ) : (
    <DeadlinesForm deadlines={deadlines} handleSave={handleSave} />
  );
};

export default DeadlinesPage;
