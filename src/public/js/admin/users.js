async function deleteUsers() {
    try {
        const response = await fetch('/api/users', { method: 'DELETE' });
        const data = await response.json();
        alert(data.message);
        if (data.status === 'success') {
            window.location.reload();
        }
    } catch (error) {
        alert(error);
    }
}