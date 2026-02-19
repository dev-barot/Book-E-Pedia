import React from 'react'

function CustomerLogout() {
    localStorage.removeItem('customer_login');
    localStorage.removeItem('customer_username');
    window.location.href = '/login';
}

export default CustomerLogout
