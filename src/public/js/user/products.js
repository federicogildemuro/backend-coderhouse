const queryParamsForm = document.querySelector('#queryParamsForm');

queryParamsForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const parameterNames = ['limit', 'page', 'status', 'category', 'sort'];
    const formData = new FormData(queryParamsForm);
    const queryParams = {};
    parameterNames.forEach(name => {
        const value = formData.get(name);
        if (value !== "") queryParams[name] = value;
    });
    const queryParamsString = new URLSearchParams(queryParams).toString();
    window.location.href = `/products?${queryParamsString}`;
});

async function logout() {
    try {
        const response = await fetch('/api/sessions/logout', { method: 'POST' });
        const data = await response.json();
        alert(data.message);
        if (data.status === 'success') {
            window.location.href = '/login';
        }
    } catch (error) {
        alert(error);
    }
}