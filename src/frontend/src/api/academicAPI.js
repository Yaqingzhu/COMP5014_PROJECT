const apiurl = process.env.API_URL;

export const setDeadlines = ({ registrationDeadline, dropDeadline }) => new Promise((resolve, reject) => {
  window.fetch(`${apiurl}/updateacademicline`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      registrationDeadline,
      dropDeadline,
    }),
  }).then(res => res.json()).then(res => {
    if (res.responseCode === 0) {
      resolve();
    } else {
      reject(new Error(res.errorMessage));
    }
  });
});