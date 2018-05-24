var i = 0;
var nameTxt = 'Shaural Patel';
var speed = 100;

window.onload = function() {
    writeName();
  };

function writeName() {
  if (i < nameTxt.length) {
    document.getElementById("name").innerHTML += nameTxt.charAt(i);
    i++;
    setTimeout(writeName, speed);
  }
}