import api from './api';

const register = (nom, email, password) => {
    return api.post('/auth/register', {
        nom,
        email,
        password,
    });
};

const login = async (email, password) => {
    const response = await api.post('/auth/login', {
        email,
        password,
    });
    if (response.data.token) {
        localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
};

const logout = () => {
    localStorage.removeItem('user');
};

const getCurrentUser = () => {
    return JSON.parse(localStorage.getItem('user'));
};

const AuthService = {
    register,
    login,
    logout,
    getCurrentUser,
};

export default AuthService;
