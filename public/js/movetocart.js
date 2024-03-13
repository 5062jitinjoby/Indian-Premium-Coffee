function moveToCart(id){
    
    fetch(`/moveToCart?id=${id}`,{
        method: 'POST',
        headers:{
            'Content-Type':'application/json',
        }
    })
    .then(resonse=>{
        console.log(resonse)
    })
    .catch(error=>{
        console.log(error)
    })
}

function remove(id){
    
    fetch(`/removeFromWishlist?id=${id}`,{
        method: 'POST',
        headers:{
            'Content-Type':'application/json',
        }
    })
    .then(resonse=>{
        console.log(resonse)
    })
    .catch(error=>{
        console.log(error)
    })
}