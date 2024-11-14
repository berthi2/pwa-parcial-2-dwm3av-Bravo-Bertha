async function reportarBug() {
    let mail = document.querySelector('#mail').value;
    let descripcionBug = document.querySelector('#descripcionBug').value;

    // Validación del correo
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!mail) {
        alert("Por favor, ingresa tu correo.");
        return;
    } else if (!emailRegex.test(mail)) {
        alert("Por favor, ingresa un correo válido.");
        return;
    }

    // Validación de la descripción
    if (!descripcionBug) {
        alert("Por favor, ingresa una descripción del bug.");
        return;
    } else if (descripcionBug.length < 10) {
        alert("La descripción debe tener al menos 10 caracteres.");
        return;
    }

    // Si las validaciones pasan, enviamos la solicitud
    try {
        const url = 'http://localhost/api/pokemon/report-bug.php';
        const data = {
            mail: mail,
            descripcionBug: descripcionBug
        };

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error('Error en la solicitud');
        }

        const responseData = await response.json();
        console.log('Respuesta del servidor:', responseData);
        alert("Su reporte de bug fue enviado con éxito. ¡Muchas gracias!");
        document.querySelector('#mail').value = '';
        document.querySelector('#descripcionBug').value = '';

    } catch (error) {
        console.error('Error reportando el bug:', error);
        alert("Hubo un inconveniente al enviar el formulario");
    }
}