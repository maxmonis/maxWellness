const request = async (endpoint, { body, headers, method, token } = {}) => {
  method = method || (body ? 'POST' : 'GET')
  headers = headers || { 'content-type': 'application/json' }
  token = token || localStorage.getItem('maxWellness_token')
  if (token) headers['x-auth-token'] = token
  const options = { method, headers }
  if (body) options.body = JSON.stringify(body)
  try {
    const res = await fetch(endpoint, options)
    if (res.status === 401) localStorage.removeItem('maxWellness_token')
    return res.ok ? res.json() : Promise.reject(new Error(await res.text()))
  } catch (error) {
    return error
  }
}

export default request
