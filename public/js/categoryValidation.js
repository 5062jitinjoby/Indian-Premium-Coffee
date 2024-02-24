function validateName(){
    var nameField = document.getElementById('name').value;
    if(nameField.length == 0){
        categoryError.innerHTML='Category name is required';
        return false;
    }
    if(!nameField.match(/^[A-Z][A-Za-z]/)){
        console.log("hi")
        categoryError.innerHTML='Write valid category';
        return false;
    }
        categoryError.innerHTML='<i class="fa-solid fa-check"></i>';
        return true;
}

function validateDescription(){
  
    var subjField = document.getElementById('description').value;
    
    var required =8;
    
    var left = required- subjField.length;
    
    if(left > 0){
        desError.innerHTML = left + 'more characters required';
        return false;
    }
        desError.innerHTML ='<i class="fa-solid fa-check"></i>';
        return true;
}

function validateForm(event){
    validateName();
    validateDescription();

    if(!validateName() || !validateDescription()){
        event.preventDefault()
        var submitError = document.getElementById('submitError');
        submitError.innerHTML="Please fix these error to submit ";
        return false
    }
}