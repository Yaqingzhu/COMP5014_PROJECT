import React from 'react';
import { useHistory } from 'react-router-dom';

import { createProf } from '../api/profAPI';
import ProfForm from '../components/ProfForm';

export const NewProfPage = () => {
  const history = useHistory();

  const handleSave = data => {
    createProf(data).then(profId => {
      history.push(`/profs/${profId}`);
    });
  };

  return (
    <ProfForm handleSave={handleSave} />
  );
};

export default NewProfPage;
