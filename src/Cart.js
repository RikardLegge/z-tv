class CartItemType {
  constructor(name, price, icon) {
    this.name = name;
    this.price = price;
    this.icon = icon;
  }
}

class CartItem {
  constructor(count, tp) {
    this.count = count;
    this.tp = tp;
  }

  price() {
    return this.count * this.tp.price;
  }
}

class Cart {
  constructor(items=[]) {
    if (items instanceof Cart) {
      items = items.items;
    }
    this.items = items;
  }

  isEmpty() {
    return this.items.length === 0;
  }

  map(fn) {
    return this.items.map(fn);
  }

  add(tp) {
    for(const item of this.items) {
      if(tp === item.tp) {
        item.count++;
        return;
      }
    }
    this.items.push(new CartItem(1, tp));
  }

  price(){
    let total = 0;
    for(const item of this.items) {
      total += item.price();
    }
    return total;
  }
}

module.exports = {Cart, CartItemType, CartItem};
