import { getApi } from './api.js';

function login(username, password) {
    return getApi('auth/login', 'POST', {username, password})
        .then(res => {
            if (res.success) {
                document.cookie = 'token=' + res.data.result.token + '; path=/';
                window.location.href = '/';
            } else {
                alert(res.data.message);
            }
        })
        .catch(err => {
            console.error(err.message);
        });
}

function logout() {
    return getApi('auth/logout', 'POST', null, true)
        .then(() => {
            document.cookie = `token=; path=/; expires=${new Date(Date.now() - 1000).toUTCString()}`;
            alert('You have been logged out');
            window.location.href = '/';
        })
    .catch(err => {
        console.error(err.message);       
    })
}

function register(username, password) {
    return getApi('auth/register', 'POST', {username, password})
        .then (res => {
            if (res.success) {
                document.cookie = 'token=' + res.data.result.token + '; path=/';
                window.location.href = '/';
            } else {
                alert(res.data.message);
            }
        })
    .catch(err => {
        console.error(err.message);       
    })
}

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', (event) => {
            event.preventDefault();
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            login(username, password);
        });
    }
    
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (event) => {
            event.preventDefault();
            logout();
        });   
    }
    
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', (event) => {
            event.preventDefault();
            const username = document.getElementById('username').value;
        })
    }
})