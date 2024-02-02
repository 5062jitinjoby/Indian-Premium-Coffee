function validateName(){
    var nameField = document.getElementById('name').value;
    if(nameField.length == 0){
        productError.innerHTML='Product name is required';
        return false;
    }
    if(!nameField.match(/^[A-Z][A-Za-z]/)){
        console.log("hi")
        productError.innerHTML='Write valid product';
        return false;
    }
    else{
        productError.innerHTML='';
        return true;
    }

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

function validatePrice(){
    var priceField = document.getElementById('price').value
    if(priceField <= 0){
        priceError.innerHTML = 'Price must be greater than 0';
        return false;
    }
    priceError.innerHTML='<i class="fa-solid fa-check"></i>';
    return true;
}

function validateQuantity(){
    var quantityField = document.getElementById('quantity').value
    if(quantityField <= 0){
        quantityError.innerHTML = 'Price must be greater than 0';
        return false;
    }
    quantityError.innerHTML='<i class="fa-solid fa-check"></i>';
    return true;
}

function validateCategory(){
    var categorySelect = document.getElementById('category')
    var selectedCategory = categorySelect.options[categorySelect.selectedIndex].value
    if(selectedCategory === 'select'){
        categoryError.innerHTML = 'Please select a category';
        return false
    }
    categoryError.innerHTML='<i class="fa-solid fa-check"></i>';
    return true;
}

function validateFlavour(){
    var flavourSelect = document.getElementById('flavour')
    var selectedFlavour = flavourSelect.options[flavourSelect.selectedIndex].value
    if(selectedFlavour === 'select'){
        flavourError.innerHTML = 'Please select a flavour';
        return false
    }
    flavourError.innerHTML='<i class="fa-solid fa-check"></i>';
    return true;
}

function validateImage(){
    var img = document.getElementById('imginput')
    let flag = true;
    if(img.files){
        for(let image of img.files){
            if(!image.type.startsWith('image/')){
                imageError.innerHTML = 'Insert a valid image'
                flag = false;
                break;
            }
            else{
                imageError.innerHTML = ''

                flag = true;
            }
        }
    }
    console.log(flag)
    return flag;
}


function validateForm(event){

    validateName()
    validateDescription()
    validatePrice() 
    validateQuantity()
    validateCategory()
    validateFlavour()
    validateImage()

    if(!validateName() || !validateDescription() || !validatePrice() || !validateQuantity() || !validateCategory() || !validateFlavour() || !validateImage()){
        event.preventDefault()
        var submitError = document.getElementById('submitError');
        submitError.innerHTML="Please fix these error to submit ";
        return false
    }

}