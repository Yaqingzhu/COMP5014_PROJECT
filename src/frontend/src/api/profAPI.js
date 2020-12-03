const apiurl = process.env.API_URL;

export const createProf = prof => new Promise((resolve, reject) => {
  window.fetch(`${apiurl}/createprof`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(prof),
  }).then(res => res.json()).then(res => {
    if (res.responseCode === 0) {
      resolve(res.profId);
    } else {
      reject(new Error(res.errorMessage));
    }
  });
});

export const editProf = (id, prof) => new Promise((resolve, reject) => {
  window.fetch(`${apiurl}/modifyprof`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      ...prof,
      profId: id,
    }),
  }).then(res => res.json()).then(res => {
    if (res.responseCode === 0) {
      resolve(res.profId);
    } else {
      reject(new Error(res.errorMessage));
    }
  });
});

export const deleteProf = prof => new Promise((resolve, reject) => {
  window.fetch(`${apiurl}/deleteprof`, {
    method: 'DELETE',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(prof),
  }).then(res => res.json()).then(res => {
    if (res.responseCode === 0) {
      resolve();
    } else {
      reject(new Error(res.errorMessage));
    }
  });
});
