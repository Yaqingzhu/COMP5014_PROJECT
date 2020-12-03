import React from 'react';
import { useParams } from 'react-router-dom';

import { useProf } from '../api/useProf';
import { editProf } from '../api/profAPI';
import Loader from '../components/Loader';
import ProfForm from '../components/ProfForm';

export const ProfPage = () => {
  const { id } = useParams();
  const { loading, prof, reload } = useProf(id);

  const handleSave = data => {
    editProf(parseInt(data.profId), data).then(() => {
      reload();
    });
  };

  return loading || !prof ? (
    <div className="text-center">
      <Loader />
    </div>
  ) : (
    <ProfForm handleSave={handleSave} prof={prof} />
  );
};

export default ProfPage;
