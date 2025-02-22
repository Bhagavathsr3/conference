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