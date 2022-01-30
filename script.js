const float = select("#float");
const nav = select("nav");
const hm_crsEl = Array.from(document.querySelectorAll("#hm-crs a"));
let crsEl = 0;
// ...............    utils   .........
function select(x) {
  const el = document.querySelector(x);
  if (el) {
    return el;
  } else {
    throw new Error(`${x} not found`);
  }
}
// Nav and cart and side bar
window.addEventListener("scroll", (x) => {
  const navHeight = nav.getBoundingClientRect().height;
  if (window.scrollY >= navHeight) {
    nav.classList.add("static");
  } else {
    nav.classList.remove("static");
  }
});
// Home Carousel
function scroll() {
  if (window.scrollY <= nav.getBoundingClientRect().height) {
    hm_crsEl[crsEl].scrollIntoView({
      behavior: "smooth",
      block: "end",
      inline: "center",
    });
    crsEl++;
    if (crsEl === hm_crsEl.length) {
      crsEl = 0;
    }
  }
  setTimeout(() => {
    scroll();
  }, 3000);
}
scroll();
// Floating Icon
function drag_start(event) {
  let x = float.offsetLeft - event.clientX;
  let y = float.offsetTop - event.clientY;
  event.dataTransfer.setData("text/plain", `${x},${y}`);
}
function drag_over(event) {
  event.preventDefault();
  return false;
}
function drop(event) {
  event.preventDefault();
  const offset = event.dataTransfer.getData("text/plain").split(",");
  const [x, y] = offset;
  float.style.left = event.clientX + parseInt(x) + "px";
  float.style.top = event.clientY + parseInt(y) + "px";
  return false;
}
float.addEventListener("dragstart", drag_start);
document.body.addEventListener("dragover", drag_over);
document.body.addEventListener("drop", drop);

// to be used codes
/*
  console.log(event.target);
  let styles = window.getComputedStyle(event.target);
  const a = styles.getPropertyValue("left");
  const b = styles.getPropertyValue("top");
  // const rect = card.getBoundingClientRect();

*/
