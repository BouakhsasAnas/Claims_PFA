import api from './api';

const uploadFile = (file) => {
    const formData = new FormData();
    formData.append('file', file);

    return api.post('/upload/upload', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
};

const UploadService = {
    uploadFile
};

export default UploadService;
