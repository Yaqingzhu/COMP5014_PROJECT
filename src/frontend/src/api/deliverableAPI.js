const apiurl = process.env.API_URL;

export const createDeliverable = (courseId, deliverable) => new Promise((resolve, reject) => {
  window.fetch(`${apiurl}/createdeliverable`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      ...deliverable,
      courseId,
      deliverableId: undefined,
    }),
  }).then(res => res.json()).then(res => {
    if (res.responseCode === 0) {
      resolve(res.deliverableId);
    } else {
      reject(new Error(res.errorMessage));
    }
  });
});

export const editDeliverable = (id, deliverable) => new Promise((resolve, reject) => {
  window.fetch(`${apiurl}/modifydeliverable`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      ...deliverable,
      deliverableId: id,
    }),
  }).then(res => res.json()).then(res => {
    if (res.responseCode === 0) {
      resolve(res.deliverableId);
    } else {
      reject(new Error(res.errorMessage));
    }
  });
});

export const deleteDeliverable = id => new Promise((resolve, reject) => {
  window.fetch(`${apiurl}/deletedeliverable`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      deliverableId: id,
    }),
  }).then(res => res.json()).then(res => {
    if (res.responseCode === 0) {
      resolve();
    } else {
      reject(new Error(res.errorMessage));
    }
  });
});
