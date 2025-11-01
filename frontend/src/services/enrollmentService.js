import api from './api';

const enrollmentService = {
  enrollInCourse: async (courseId) => {
    const response = await api.post(`/enrollments/${courseId}`);
    return response.data;
  },
  getMyEnrollments: async () => {
    const response = await api.get('/enrollments/my-courses');
    return response.data;
  },
  getEnrollmentById: async (id) => {
    const response = await api.get(`/enrollments/${id}`);
    return response.data;
  },

  // Mark lesson as completed
  completeLesson: async (enrollmentId, lessonId) => {
    const response = await api.patch(`/enrollments/${enrollmentId}/complete-lesson/${lessonId}`);
    return response.data;
  },

  // Add rating and review
  addRating: async (enrollmentId, score, review) => {
    const response = await api.post(`/enrollments/${enrollmentId}/rate`, { score, review });
    return response.data;
  },

  // Get course students (instructor only)
  getCourseStudents: async (courseId) => {
    const response = await api.get(`/enrollments/course/${courseId}/students`);
    return response.data;
  },

  // Issue certificate (instructor only)
  issueCertificate: async (enrollmentId) => {
    const response = await api.post(`/enrollments/${enrollmentId}/certificate`);
    return response.data;
  },

  // Drop course
  dropCourse: async (enrollmentId) => {
    const response = await api.delete(`/enrollments/${enrollmentId}`);
    return response.data;
  }
};

export default enrollmentService;
