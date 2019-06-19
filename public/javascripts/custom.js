function checkforblank(){
    if(document.getElementById('Quantity').value==""){
        alert('Please enter your quantity');
        document.getElementById('Quantity').style.borderColor='red';
        return false;
    }
}