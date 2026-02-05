import api from './api';

const createReclamation = (titre, description, type_reclamation, pieces_jointes) => {
    return api.post('/reclamations/create', {
        titre,
        description,
        type_reclamation,
        pieces_jointes
    });
};

const getMyReclamations = () => {
    return api.get('/reclamations/my');
};

const getAllReclamations = () => {
    return api.get('/reclamations/all');
};

const getAssignedReclamations = () => {
    return api.get('/reclamations/assigned');
};

const updateStatus = (id, status) => {
    return api.put(`/reclamations/${id}/status`, { status });
};

const assignReclamation = (id, filiere_id, site_id) => {
    return api.put(`/reclamations/${id}/assign`, { filiere_id, site_id });
};

const ReclamationService = {
    createReclamation,
    getMyReclamations,
    getAllReclamations,
    getAssignedReclamations,
    updateStatus,
    assignReclamation
};

export default ReclamationService;
