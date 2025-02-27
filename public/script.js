const form = document.getElementById("formulario");

form.addEventListener("submit", (event) => {

    event.preventDefault();

    let username = document.getElementById("InputUsername").value;
    let password = document.getElementById("InputPassword").value;

    let userpassword = {username:username, password:password}
    let userpasswordjson = JSON.stringify(userpassword);

    fetch("http://localhost:5000/api/login", {

        method: "Post",
        headers: { "Content-Type": "application/json" },
        body: userpasswordjson,
        credentials: "include"

    }).then(response => response.json())
    .then(data => {
        if(data.token){
            window.location.href = "/home.html"
            cargarHome();
        } else {
            alert("Error: " + data.message);
        }
    })
})

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
    .catch(error => console.error("Error:", error));
}
