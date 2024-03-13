const imageError = document.getElementById('imageError')
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
        quantityError.innerHTML = 'Quantity must be greater than 0';
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

function previewImages(input) {
    validateImage()
    var previewContainer = document.getElementById("imagePreviewContainer");
    previewContainer.innerHTML = ""; // Clear previous previews

    var files = input.files;

    for (var i = 0; i < files.length; i++) {
        var reader = new FileReader();
        reader.onload = function (e) {
            var imageContainer = document.createElement("div");
            imageContainer.classList.add("image-preview");

            var image = document.createElement("img");
            image.src = e.target.result;
            image.classList.add("preview-image");
            imageContainer.appendChild(image);

            var closeButton = document.createElement("button");
            closeButton.innerHTML = "&times;";
            closeButton.classList.add("close-button");
            closeButton.onclick = function () {
                // Remove the corresponding image preview on close button click
                previewContainer.removeChild(imageContainer);
            };

            imageContainer.appendChild(closeButton);
            previewContainer.appendChild(imageContainer);
        };

        reader.readAsDataURL(files[i]);

    }
}

function validateImage(){
    var img = document.getElementById('imginput')
    let flag = true;
    if(img.files.length > 0){
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
    else{
        imageError.innerHTML = 'Insert an image'
        flag = false;
    }
    console.log(flag)
    return flag;
}

// function loadMain(event,preview1)
// {   

//     if(preview1.hasChildNodes())
//     {
//         while(preview1.firstChild)
//         {
//             preview1.removeChild(preview1.firstChild)
//         }
//     }
//     const files = event.target.files
//     console.log(files)
    
//     if(files && files[0])
//     {
//         const reader = new FileReader()

//         reader.onload = function (e)
//         {
  
//             mainpre = document.createElement('img')
//             mainpre.style.aspectRatio = '1/1'
//             mainpre.style.width = "200px"
//             mainpre.style.height = "200px"
//             mainpre.id = 'previewmain'
//             mainpre.src = e.target.result
//             preview1.appendChild(mainpre)
//         }

//         reader.readAsDataURL(files[0])
//     }
// }


function validateForm(event){
    validateName()
    validateDescription()
    validatePrice() 
    validateQuantity()
    validateCategory()
    validateFlavour()
    validateImage()
    

    if(!validateName() || !validateDescription() || !validatePrice() || !validateQuantity() || !validateCategory() || !validateFlavour()){
        console.log('product validation')
        event.preventDefault()
        var submitError = document.getElementById('submitError');
        submitError.innerHTML="Please fix these error to submit ";
        return false
    }

}