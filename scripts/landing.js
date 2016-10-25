var pointsArray = document.getElementsByClassName('point'); //getElementsByClassName - point class

var revealAllPoints = function(point){ //sets opacity, transform. Takes in point argument to point out which point is it changing its opacity and gets transformed
    point.style.opacity = 1;
    point.style.transform = "scaleX(1) translateY(0)";
    point.style.msTransform="scaleX(1) translateY(0)";
    point.style.WebkitTransform = "scaleX(1) translateY(0)";
};

var animatePoints = function(){ //animatePoints function
  var revealPoint = function() { //defines revealPoint(); takes self (this) and updates its CSS and transformation values.
    $(this).css({
      opacity: 1,
      transform: 'scaleX(1) translateY(0)'
    });
  };
  $.each($('.point'), revealPoint); //look for point class, applies revealPoint() function to each of them
};
//In short, animatePoints() will look for each '.point' in the array and apply revealPoint to each element

$(window).load(function(event){ // originally window.onload = function(); window is the object (entire); $(window). onload = function() becomes .load(function)
  if ($(window).height() > 950){ //if height of window is > 950px, applies animatePoints rightaway!
    animatePoints();
  }

  var scrollDistance = $('.selling-points').offset().top - $(window).height() + 200;

  $(window).scroll(function(event){ //if scroll eventListener is active,
    if ($(window).scrollTop() >= scrollDistance){ //and if distance is such,
    animatePoints(); //runs this
  }// it essentially waits for user to be withing viewing distance of the transformation!
  });
});
