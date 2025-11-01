import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const certificateService = {
  // Download certificate
  downloadCertificate: async (userId, courseId, options = {}) => {
    try {
      const { layout = 'portrait', margin, includeQR = true } = options;
      
      const params = new URLSearchParams();
      if (layout) params.append('layout', layout);
      if (margin) params.append('margin', margin);
      params.append('includeQR', includeQR);

      const response = await axios.get(
        `${API_URL}/api/certificate/${userId}/${courseId}?${params.toString()}`,
        {
          headers: getAuthHeader(),
          responseType: 'blob' // Important for PDF download
        }
      );

      // Create blob link to download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      
      // Extract filename from content-disposition header or use default
      const contentDisposition = response.headers['content-disposition'];
      let filename = 'Certificate.pdf';
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="(.+)"/);
        if (filenameMatch) {
          filename = filenameMatch[1];
        }
      }
      
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      return { success: true };
    } catch (error) {
      console.error('Certificate download error:', error);
      throw error;
    }
  },

  // Verify certificate
  verifyCertificate: async (certificateId) => {
    try {
      const response = await axios.get(
        `${API_URL}/api/certificate/verify/${certificateId}`
      );
      return response.data;
    } catch (error) {
      console.error('Certificate verification error:', error);
      throw error;
    }
  }
};

export default certificateService;
