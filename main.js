var cart = [];
var totalItems = 0, totalUnits = 0, totalAmount = 0;
var objectCount = 0;
var addToCartForm = document.querySelector('#add-to-cart');
var emptyCartButton = document.querySelector('#empty-cart');

window.onload = function() {
  cart = JSON.parse(localStorage.getItem("cart") || "[]");

  if(cart.length !== 0) {
    for(var i=0; i<cart.length; i++) {
      cart[i].getAmount = getAmount;
      appendItem(cart[i]);
    }
  }
};

emptyCartButton.addEventListener('click', function(){
  cart = [];
  localStorage.removeItem('cart');
  updatePageTotal();
  document.querySelector('.all-items').innerHTML = '';
});

addToCartForm.addEventListener('submit', function() {
  var itemName = this['item-name'].value;
  var itemCount = this['item-count'].value;
  var itemPrice = this['item-price'].value;
  
  var currentItem = {
    name: itemName,
    count: itemCount,
    price: itemPrice,
    getAmount: function () {
      return (this.count * this.price).toFixed(2);
    }
  };
  
  cart.push(currentItem);
  storeToLocal(cart);
  appendItem(currentItem);
  updateTotal(currentItem);

  this['item-name'].value = '';
  this['item-name'].focus();
  this['item-count'].value = '';
  this['item-price'].value = '';
});

// FUNCTIONS
function getAmount() {
  return (this.count * this.price).toFixed(2);
}

function storeToLocal(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function updateTotal(item) {
  var totalItemsContainer = document.querySelector('#totalItems');
  var totalUnitsContainer = document.querySelector('#totalUnits');
  var totalAmountContainer = document.querySelector('#totalAmount');

  totalItems++;
  totalUnits += Number(item.count);
  totalAmount += Number(item.getAmount());

  totalItemsContainer.innerHTML = totalItems;
  totalUnitsContainer.innerHTML = totalUnits;
  totalAmountContainer.innerHTML = totalAmount.toFixed(2);
}

function editItem() {
  var itemIndex = this.dataset.index;
  var modal = document.querySelector('.modal');
  var editCartForm = document.querySelector('#edit-cart');
  document.querySelector('.container').style.opacity = 0.3;

  modal.style.display = 'block';

  setTimeout(function(){
    editCartForm.classList.add('show');
  }, 1);

  var itemToEdit = cart[itemIndex];
  
  editCartForm['item-name'].value = itemToEdit.name;
  editCartForm['item-count'].value = itemToEdit.count;
  editCartForm['item-price'].value = itemToEdit.price;
  editCartForm['item-index'].value = itemIndex;

  editCartForm.addEventListener('submit', updateCart);

  storeToLocal(cart);
}

function updateCart() {
  var itemIndex = this['item-index'].value;
  var itemName = this['item-name'].value;
  var itemCount = this['item-count'].value;
  var itemPrice = this['item-price'].value;

  var currentItem = cart[itemIndex];

  currentItem.name = itemName;
  currentItem.count = itemCount;
  currentItem.price = itemPrice;

  updatePageContent(itemIndex, currentItem);
  updatePageTotal();
  storeToLocal(cart);
}

function updatePageTotal() {
  var totalItemsContainer = document.querySelector('#totalItems');
  var totalUnitsContainer = document.querySelector('#totalUnits');
  var totalAmountContainer = document.querySelector('#totalAmount');

  totalItems = 0;
  totalUnits = 0;
  totalAmount = 0;

  for(var i=0; i<cart.length; i++) {

    if (Number(cart[i].count) !== 0) {
      totalItems++;
    }

    totalUnits += Number(cart[i].count);

    totalAmount += Number(cart[i].getAmount());

  }

  totalItemsContainer.innerHTML = totalItems;
  totalUnitsContainer.innerHTML = totalUnits;
  totalAmountContainer.innerHTML = totalAmount.toFixed(2);
}

function updatePageContent(index, item) {
  var needed = '[data-itemindex=\''+index+'\']';
  var itemContainer = document.querySelector(needed);

  var heading = itemContainer.querySelector('.title-name');
  heading.innerHTML = item.name;

  var countContainer = itemContainer.querySelector('.count');
  countContainer.innerHTML = item.count;

  var priceContainer = itemContainer.querySelector('.unit');
  priceContainer.innerHTML = item.price;

  var totalContainer = itemContainer.querySelector('.total');
  totalContainer.innerHTML = Number(item.getAmount()).toFixed(2);

  document.querySelector('#edit-cart').classList.remove('show');

  setTimeout(function(){
    document.querySelector('.modal').style.display = 'none';
    document.querySelector('.container').style.opacity = 1;

    if(Number(item.count) === 0) {
      cart.splice(index, 1);
      itemContainer.remove();
      storeToLocal(cart);
    }

  }, 300);
}

function appendItem(item) {
  var container = document.querySelector('.all-items');

  var itemContainer = document.createElement('div');
  itemContainer.classList.add('item');
  itemContainer.dataset.itemindex = objectCount;

  var titleContainer = document.createElement('div');
  titleContainer.classList.add('title');
  
  var titleHeading = document.createElement('h2');
  var titleSpan = document.createElement('span');
  titleSpan.classList.add('title-name');
  titleSpan.innerHTML = item.name;
  var editSpan = document.createElement('span');
  editSpan.classList.add('edit');
  editSpan.innerHTML = 'edit';
  editSpan.addEventListener('click', editItem);
  editSpan.dataset.index = objectCount;
  objectCount++;
  titleHeading.appendChild(titleSpan);
  titleHeading.appendChild(editSpan);

  var itemDetailsP = document.createElement('p');
  
  var countSpan = document.createElement('span');
  countSpan.classList.add('count');
  countSpan.innerHTML = item.count;
  itemDetailsP.appendChild(countSpan);
  itemDetailsP.innerHTML += ' x ';
  priceSpan = document.createElement('span');
  priceSpan.classList.add('unit');
  priceSpan.innerHTML = Number(item.price).toFixed(2);
  itemDetailsP.appendChild(priceSpan);

  titleContainer.appendChild(titleHeading);
  titleContainer.appendChild(itemDetailsP);

 var totalContainer = document.createElement('div');
 totalContainer.classList.add('total');
 var itemTotal = Number(item.price) * Number(item.count);
 totalContainer.innerHTML = itemTotal.toFixed(2);

  itemContainer.appendChild(titleContainer);
  itemContainer.appendChild(totalContainer);

  container.appendChild(itemContainer);
}
