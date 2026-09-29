const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
const SERVER_URL = API_URL.replace(/\/api\/?$/, '')

const request = async (url, method = 'GET', body = null, useApi = true) => {
  const token = localStorage.getItem('fh_token')
  const baseUrl = useApi ? API_URL : SERVER_URL

  const options = {
    method: method,
    headers: {
      'Content-Type': 'application/json'
    }
  }

  if (token) {
    options.headers.Authorization = `Bearer ${token}`
  }

  if (body !== null) {
    options.body = JSON.stringify(body)
  }

  const response = await fetch(`${baseUrl}${url}`, options)
  let data = {}

  try {
    data = await response.json()
  } catch (error) {
    data = {}
  }

  if (!response.ok) {
    throw new Error(data.message || 'Request failed')
  }

  return data
}

const makeQuery = (params = {}) => {
  const query = new URLSearchParams()

  Object.keys(params).forEach((key) => {
    const value = params[key]

    if (value !== '' && value !== null && value !== undefined) {
      query.append(key, value)
    }
  })

  const result = query.toString()

  if (!result) {
    return ''
  }

  return `?${result}`
}

const api = {
  health: () => request('/', 'GET', null, false),

  register: (data) => request('/auth/register', 'POST', data),
  login: (data) => request('/auth/login', 'POST', data),
  getProfile: () => request('/auth/profile'),
  updateProfile: (data) => request('/auth/profile', 'PUT', data),
  forgotPassword: (data) => request('/auth/forgot-password', 'POST', data),
  resetPassword: (token, data) => request(`/auth/reset-password/${token}`, 'POST', data),

  getCategories: () => request('/categories'),
  getCategoryById: (id) => request(`/categories/${id}`),
  createCategory: (data) => request('/categories', 'POST', data),
  updateCategory: (id, data) => request(`/categories/${id}`, 'PUT', data),
  deleteCategory: (id) => request(`/categories/${id}`, 'DELETE'),

  getContent: (params = {}) => request(`/content${makeQuery(params)}`),
  getContentById: (id) => request(`/content/${id}`),
  createContent: (data) => request('/content', 'POST', data),
  updateContent: (id, data) => request(`/content/${id}`, 'PUT', data),
  deleteContent: (id) => request(`/content/${id}`, 'DELETE'),
  rateContent: (id, data) => request(`/content/${id}/rate`, 'POST', data),

  getCharacters: (params = {}) => request(`/characters${makeQuery(params)}`),
  getCharacterById: (id) => request(`/characters/${id}`),
  createCharacter: (data) => request('/characters', 'POST', data),
  updateCharacter: (id, data) => request(`/characters/${id}`, 'PUT', data),
  deleteCharacter: (id) => request(`/characters/${id}`, 'DELETE'),

  getMerchandise: () => request('/merchandise'),
  getMerchandiseById: (id) => request(`/merchandise/${id}`),
  createMerchandise: (data) => request('/merchandise', 'POST', data),
  updateMerchandise: (id, data) => request(`/merchandise/${id}`, 'PUT', data),
  deleteMerchandise: (id) => request(`/merchandise/${id}`, 'DELETE'),

  getEvents: () => request('/events'),
  getEventById: (id) => request(`/events/${id}`),
  createEvent: (data) => request('/events', 'POST', data),
  updateEvent: (id, data) => request(`/events/${id}`, 'PUT', data),
  deleteEvent: (id) => request(`/events/${id}`, 'DELETE'),

  getBookmarks: () => request('/bookmarks'),
  addBookmark: (data) => request('/bookmarks', 'POST', data),
  deleteBookmark: (id) => request(`/bookmarks/${id}`, 'DELETE'),

  submitFeedback: (data) => request('/feedback', 'POST', data),
  getAllFeedback: () => request('/feedback'),
  updateFeedbackStatus: (id, data) => request(`/feedback/${id}/status`, 'PUT', data),

  createSubmission: (data) => request('/submissions', 'POST', data),
  getMySubmissions: () => request('/submissions/my'),
  getAllSubmissions: () => request('/submissions'),
  updateSubmissionStatus: (id, data) => request(`/submissions/${id}/status`, 'PUT', data),

  getUsers: () => request('/users'),
  updateUserRole: (id, data) => request(`/users/${id}/role`, 'PUT', data),
  deleteUser: (id) => request(`/users/${id}`, 'DELETE')
}

export { API_URL, api }
