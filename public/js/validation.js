 
 console.log("validatin page loading");
 
 function validateFName(){
    console.log("hi")
    var fnameField = document.getElementById('firstName').value;
    console.log(fnameField)
    if(fnameField.length == 0){
        fnameError.innerHTML='First Name is required';
        return false;
    }
    if(!fnameField.test(/^[A-Za-z]+$/)){
        console.log("hi")
        fnameError.innerHTML='Write valid name';
        return false;
    }
    fnameError.innerHTML='<i class="fa-solid fa-check"></i>';
    console.log("hi")
    return true;
}

function validateLName(){
    var lnameField = document.getElementById('lastName').value;
    if(lnameField.length == 0){
        lnameError.innerHTML='Last Name is required';
        return false;
    }

    if(!lnameField.match(/^[A-Z][a-z]+$/)){
        lnameError.innerHTML='Write vaild name';
        return false;
    }
    lnameError.innerHTML='<i class="fa-solid fa-check"></i>';
    return true;
}


function validateEmail(){
    var emailField = document.getElementById('email').value;
    if(emailField.length==0){
        emailError.innerHTML="Email is required";
        return false;
    }

    if(!emailField.match(/^[A-Za-z\._\-0-9]*[@][A-Za-z]*[\.][a-z]{2,4}$/)){
        emailError.innerHTML="invalid email";
        return false;
    }
    else{
        emailError.innerHTML='<i class="fa-solid fa-check"></i>';
        return true;
    }
}

function validatePhnumber(){
    var phNumber = document.getElementById('phoneNumber').value;
    if(phNumber.length == 0){
        phnumberError.innerHTML='Phone number is required';
        return false;
    }
    if(!phNumber.match(/^[1-9][0-9]{9}$/)){
        phNumberError.innerHTML='Write valid phone number';
        return false;
    }
    phNumberError.innerHTML='<i class="fa-solid fa-check"></i>';
    return true;
}

function validateCountry(){
    var country = document.getElementById('country').value;
    if(country.length == 0){
        countryError.innerHTML='Country is required';
        return false;
    }
    if(!country.match(/[A-Za-z]{1,}/)){
        countryError.innerHTML='Enter a valid country';
        return false;
    }
    countryError.innerHTML='<i class="fa-solid fa-check"></i>';
    return true;
}

function validateState(){
    var state = document.getElementById('state').value;
    if(state.length == 0){
        stateError.innerHTML='State is required';
        return false;
    }
    if(!state.match(/[A-Za-z]{1,}/)){
        stateError.innerHTML='Enter valid State';
        return false;
    }
    stateError.innerHTML='<i class="fa-solid fa-check"></i>';
    return true;
}

// function validatePin(){
//     var pin = document.getElementById('pincode').value;
//     console.log(pin)
//     if(pin.length == 0){
//         pinError.innerHTML='Pincode is required';
//         return false;
//     }
//     if(!pin.match(/[0-9]{6}$/)){
//         pinError.innerHTML='Enter a valid pincode';
//         return false;
//     }
//     pinError.innerHTML='<i class="fa-solid fa-check"></i>';
//     return true;
// }

// getotp = ()=>{
//     const email = document.getElementById('email').value;
//     console.log(email)
// }