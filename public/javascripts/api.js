function getApi(url, method = 'GET', body = null) {
    const headers = {'Content-Type': 'application/json'};

    return fetch(`/api/${url}`, {
        method,
        headers,
        body: body ? JSON.stringify(body) : null
    }).then(res => {
        if (!res.ok) {
            return res.json().then(json => {
                throw new Error(json.data.message || 'Error fetching data');
            });
        }
        return res.json();
    });
}

export { getApi };