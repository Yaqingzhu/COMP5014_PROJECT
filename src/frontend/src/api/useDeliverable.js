import { useState, useEffect } from 'react';

const apiurl = process.env.API_URL;

export const useDeliverable = deliverableId => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deliverable, setDeliverable] = useState(null);

  const load = () => {
    setError(null);

    window.fetch(`${apiurl}/deliverable?deliverableId=${deliverableId}`, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
    }).then(body => body.json()).then(result => {
      if (result.responseCode === 0) {
        setDeliverable(result.deliverable);
      } else {
        setError(result.errorMessage);
      }
      setLoading(false);
    }).catch(error => {
      setError(error);
    });
  };

  useEffect(load, [deliverableId]);

  return {
    loading,
    error,
    deliverable,
    reload: load,
  };
};
