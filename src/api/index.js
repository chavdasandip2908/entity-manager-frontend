import axios from 'axios';

const API_BASE_URL= "https://entitymanager.onrender.com";


const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const MAX_IMAGE_SIZE = 500 * 1024; // 500 KB
export const MAX_PAYLOAD_SIZE = 1 * 1024 * 1024; // 1 MB

export const login = (email, password) => api.post('/api/v1/users/login', { email, password });
export const register = (name, email, mobile, password, image = "j,jgfsiafbfkuyasf") => api.post('/api/v1/users', { name, email, mobile, password, image });
export const getUsers = () => api.get('/api/v1/users/listing');
export const getCollections = () => api.get('/api/v1/collections');
export const getItems = () => api.get('/api/v1/items');
export const getUser = (userId) => api.get(`/api/v1/users/${userId}`);
export const getUserCollections = (userId) => api.get(`/api/v1/users/${userId}/collection`);
export const getCollection = (collectionId) => api.get(`/api/v1/collections/${collectionId}`);
export const getCollectionItems = (collectionId) => api.get(`/api/v1/collections/${collectionId}/item`);
export const updateCollection = (collectionId, data) => api.put(`/api/v1/collections/${collectionId}`, data);
export const deleteCollection = (collectionId) => api.delete(`/api/v1/collections/${collectionId}`);
export const createCollection = (data) => api.post('/api/v1/collections', data);
export const createItem = (data) => api.post('/api/v1/items', data);
export const handleImageChange = async (file, setImage, toast) => {
  if (file && (file.type === 'image/jpeg' || file.type === 'image/png')) {
    try {
      const compressedBlob = await compressImage(file);
      if (compressedBlob.size > MAX_IMAGE_SIZE) {
        toast.error(`Image size is too large. Please select an image smaller than ${MAX_IMAGE_SIZE / 1024}KB.`);
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(compressedBlob);
    } catch (error) {
      console.error('Error compressing image:', error);
      toast.error('Failed to process the image. Please try again.');
    }
  } else {
    toast.error('Please select a valid JPG or PNG image.');
  }
};

const compressImage = (file) => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        let width = img.width;
        let height = img.height;

        // Calculate the width and height, constraining the proportions
        if (width > height) {
          if (width > 800) {
            height *= 800 / width;
            width = 800;
          }
        } else {
          if (height > 800) {
            width *= 800 / height;
            height = 800;
          }
        }

        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);

        // Compress the image
        canvas.toBlob(
          (blob) => {
            resolve(blob);
          },
          'image/jpeg',
          0.7 // Adjust quality here (0.7 = 70% quality)
        );
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  });
};


export default api;