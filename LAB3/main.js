document.getElementById("priceRange").oninput = function () {
  document.getElementById("priceOutput").value = Math.round(
    Math.exp(document.getElementById("priceRange").value)
  );
};
let currentProduct;
let toAdd;
let originalProducts;
let products;
let amountOfCurrentProducts = 0;
let startAmount = 8;
let loadAmount = 4;
let maxProducts;
let rightColumn = document.getElementsByClassName("right_body")[0];
let indexWrapper = document.getElementsByClassName("index__wrapper")[0];
let searchButton = document.getElementById("searchButton");
let protocolTypeArr = [];
let category = document.getElementById("category");

console.log(searchButton);
searchButton.onclick = searchFilter;
fetch("product.json")
  .then(function (response) {
    return response.json();
  })
  .then(function (json) {
    products = json;
    originalProducts = products;
    maxProducts = products.length;
    // initialize(products);
    console.log(products.length);
    toAdd = products.slice(0, startAmount);
    console.log(currentProduct);
    loadProduct();
    amountOfCurrentProducts = 8;
  })
  .then(() => {
    originalProducts.forEach((p) => {
      if (!protocolTypeArr.includes(p.protocol))
        protocolTypeArr.push(p.protocol);
    });
    protocolTypeArr.forEach((e) => {
      let aCategory = document.createElement("option");
      aCategory.innerHTML = e;
      category.appendChild(aCategory);
    });
  })
  .catch(function (err) {
    console.log("Fetch problem: " + err.message);
  });

indexWrapper.onscroll = () => {
  //   console.log("height :" + indexWrapper.scrollHeight);
  //   console.log("scroll : " + (indexWrapper.scrollTop + window.innerHeight));
  //   console.log("window height " + window.innerHeight);
  if (
    indexWrapper.scrollTop + window.innerHeight >=
    indexWrapper.scrollHeight * 0.98
  ) {
    console.log(amountOfCurrentProducts);
    if (maxProducts - amountOfCurrentProducts >= 4) {
      toAdd = products.slice(
        amountOfCurrentProducts,
        amountOfCurrentProducts + loadAmount
      );
      amountOfCurrentProducts += loadAmount;
    } else {
      toAdd = products.slice(amountOfCurrentProducts, maxProducts);
      amountOfCurrentProducts = maxProducts;
    }
    loadProduct();
  }
};
function loadProduct() {
  toAdd.forEach((element, index) => {
    let coinDiv = document.createElement("div");
    coinDiv.setAttribute("class", "coin_block");
    let coinCode = document.createElement("div");
    coinCode.innerHTML = element.code;
    coinCode.className = "code";
    let coinImg = document.createElement("img");
    coinImg.setAttribute("src", "coin_image/" + element.code + ".png");
    coinImg.setAttribute("class", "coin_img");

    let coinDescription = document.createElement("div");
    coinDescription.setAttribute("class", "description");
    coinDescription.innerHTML = element.description;
    let coinPrice = document.createElement("div");
    coinPrice.setAttribute("class", "price");
    coinPrice.innerHTML = element.currentKRW + "KRW";
    let coinProtocol = document.createElement("div");
    let moreClicked = false;

    coinProtocol.setAttribute("class", "protocol");
    coinProtocol.innerHTML = "protocol : " + element.protocol;
    coinDiv.appendChild(coinCode);
    coinDiv.appendChild(coinImg);
    let moreButton = document.createElement("button");
    coinDiv.appendChild(moreButton);

    moreButton.innerHTML = "more";
    moreButton.onclick = function () {
      console.log("button clicked");
      if (!moreClicked) {
        coinDiv.appendChild(coinPrice);
        coinDiv.appendChild(coinDescription);
        coinDiv.appendChild(coinProtocol);
        moreClicked = true;
      } else {
        coinPrice.remove();
        coinDescription.remove();
        coinProtocol.remove();
        moreClicked = false;
      }
    };

    rightColumn.appendChild(coinDiv);
  });
}

function searchFilter() {
  products = [];

  rightColumn.innerHTML = "";
  let searchKeyWord = document.getElementById("searchTerm").value;
  let protocolType = document.getElementById("category").value;
  let priceMax = parseInt(document.getElementById("priceOutput").value, 10);
  console.log("key : " + searchKeyWord);
  console.log("protocol : " + protocolType);
  console.log("priceMax : " + priceMax);
  originalProducts.forEach((p) => {
    let productPrice = parseInt(p.currentKRW, 10);
    console.log(p.code);
    console.log(
      "keyword" + p.name.includes(searchKeyWord) ||
        p.code.includes(searchKeyWord) ||
        searchKeyWord == ""
    );
    console.log(productPrice <= priceMax);
    console.log("product price :" + productPrice + ", max : " + priceMax);
    console.log("protocol "+(protocolType == "All" || protocolType == p.protocol));

    if (
      (p.name.includes(searchKeyWord) ||
        p.code.includes(searchKeyWord.toUpperCase()) ||
        searchKeyWord == "") &&
      productPrice <= priceMax
    ) {
      if (protocolType == "All" || protocolType == p.protocol) {
        products.push(p);
      }
    }
  });
  console.log(products);
  toAdd = products.slice(0, startAmount);
  loadProduct();
  amountOfCurrentProducts = 8;
}
