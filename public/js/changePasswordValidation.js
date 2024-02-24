function validateCurrentPassword(){
    var currentPassword = document.getElementById('currentPassword').value;
    if(currentPassword.length == 0){
        currentPasswordError.innerHTML='Current Password is required';
        return false;
    }
    currentPasswordError.innerHTML='<i class="fa-solid fa-check"></i>';
    return true;
}
function validateNewPassword(){
    var newPassword = document.getElementById('newPassword').value;
    if(newPassword.length == 0){
        newPasswordError.innerHTML='Password is required';
        return false;
    }
    if(!password.match(/^(?=.*\d)(?=.*[a-z])(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)){
        newPasswordError.innerHTML='Write valid Password';
        return false;
    }
    newPasswordError.innerHTML='<i class="fa-solid fa-check"></i>';
    return true;
}
function validateConfirmNewPassword(){
    var confirmNewPassword = document.getElementById('confirmNewPassword').value;
    if(password.length == 0){
        confirmNewPasswordError.innerHTML='Password is required';
        return false;
    }
    if(!confirmNewPassword.match(/^(?=.*\d)(?=.*[a-z])(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)){
        confirmNewPasswordError.innerHTML='Write valid Password';
        return false;
    }
    confirmNewPasswordError.innerHTML='<i class="fa-solid fa-check"></i>';
    return true;
}

function validateChangePassword(event){
    validateCurrentPassword();
    validateNewPassword();
    validateConfirmNewPassword();
    If(!validateCurrentPassword() || !validateCurrentPassword() || !validateConfirmNewPassword())
    {
        event.preventDefault()
    }
}