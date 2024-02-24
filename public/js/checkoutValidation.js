function validateUsername(){
    var fnameField = document.getElementById('name').value;
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

function validateAddress(){
    var address = document.getElementById('address').value;
    if(address.length==0){
        addressError.innerHTML="Address is required";
        return false;
    }

    if(!address.match(/^[A-Za-z\._\-0-9][A-Za-z]/)){
        addressError.innerHTML="invalid email";
        return false;
    }
    else{
        addressError.innerHTML='<i class="fa-solid fa-check"></i>';
        return true;
    }
}

function validatePhnumber(){
    var phNumber = document.getElementById('mobile').value;
    if(phNumber.length == 0){
        mobileError.innerHTML='Phone number is required';
        return false;
    }
    if(!phNumber.match(/^[1-9][0-9]{9}$/)){
        mobileError.innerHTML='Write valid phone number';
        return false;
    }
    mobileError.innerHTML='<i class="fa-solid fa-check"></i>';
    return true;
}

function validatePin(){
    var pin = document.getElementById('pincode').value;
    if(pin.length == 0){
        pinError.innerHTML='Pincode is required';
        return false;
    }
    if(!pin.match(/^[1-9][0-9]{5}$/)){
        pinError.innerHTML='Write valid pincode';
        return false;
    }
    pinError.innerHTML='<i class="fa-solid fa-check"></i>';
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

function validateCity(){
    var city = document.getElementById('city').value;
    if(city.length == 0){
        cityError.innerHTML='City is required';
        return false;
    }
    if(!city.match(/[A-Za-z]{1,}/)){
        cityError.innerHTML='Enter valid city';
        return false;
    }
    cityError.innerHTML='<i class="fa-solid fa-check"></i>';
    return true;
}

function validateLocality(){
    var locality = document.getElementById('locality').value;
    if(locality.length == 0){
        localityError.innerHTML='Locality is required';
        return false;
    }
    if(!locality.match(/[A-Za-z]{1,}/)){
        localityError.innerHTML='Enter valid locality';
        return false;
    }
    localityError.innerHTML='<i class="fa-solid fa-check"></i>';
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

function addAddress(event)
{
    console.log('validate form')

validateUsername()
validatePhnumber()
validateAddress()
validateCity()
validateCountry()
validatePin()
validateState()
validateLocality()

if(!validateUsername() ||  !validatePhnumber() ||!validateAddress() || !validateLocality() || !validateCity()
    || !validateCountry() || !validatePin() || !validateState()){
    event.preventDefault()
    console.log('prevent default')
var submitError = document.getElementById('submitError');
submitError.innerHTML="Please fix these error to submit ";
return false
}


}
// )