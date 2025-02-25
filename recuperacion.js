const form = document.getElementById("formularioRecuperacion");

form.addEventListener("submit", (event) => {

    event.preventDefault();

    let email = document.getElementById("InputEmail").value;

    let useremail = {email:email}
    let useremailjson = JSON.stringify(useremail);

    fetch("http://localhost:5000/api/recuperacion", {

        method: "Post",
        headers: { "Content-Type": "application/json" },
        body: useremailjson

    }).then(response => {

        if (response.ok) { 
            alert("Correo de recuperacion enviado exitosamente.")
            window.location.href = "front.html";

        } else {

            return response.text().then(text => {

                alert("Error: " + text);

            });
        }
    })
})
