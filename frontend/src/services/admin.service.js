import api from './api';

const getAllUsers = () => {
    return api.get('/admin/users');
};

const getUser = (userId) => {
    return api.get(`/admin/users/${userId}`);
};

const createUser = (userData) => {
    return api.post('/admin/users', userData);
};

const updateUser = (userId, userData) => {
    return api.put(`/admin/users/${userId}`, userData);
};

const deleteUser = (userId) => {
    return api.delete(`/admin/users/${userId}`);
};

const getRoles = () => {
    return api.get('/admin/roles');
};

const getFilieres = () => {
    return api.get('/admin/filieres');
};

const getSites = () => {
    return api.get('/admin/sites');
};

const AdminService = {
    getAllUsers,
    getUser,
    createUser,
    updateUser,
    deleteUser,
    getRoles,
    getFilieres,
    getSites
};

export default AdminService;
