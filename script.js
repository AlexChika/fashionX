// Contentful
const client = contentful.createClient({
  space: "k5kf38wdw7lp",
  accessToken: "hfclGpUy7kXA7ZLbmDj0DALyfWNExkz7aR3-HwUZpDA",
});
// DOM
const root = select(":root") || document.documentElement;
const nav = select("nav");
const navBtns = document.querySelectorAll(".navbtn");
const float = select("#float");
const floatBtn = select("#float-btn");
const floatHdr = document.querySelectorAll(".fl-hdr");
const headers = Array.from(document.querySelectorAll(".section > .hdng"));
const sectionBody = document.querySelectorAll(".sec-bdy");
const cartBody = select(".crt-bdy");
const itmState = document.querySelectorAll(".stats");
const crtState = select("#crt-status");
// const subTotal = select("#sub-total");
// const remove = select("#crt-rm");
// const add = select("#crt-add");
// const itmNum = select("#crt-amt");
const crtNum = select("#cart-no");
// const min = select("#crt-min");
const total = select("#crt-total");
const clearCrt = select("#clr-crt");
const hm_crsEl = Array.from(document.querySelectorAll("#hm-crs a"));
const heroTxt = select(".hero-text");
let crsEl = 0;

// ...............    utils   .........
// gets dom elements
function select(x) {
  const el = document.querySelector(x);
  if (el) {
    return el;
  } else {
    throw new Error(`${x} not found`);
  }
}
// query a specific element
function getEl(x, y) {
  const el = x.querySelector(y);
  if (el) {
    return el;
  }
}
// filters and returnsan array
function filter(arr, filter) {
  const array = arr.filter((data) => {
    if (data.category === filter) {
      return data;
    }
  });
  return array;
}
class Products {
  async getProducts() {
    try {
      const datas = await client.getEntries({
        content_type: "fashionHouseProducts",
      });
      let products = datas.items;
      products = products.map((item) => {
        const { category, desc, name, price } = item.fields;
        const img = item.fields.img.fields.file.url;
        const id = item.sys.id;
        return { category, desc, name, price, img, id };
      });
      return products;
    } catch (error) {
      console.log(error);
    }
  }
}
class UpdateDom {
  render(products, element) {
    const domproducts = products
      .map((data) => {
        const { desc, id, img, name, price } = data;
        return `
      <article class="itm f-align">
          <div class="itm-img">
            <img class="f-wh" src="${img}" alt="${name}" />
          </div>
          <div class="itm-desc">
            <p class="itm-name">${name}</p>
            <p class="itm-dtls">${desc.substr(0, 55)}...</p>
            <p class="itm-prc">
              <span><i class="bi bi-currency-dollar"></i></span>${price}
            </p>
          </div>
          <div data-id="${id}" data-stat="out" class="tray">
            <span class="stats">add to cart</span>
            <i class="bi bi-cart-check-fill"></i>
            <i class="bi bi-cart-plus"></i>
          </div>
        </article>
      `;
      })
      .join("");

    element.innerHTML = domproducts;
    element.style.display = "grid";
    element.parentElement.querySelector(".loader-con").style.display = "none";
  }
  getBtns() {
    document.querySelectorAll(".tray").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        if (e.currentTarget.dataset.stat !== "in") {
          const name = getEl(btn.parentElement, ".itm-name").textContent;
          const desc = getEl(btn.parentElement, ".itm-dtls").textContent;
          const img = getEl(btn.parentElement, "img").getAttribute("src");
          const id = e.currentTarget.dataset.id;
          const price = getEl(btn.parentElement, ".itm-prc").textContent;
          const amt = 1;
          const subtotal = "";
          const item = { name, img, id, price, amt, desc, subtotal };
          Storage.setCartItems(item);
          this.cartRender(Storage.getCart());
          this.cartValues();
          e.currentTarget.classList.add("added");
          e.currentTarget.dataset.stat = "in";
          select("#cart-con").classList.add("close");
          e.currentTarget.querySelector(".stats").textContent = "In Cart";
        }
      });
    });
  }
  cartRender(products) {
    const domproducts = products
      .map((data) => {
        const { amt, id, img, name, price, desc, subtotal } = data;
        return `
      <article data-id="${id}">
          <div class="crt-item-con">
            <div class="crt-img">
              <img class="f-wh" src="${img}" alt="${name}" />
            </div>
            <div class="crt-dtls">
              <p class="crt-item-desc">${name}</p>
              <p class="crt-item-desc">${desc}</p>
              <p>
                Sub-Total:<i class="bi bi-currency-dollar"></i
                ><span id="price">${price}</span>
              </p>
              <p>
                Sub-Total:<i class="bi bi-currency-dollar"></i
                ><span id="sub-total">${subtotal}</span>
              </p>
            </div>
          </div>
          <div class="crt-math">
            <span id="crt-rm"> Remove<i class="bi bi-trash"></i> </span>
            <div>
              <span id="crt-add">
                <i class="bi bi-plus-circle"></i>
              </span>
              <span id="crt-amt" class="cr">${amt}</span>
              <span id="crt-min">
                <i class="bi bi-dash-circle"></i>
              </span>
            </div>
          </div>
        </article>
      `;
      })
      .join("");
    cartBody.innerHTML = domproducts;
    const plusBtn = document.querySelectorAll("#crt-add");
    const minBtn = document.querySelectorAll("#crt-min");
    plusBtn.forEach((btn) => {
      btn.addEventListener("click", () => {
        console.log("I was increased");
        const amt = getEl(
          btn.parentElement.parentElement.parentElement,
          "#crt-amt"
        );
        const priceEl = getEl(
          btn.parentElement.parentElement.parentElement,
          "#price"
        );
        const sub = getEl(
          btn.parentElement.parentElement.parentElement,
          "#sub-total"
        );
        let newSubTotal = 0;
        let amount = parseInt(amt.textContent);
        let price = parseInt(priceEl.textContent);
        newSubTotal += price;
        amt.textContent = amount++;
        sub.textContent = newSubTotal;
        this.cartValues();
      });
    });
    // minBtn.forEach((btn) => {
    //   btn.addEventListener("click", () => {
    //     console.log("I was decreased");
    //     const ambtn = getEl(btn.parentElement, "#crt-amt");
    //     // let sum =
    //   });
    // });
  }
  cartValues() {
    let cart = Storage.getCart();
    let sum = 0;
    let subTotal = 0;
    cart.forEach((item) => {
      sum += parseInt(item.price);
    });
    cart.forEach((item) => {
      subTotal += parseInt(item.amt);
    });
    crtState.textContent = `${subTotal} Items In Cart`;
    crtNum.textContent = subTotal;
    total.textContent = sum;
  }
  increment(btn) {
    this.cartValues();
  }
  decrement(btn) {}
  remove() {
    console.log("I removed someone");
  }
}
class Storage {
  static setCartItems(obj) {
    let cart;
    if (localStorage.getItem("cart")) {
      cart = JSON.parse(localStorage.getItem("cart"));
    } else {
      cart = [];
    }
    cart.push(obj);
    localStorage.setItem("cart", JSON.stringify(cart));
  }
  static getCart() {
    const array = JSON.parse(localStorage.getItem("cart"));
    return array;
  }
}
window.addEventListener("DOMContentLoaded", () => {
  const products = new Products();
  const updateDom = new UpdateDom();

  products
    .getProducts()
    .then((products) => {
      sectionBody.forEach((section) => {
        updateDom.render(filter(products, section.dataset.id), section);
      });
    })
    .then(() => {
      console.log("third layer");
      updateDom.getBtns();
    })
    .catch((error) => {
      // window.location.reload();
    });
});
// Nav and cart buttons
window.addEventListener("scroll", (x) => {
  const navHeight = nav.getBoundingClientRect().height;
  if (window.scrollY >= navHeight) {
    nav.classList.add("static");
    root.style.setProperty("--nav-color", "white");
  } else {
    nav.classList.remove("static");
    root.style.setProperty("--nav-color", "rgb(253, 175, 120)");
  }
});
[select("#cart-btn"), select("#crt-close"), select("#flt-crtBtn")].forEach(
  (btn) => {
    btn.addEventListener("click", () => {
      select("#cart-con").classList.toggle("close");
    });
  }
);
select(".nav-menu").addEventListener("click", (e) => {
  float.style.left = e.currentTarget.offsetLeft + "px";
  float.style.top = e.currentTarget.offsetTop + "px";
});
// Home Carousel
hm_crsEl.forEach((a, index) => {
  a.style.left = `${index * 100}%`;
});
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
//   hero text
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
// Navigation buttons
navBtns.forEach((btn) => {
  btn.addEventListener("click", function (e) {
    e.preventDefault();
    const href = this.getAttribute("href");
    const y = select(href)
      ? select(href).offsetTop - nav.getBoundingClientRect().height
      : this.offsetTop;
    window.scrollTo({
      left: 0,
      top: y,
    });
  });
});
// fade in and out
const options = {
  threshold: 1,
};
const fadeIn = new IntersectionObserver((entries, fadeIn) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add("fadein");
    fadeIn.unobserve(entry.target);
  });
}, options);
headers.forEach((heading) => {
  fadeIn.observe(heading);
});
// to be used codes
/*
  console.log(event.target);
  let styles = window.getComputedStyle(event.target);
  const a = styles.getPropertyValue("left");
  const b = styles.getPropertyValue("top");
  // const rect = card.getBoundingClientRect();
    console.log("stop hitting me");


*/
