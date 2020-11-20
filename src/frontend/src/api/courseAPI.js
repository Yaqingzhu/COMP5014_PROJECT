import { courses as mockCourses } from '../mocks/courses';

export const createCourse = (name, status, capacity) => new Promise(resolve => {
  setTimeout(() => {
    const added = {
      id: mockCourses.length + 1,
      name,
      status,
      capacity,
    };
    mockCourses.push(added);
    resolve(added);
  }, 200);
});

export const editCourse = (id, { name, status, capacity }) => new Promise((resolve, reject) => {
  setTimeout(() => {
    const course = mockCourses.find(course => course.id === id);
    if (!course) {
      reject(new Error('Course not found'));
      return;
    }
    course.name = name;
    course.status = status;
    course.capacity = capacity;

    resolve(course);
  }, 200);
});

export const deleteCourse = id => new Promise((resolve, reject) => {
  setTimeout(() => {
    const course = mockCourses.findIndex(course => course.id === id);
    if (course < 0) {
      reject(new Error('Course not found'));
      return;
    }

    resolve(mockCourses.splice(course, 1)[0]);
  }, 200);
});
