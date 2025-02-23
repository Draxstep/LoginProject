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
        body: userpasswordjson

    }).then(response => {

        if (response.ok) { 

            window.location.href = "home.html";

        } else {

            return response.text().then(text => {

                alert("Error: " + text);

            });
        }
    })
})
