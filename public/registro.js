const registerForm = document.getElementById("formularioRegistro");

registerForm.addEventListener("submit", (event) => {

    event.preventDefault();
    let name = document.getElementById("InputName").value;
    let email = document.getElementById("InputEmail").value;
    let password = document.getElementById("InputPassword").value;

    let user = {name:name, email:email, password:password}
    let userjson = JSON.stringify(user);

    fetch("/api/login/createuser", {

        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: userjson

    }).then(response => {

        if (response.ok) {

            alert("Usuario creado exitosamente.") 
            window.location.href = "/api/login";

        } else {

            return response.text().then(text => {
                alert("Error: " + text);

            });
        }
    })
    
})