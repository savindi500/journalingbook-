import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';
export const getentries = () => axios.get(`${API_BASE_URL}/entries`);
export const addentries = (entryData) => axios.post(`${API_BASE_URL}/entries`, entryData);
