function validateOffer(){
    var offerField = document.getElementById('offer').value
    if(offerField <= 0 || offerField>=100){
        offerError.innerHTML = 'Offer % must be greater than 0 & less than 100';
        return false;
    }
    offerError.innerHTML='<i class="fa-solid fa-check"></i>';
    return true;
}