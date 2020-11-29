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
  window.fetch(`${apiurl}/modifystudent`, {
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
    method: 'DELETE',
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

export const registerCourse = (student, course) => new Promise((resolve, reject) => {
  window.fetch(`${apiurl}/registercourse`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      studentId: student.loginId,
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

export const dropCourse = (student, course) => new Promise((resolve, reject) => {
  window.fetch(`${apiurl}/dropcourse`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      studentId: student.loginId,
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
