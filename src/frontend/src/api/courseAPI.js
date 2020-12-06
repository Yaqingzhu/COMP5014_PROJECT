const apiurl = process.env.API_URL;

export const createCourse = course => new Promise((resolve, reject) => {
  window.fetch(`${apiurl}/courseop`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      ...course,
      courseId: undefined,
    }),
  }).then(res => res.json()).then(res => {
    if (res.responseCode === 0) {
      resolve(JSON.parse(res.coursePayload));
    } else {
      reject(new Error(res.errorMessage));
    }
  });
});

export const editCourse = (id, course) => new Promise((resolve, reject) => {
  window.fetch(`${apiurl}/courseop`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      ...course,
      courseId: id,
    }),
  }).then(res => res.json()).then(res => {
    if (res.responseCode === 0) {
      resolve(JSON.parse(res.coursePayload));
    } else {
      reject(new Error(res.errorMessage));
    }
  });
});

export const deleteCourse = course => new Promise((resolve, reject) => {
  window.fetch(`${apiurl}/courseop`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      ...course,
      courseStatus: 'deleted',
    }),
  }).then(res => res.json()).then(res => {
    if (res.responseCode === 0) {
      resolve();
    } else {
      reject(new Error(res.errorMessage));
    }
  });
});

export const cancelCourse = course => new Promise((resolve, reject) => {
  window.fetch(`${apiurl}/cancelcourse`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      courseId: course.courseId,
    }),
  }).then(res => res.json()).then(res => {
    if (res.responseCode === 0) {
      resolve();
    } else {
      reject(new Error(res.errorMessage));
    }
  });
});

export const submitFinalGrade = course => new Promise((resolve, reject) => {
  window.fetch(`${apiurl}/submitfinalgrade`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      courseId: course.courseId,
    }),
  }).then(res => res.json()).then(res => {
    if (res.responseCode === 0) {
      resolve();
    } else {
      reject(new Error(res.errorMessage));
    }
  });
});
