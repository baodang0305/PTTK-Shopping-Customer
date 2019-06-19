var numberStarClicked = 0
for(let i = 1; i <= 5 ; i++) {
  document.getElementById("star" + i).addEventListener("mouseover", function(){
    for(let j = i; j >= 1; j--) {
      if (document.getElementById("star" + j).classList.contains('fa-star-o')) {
        document.getElementById("star" + j).classList.remove('fa-star-o');
        document.getElementById("star" + j).classList.add('fa-star');
      }
    }
  });
  document.getElementById("star" + i).addEventListener("mouseout", function() {
    for(let j = i; j >= 1; j--) {
      if (document.getElementById("star" + j).classList.contains('fa-star')) {
        document.getElementById("star" + j).classList.remove('fa-star');
        document.getElementById("star" + j).classList.add('fa-star-o');
      }
    }
  });
  document.getElementById("star" + i).addEventListener("click", function() {
    console.log("of fine")
    document.getElementById("starResult").value = i;
    for(let j = i; j >= 1; j--) {
      document.getElementById("star" + j).style.color = "#ff5300";
    }
    for(let j = i + 1;j <= 5; j++ ) {
      document.getElementById("star" + j).style.color = "#070707";
    }
  });
}
