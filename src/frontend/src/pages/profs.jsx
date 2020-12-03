import React from 'react';
import { Link, useHistory } from 'react-router-dom';

import { useProfs } from '../api/useProfs';
import { deleteProf } from '../api/profAPI';
import { Loader } from '../components/Loader';

export const ProfsPage = () => {
  const { loading, profs, reload } = useProfs();
  const history = useHistory();

  const handleDeleteProf = (event, prof) => {
    deleteProf(prof).then(() => {
      reload();
    });
    event.preventDefault();
  };

  return loading || !profs ? (
    <div className="text-center">
      <Loader />
    </div>
  ) : (
    <div>
      <div
        className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
        <h1 className="h2">Available profs</h1>
        <div className="btn-toolbar mb-2 mb-md-0">
          <div className="btn-group mr-2">
            <button
              type="button"
              className="btn btn-sm btn-outline-secondary"
              onClick={() => history.push('/students/new')}
            >
              New prof
            </button>
          </div>
        </div>
      </div>
      {profs.length > 0 ? (
        <table className="table table-striped">
          <thead className="thead-dark">
          <tr>
            <th scope="col">#</th>
            <th scope="col">Name</th>
            <th scope="col">Commands</th>
          </tr>
          </thead>
          <tbody>
          {profs.map(prof => (
            <tr key={prof.profId}>
              <th scope="row">{prof.profId}</th>
              <td>
                <Link to={`/profs/${prof.profId}`}>{prof.profName}</Link>
              </td>
              <td>
                <Link to={`/profs/${prof.profId}`}>Edit</Link>
                <a href="#" onClick={event => handleDeleteProf(event, prof)} className="ml-2">Delete</a>
              </td>
            </tr>
          ))}
          </tbody>
        </table>
      ) : (
        <div className="alert alert-info" role="alert">
          No profs available in the system, <Link to="/profs/new">click here to create one</Link>.
        </div>
      )}
    </div>
  );
};

export default ProfsPage;
