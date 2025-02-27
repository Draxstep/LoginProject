const form = document.getElementById("formulario");

form.addEventListener("submit", async (event) => {
    event.preventDefault();

    let username = document.getElementById("InputUsername").value.trim();
    let password = document.getElementById("InputPassword").value.trim();

    if (!username || !password) {
        alert("Por favor, completa todos los campos.");
        return;
    }

    let userpassword = { username, password };
    
    try {
        let response = await fetch("http://localhost:5000/api/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(userpassword),
            credentials: "include"
        });

        let data;
        try {
            data = await response.json();
        } catch (jsonError) {
            throw new Error("Respuesta del servidor no válida.");
        }

        if (response.ok) {
            window.location.href = "/home.html";
        } else {
            alert("Error: " + (data.error || "Credenciales incorrectas."));
        }
        
    } catch (error) {
        alert("Error en la conexión con el servidor. Intenta nuevamente.");
        console.error("Error en la petición:", error);
    }
});

function cargarHome() {
    fetch("http://localhost:5000/api/login/home", {
        method: "GET",
        credentials: "include" 
    })
    .then(response => response.json())
    .then(data => {
        if (data.message === "Acceso permitido") {
            console.log('OK.')
        } else {
            window.location.href = "/api/login"; 
        }
    })
    .catch(error => {
        console.error("Error en cargarHome:", error);
        alert("Error al cargar la página de inicio.");
    });
}
