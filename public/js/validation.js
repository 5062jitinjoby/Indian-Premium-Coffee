 
 console.log("validatin page loading");
 
 function validateUsername(){
    var fnameField = document.getElementById('username').value;
    if(fnameField.length == 0){
        usernameError.innerHTML='Name is required';
        return false;
    }
    if(!fnameField.match(/^[A-Z][A-Za-z]/)){
        console.log("hi")
        usernameError.innerHTML='Write valid name';
        return false;
    }
    usernameError.innerHTML='<i class="fa-solid fa-check"></i>';
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
        phNumberError.innerHTML='Phone number is required';
        return false;
    }
    if(!phNumber.match(/^[1-9][0-9]{9}$/)){
        phNumberError.innerHTML='Write valid phone number';
        return false;
    }
    phNumberError.innerHTML='<i class="fa-solid fa-check"></i>';
    return true;
}

// function validateCountry(){
//     var country = document.getElementById('country').value;
//     if(country.length == 0){
//         countryError.innerHTML='Country is required';
//         return false;
//     }
//     if(!country.match(/[A-Za-z]{1,}/)){
//         countryError.innerHTML='Enter a valid country';
//         return false;
//     }
//     countryError.innerHTML='<i class="fa-solid fa-check"></i>';
//     return true;
// }

// function validateState(){
//     var state = document.getElementById('state').value;
//     if(state.length == 0){
//         stateError.innerHTML='State is required';
//         return false;
//     }
//     if(!state.match(/[A-Za-z]{1,}/)){
//         stateError.innerHTML='Enter valid State';
//         return false;
//     }
//     stateError.innerHTML='<i class="fa-solid fa-check"></i>';
//     return true;
// }

function validateForm(event)
{
    console.log('validate form')

console.log(validateUserame(),validateEmail(),validatePhnumber())

if(!validateUserame() || !validateEmail() || !validatePhnumber()){
    event.preventDefault()
var submitError = document.getElementById('submitError');
submitError.innerHTML="Please fix these error to submit ";
return false
}


}
// )