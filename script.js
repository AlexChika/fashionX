const root = select(":root") || document.documentElement;
const float = select("#float");
const floatBtn = select("#float-btn");
const nav = select("nav");
const floatBdy = document.querySelectorAll(".flt-bdy");
const floatHdr = document.querySelectorAll(".fl-hdr");
const hm_crsEl = Array.from(document.querySelectorAll("#hm-crs a"));
const heroTxt = select(".hero-text");

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
    root.style.setProperty("--nav-color", "white");
  } else {
    nav.classList.remove("static");
    root.style.setProperty("--nav-color", "red");
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
  }, 4000);
}
scroll();
//   hero
const heroText = ["Fashion", "Gadgets", "Ladies-wear", "Mens-wear", "Sneakers"];
function setHeroText() {
  let i = 0;
  return setInterval(() => {
    heroTxt.textContent = heroText[i];
    if (++i >= heroText.length) i = 0;
  }, 3000);
}
setHeroText();
//  end of hero

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
function showFloat(e) {
  float.classList.toggle("show");
}
document.body.addEventListener("dragover", drag_over);
document.body.addEventListener("drop", drop);
floatBtn.addEventListener("click", showFloat);
float.addEventListener("dragstart", drag_start);
floatHdr.forEach((el) => {
  el.addEventListener("click", (e) => {
    floatHdr.forEach((x) => {
      if (x !== el) {
        x.parentElement.classList.remove("show");
      }
    });
    el.parentElement.classList.toggle("show");
  });
});
// to be used codes
/*
  console.log(event.target);
  let styles = window.getComputedStyle(event.target);
  const a = styles.getPropertyValue("left");
  const b = styles.getPropertyValue("top");
  // const rect = card.getBoundingClientRect();

*/
