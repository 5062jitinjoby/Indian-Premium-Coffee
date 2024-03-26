function validateCoupon(){
    const coupon = document.getElementById('coupon').value;
    if(coupon.length==0){
        couponError.innerHTML = 'Coupon is required';
        return false;
    }
    if(!coupon.match(/^[A-Z0-9]{4,10}$|^[A-Z]{4,10}$/)){
        couponError.innerHTML = 'Coupon must satisfy with capital Letters or combination of letters and numbers';
        return false;
    }
    couponError.innerHTML='<i class="fa-solid fa-check"></i>';
    return true;
}

function validateMinPurchase(){
    var priceField = document.getElementById('price').value
    if(priceField <= 0){
        priceError.innerHTML = 'Price must be greater than 0';
        return false;
    }
    priceError.innerHTML='<i class="fa-solid fa-check"></i>';
    return true;
}
function validateDate() {
    const dateInput = document.getElementById('date');
    const dateError = document.getElementById('dateError');
    const dateString = dateInput.value;
    const isValid = dateString && isValidDate(dateString);
    dateError.textContent = isValid ? '' : 'Invalid date. Please use the format YYYY-MM-DD.';
    return isValid;
}

function isValidDate(dateString) {
    const dateObject = new Date(dateString);
    return !isNaN(dateObject.getTime());
}

function validateDiscount(){
    var priceField = parseInt(document.getElementById('price').value)
    const discountPrice = parseInt(document.getElementById('discountPrice').value)
    if(!validateMinPurchase()){
        discountError.innerHTML = 'Enter Minimum Purchase';
        return false;
    }
    if(!discountPrice){
        discountError.innerHTML = 'Enter discount';
        return false;
    }
    if(discountPrice>=priceField){
        discountError.innerHTML = 'DiscountPrice must be less than Minimum Purchase';
        return false;
    }
    discountError.innerHTML='<i class="fa-solid fa-check"></i>';
    return true;
}

function validateAddCoupon(event){
    console.log('prevent default')
    validateCoupon();
    validateMinPurchase();
    validateDate();
    validateDiscount();
    if(!validateCoupon()){
        console.log('Coupon failed')
    }
    if(!validateMinPurchase()){
        console.log('Minnimum purchase failed')
    }
    if(!validateDate()){
        console.log(validateDate())
    }
    if(!validateDiscount()){
        console.log('Discount failed')
    }

    if(!validateCoupon() || !validateMinPurchase() || !validateDate() || !validateDiscount()){
        console.log('prevent')
        event.preventDefault()
        var submitError = document.getElementById('submitError');
        submitError.innerHTML="Please fix these error to submit ";
        return false
    }
}
