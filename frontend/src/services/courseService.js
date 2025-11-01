import api from './api';

const courseService = {
  // Get all published courses
  getAllCourses: async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.category) params.append('category', filters.category);
    if (filters.level) params.append('level', filters.level);
    if (filters.search) params.append('search', filters.search);
    if (filters.sort) params.append('sort', filters.sort);
    
    const response = await api.get(`/courses?${params.toString()}`);
    return response.data;
  },

  // Get single course by ID
  getCourseById: async (id) => {
    const response = await api.get(`/courses/${id}`);
    return response.data;
  },

  // Get instructor's courses
  getMyInstructorCourses: async () => {
    const response = await api.get('/courses/instructor/my-courses');
    return response.data;
  },

  // Create new course
  createCourse: async (courseData) => {
    const response = await api.post('/courses', courseData);
    return response.data;
  },

  // Update course
  updateCourse: async (id, courseData) => {
    const response = await api.put(`/courses/${id}`, courseData);
    return response.data;
  },

  // Delete course
  deleteCourse: async (id) => {
    const response = await api.delete(`/courses/${id}`);
    return response.data;
  },

  // Publish/Unpublish course
  togglePublish: async (id) => {
    const response = await api.patch(`/courses/${id}/publish`);
    return response.data;
  },

  // Add lesson to course
  addLesson: async (courseId, lessonData) => {
    const response = await api.post(`/courses/${courseId}/lessons`, lessonData);
    return response.data;
  },

  // Update lesson
  updateLesson: async (courseId, lessonId, lessonData) => {
    const response = await api.put(`/courses/${courseId}/lessons/${lessonId}`, lessonData);
    return response.data;
  },

  // Delete lesson
  deleteLesson: async (courseId, lessonId) => {
    const response = await api.delete(`/courses/${courseId}/lessons/${lessonId}`);
    return response.data;
  }
};

export default courseService;
