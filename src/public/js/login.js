const form = document.getElementById('login-form');

form.addEventListener('submit', async (event) => {

    event.preventDefault();

    const formFata = new FormData(form);

    const dataObj = {};

    formFata.forEach((value, key) => dataObj[key] = value);

    await fetch('/api/sessions/login', {
        method: 'POST',
        body: JSON.stringify(dataObj),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then( res => {

        if (res.status === 200) {
        
            window.location.replace('/products');
        
        } else {

            alert('Incorrect credentials');

            form[0].value = '';

            form[1].value = '';

        };

    });
    
});