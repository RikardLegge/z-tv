class CartItemType {
  constructor(name, price, icon, maxCount) {
    this.name = name;
    this.price = price;
    this.icon = icon;
    this.maxCount = maxCount;
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

  isMax() {
    return this.count >= this.tp.maxCount;
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
        if(item.isMax()) return false;
        item.count++;
        return true;
      }
    }
    this.items.push(new CartItem(1, tp));
    return true;
  }

  asMap() {
    const items = {};
    for (let item of this.items) {
      const name = item.tp.name;
      items[name] = item.count;
    }
    return items;
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
