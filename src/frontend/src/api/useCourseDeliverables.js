import { useState, useEffect } from 'react';

const apiurl = process.env.API_URL;

export const useCourseDeliverables = courseId => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deliverables, setDeliverables] = useState(null);

  const load = () => {
    setError(null);

    window.fetch(`${apiurl}/coursedeliverable?courseId=${courseId}`, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
    }).then(body => body.json()).then(result => {
      if (result.responseCode === 0) {
        setDeliverables(result.deliverables.map(deliverable => ({
          ...deliverable,
          deliverableDeadline: new Date(deliverable.deliverableDeadline),
        })));
      } else {
        setError(result.errorMessage);
      }
      setLoading(false);
    }).catch(error => {
      setError(error);
    });
  };

  useEffect(load, []);

  return {
    loading,
    error,
    deliverables,
    reload: load,
  };
};
