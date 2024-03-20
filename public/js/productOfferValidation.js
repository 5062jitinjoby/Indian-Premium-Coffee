function validateOffer(){
    var offerField = document.getElementById('offer').value
    if(offerField <= 0 || offerField>=100){
        offerError.innerHTML = 'Offer % must be greater than 0 & less than 100';
        return false;
    }
    offerError.innerHTML='<i class="fa-solid fa-check"></i>';
    return true;
}
function validate_Product_Offer(event){
    validateOffer()
    if(!validateOffer()){
        event.preventDefault()
        var submitError = document.getElementById('submitError');
        submitError.innerHTML="Please fix these error to submit ";
        return false
    }
}