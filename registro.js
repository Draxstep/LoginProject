const registerForm = document.getElementById("formularioRegistro");

registerForm.addEventListener("submit", (event) => {

    event.preventDefault();
    let name = document.getElementById("InputName").value;
    let email = document.getElementById("InputEmail").value;
    let password = document.getElementById("InputPassword").value;

    let user = {name:name, email:email, password:password}
    let userjson = JSON.stringify(user);

    fetch("http://localhost:5000/api/login/createuser", {

        method: "Post",
        headers: { "Content-Type": "application/json" },
        body: userjson

    }).then(response => {

        if (response.ok) {

            alert("Usuario creado exitosamente.") 
            window.location.href = "front.html";

        } else {

            return response.text().then(text => {
                alert("Error: " + text);

            });
        }
    })
    
})