function moveToCart(id){
    
    fetch(`/moveToCart?id=${id}`,{
        method: 'POST',
        headers:{
            'Content-Type':'application/json',
        }
    })
    .then(resonse=>{
        return resonse.json()
    }).then(data=>{
        console.log(data)
        window.location.reload()
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
        return resonse.json()
    }).then(data=>{
        console.log(data)
        window.location.reload()
    })
    .catch(error=>{
        console.log(error)
    })
}