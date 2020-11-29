export const students = [
  {
    studentId: 1,
    studentName: 'test1',
    studentEmail: 'test1@test.test',
    admitted: false,
    birthDate: new Date(),
  },
  {
    studentId: 2,
    studentName: 'test2',
    studentEmail: 'test2@test.test',
    admitted: true,
    birthDate: new Date(),
  },
];

export const studentRegisteredCourses = [
  {
    courseId: 123,
    dropDate: '2020-11-28 23:03:05.000000',
    lateDrop: 1,
    studentId: 22354,
    courseName: 'test',
    finalGrade: 'N/A',
    courseSlots: [{ day: 1, time: '10:30:00.000000' }],
    lateDropApproval: 0,
    lateRegistration: 1,
    registrationDate: '2020-11-28 23:01:30.000000',
    lateRegistrationApproval: 0
  },
  {
    courseId: 1234,
    dropDate: null,
    lateDrop: 0,
    studentId: 22354,
    courseName: 'test2',
    finalGrade: 'N/A',
    courseSlots: [],
    lateDropApproval: null,
    lateRegistration: 1,
    registrationDate: '2020-11-28 23:15:07.000000',
    lateRegistrationApproval: 0
  }
];
