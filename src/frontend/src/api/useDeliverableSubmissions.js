import { useState, useEffect } from 'react';

const apiurl = process.env.API_URL;

export const useDeliverableSubmissions = deliverableId => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submissions, setSubmissions] = useState(null);

  const load = () => {
    setError(null);

    window.fetch(`${apiurl}/submissions?deliverableId=${deliverableId}`, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
    }).then(body => body.json()).then(result => {
      if (result.responseCode === 0) {
        setSubmissions(result.submissions.map(submission => {
          const buffer = new Uint8Array(submission.submissionFile.data);
          const blob = new window.Blob([buffer], { type: submission.fileType });
          blob.filename = submission.fileName;

          return ({
            ...submission,
            submissionDate: new Date(submission.submissionDate),
            submissionFile: blob,
          });
        }));
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
    submissions,
    reload: load,
  };
};
