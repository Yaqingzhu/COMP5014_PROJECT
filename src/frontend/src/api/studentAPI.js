const apiurl = process.env.API_URL;

export const register = student => new Promise((resolve, reject) => {
  window.fetch(`${apiurl}/applycreatestudent`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(student),
  }).then(res => res.json()).then(res => {
    if (res.responseCode === 0) {
      resolve(res.success);
    } else {
      reject(new Error(res.errorMessage));
    }
  });
});

export const createStudent = student => new Promise((resolve, reject) => {
  window.fetch(`${apiurl}/createstudent`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(student),
  }).then(res => res.json()).then(res => {
    if (res.responseCode === 0) {
      resolve(res.studentId);
    } else {
      reject(new Error(res.errorMessage));
    }
  });
});

export const editStudent = (id, student) => new Promise((resolve, reject) => {
  window.fetch(`${apiurl}/editstudent`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      ...student,
      studentId: id,
    }),
  }).then(res => res.json()).then(res => {
    if (res.responseCode === 0) {
      resolve(res.studentId);
    } else {
      reject(new Error(res.errorMessage));
    }
  });
});

export const deleteStudent = student => new Promise((resolve, reject) => {
  window.fetch(`${apiurl}/deletestudent`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      ...student,
    }),
  }).then(res => res.json()).then(res => {
    if (res.responseCode === 0) {
      resolve();
    } else {
      reject(new Error(res.errorMessage));
    }
  });
});
