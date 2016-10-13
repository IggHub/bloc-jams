var pointsArray = document.getElementsByClassName('point');

var animatePoints = function(points){

  var revealAllPoints = function(){
    for(var i = 0; i < points.length; i++){
      points[i].style.opacity = 1;
      points[i].style.transform = "scaleX(1) translateY(0)";
      points[i].style.msTransform="scaleX(1) translateY(0)";
      points[i].style.WebkitTransform = "scaleX(1) translateY(0)";
    }
  };
  revealAllPoints();
};

window.onload = function(){

  if (window.innerHeight > 950){ //landing page is about 950px
    animatePoints(pointsArray);
  }
  var sellingPoints = document.getElementsByClassName('selling-points')[0];
  var scrollDistance = sellingPoints.getBoundingClientRect().top - window.innerHeight + 200;
  window.addEventListener('scroll', function(event){
    if (document.documentElement.scrollTop || document.body.scrollTop >= scrollDistance) {
      animatePoints(pointsArray);
    }
  });
}
