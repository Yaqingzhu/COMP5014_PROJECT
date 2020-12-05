import { useState, useEffect } from 'react';

const apiurl = process.env.API_URL;

export const useDeliverableSubmission = deliverableId => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submission, setSubmission] = useState(null);

  const load = () => {
    setError(null);

    window.fetch(`${apiurl}/submission?deliverableId=${deliverableId}`, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
    }).then(body => body.json()).then(result => {
      if (result.responseCode === 0) {
        if (result.submission) {
          const buffer = new Uint8Array(result.submission.submissionFile.data);
          const blob = new window.Blob([buffer], { type: result.submission.fileType });
          blob.filename = result.submission.fileName;

          setSubmission({
            ...result.submission,
            submissionDate: new Date(result.submission.submissionDate),
            submissionFile: blob,
          });
        }
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
    submission,
    reload: load,
  };
};
