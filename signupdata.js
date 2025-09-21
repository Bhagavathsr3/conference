let userdetails=[]
function signup(){
let username=document.getElementById('username').value;
let emailid=document.getElementById('email').value;
let password = document.getElementById('password').value;


let payload={
    'username':username,
    'email': emailid,
    'password': password
}
userdetails.push(payload);
console.log(payload);
console.log(userdetails);

document.getElementById('username').innerHTML='';
}
function login(event) {
    event.preventDefault(); // stop refresh

    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value.trim();

    if (email === "" || password === "") {
        alert("Please enter email and password!");
        return false;
    }

    // ✅ Always redirect since it's demo
    window.location.href = "index.html";
    return true;
}
