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

function validateOffer(){
    var offerField = document.getElementById('offer').value
    if(offerField <= 0 || offerField>=100){
        offerError.innerHTML = 'Offer % must be greater than 0 & less than 100';
        return false;
    }
    offerError.innerHTML='<i class="fa-solid fa-check"></i>';
    return true;
}

function validateCategory_Offer(event){
    validateCategory()
    validateOffer();

    if(!validateCategory() || !validateOffer()){
        event.preventDefault()
        var submitError = document.getElementById('submitError');
        submitError.innerHTML="Please fix these error to submit ";
        return false
    }
}

function validate_Edit_Offer(event){
    validateOffer();
    if(!validateOffer()){
        event.preventDefault()
        var submitError = document.getElementById('submitError');
        submitError.innerHTML="Please fix these error to submit ";
        return false
    }
}