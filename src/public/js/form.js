const form = document.getElementById("loginForm")

form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const data = new FormData(form)
    const obj = {}
    data.forEach((value, key) => obj[key] = value)


    const response = await fetch("login",{
        method: "POST",
        body: JSON.stringify(obj),
        headers: {
            "Content-Type": "application/json"
        }
    })

    const responseData = await response.json()

    if (response.ok) {
        localStorage.setItem("accessToken", responseData.accessToken);
        window.location.href = responseData.redirectUrl; // Redirige al usuario
    } else {
        const errorResponse = await response.json();
        console.error('Error:', errorResponse.message);
    }

    localStorage.setItem("accessToken", responseData.accessToken)
})