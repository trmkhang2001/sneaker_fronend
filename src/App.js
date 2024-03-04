import logo from "./logo.svg";
import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [cartTotal, setCartTotal] = useState(0);
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(
          "https://api-sneaker.x10.mx/public/api/allproducts"
        );
        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }
        const data = await response.json();
        setProducts(data);
        const storedCart = sessionStorage.getItem("cart");
        const storedCartTotal = sessionStorage.getItem("cartTotal");
        console.log(cart);
        if (storedCart && storedCartTotal) {
          setCart(JSON.parse(storedCart));
          setCartTotal(parseFloat(storedCartTotal));
        } else {
          setCartTotal(0);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchProducts();
  }, []);
  useEffect(() => {
    const updatedProducts = products.map((product) => ({
      ...product,
      inCart: cart.some((item) => item.id === product.id),
    }));
    setProducts(updatedProducts);
  }, [cart]);
  const addToCart = (product) => {
    const updatedCart = [...cart, { ...product, quantity: 1 }];
    const updatedCartTotal = cartTotal + parseFloat(product.price);
    setCart(updatedCart);
    setCartTotal(updatedCartTotal);
    sessionStorage.setItem("cart", JSON.stringify(updatedCart));
    sessionStorage.setItem("cartTotal", updatedCartTotal);
    const updatedProducts = products.map((item) =>
      item.id === product.id ? { ...item, inCart: true } : item
    );
    setProducts(updatedProducts);
  };
  const removeFromCart = (index) => {
    const updatedCart = [...cart];
    const removedItem = updatedCart.splice(index, 1)[0];
    const updatedCartTotal =
      cartTotal - parseFloat(removedItem.price * removedItem.quantity);
    setCart(updatedCart);
    setCartTotal(updatedCartTotal);
    sessionStorage.setItem("cart", JSON.stringify(updatedCart));
    sessionStorage.setItem("cartTotal", updatedCartTotal);
  };
  const increaseQuantity = (index) => {
    const updatedCart = [...cart];
    updatedCart[index].quantity += 1;
    const updatedCartTotal = cartTotal + parseFloat(updatedCart[index].price);
    setCart(updatedCart);
    setCartTotal(updatedCartTotal);
    sessionStorage.setItem("cart", JSON.stringify(updatedCart));
    sessionStorage.setItem("cartTotal", updatedCartTotal);
  };
  const decreaseQuantity = (index) => {
    const updatedCart = [...cart];
    if (updatedCart[index].quantity > 1) {
      updatedCart[index].quantity -= 1;
      const updatedCartTotal = cartTotal - parseFloat(updatedCart[index].price);
      setCart(updatedCart);
      setCartTotal(updatedCartTotal);
      sessionStorage.setItem("cart", JSON.stringify(updatedCart));
      sessionStorage.setItem("cartTotal", updatedCartTotal);
    } else {
      removeFromCart(index);
    }
  };
  return (
    <div className="App_mainContent">
      <div className="App_card">
        <div className="Card_Top">
          <img
            src={process.env.PUBLIC_URL + "/images/nike.png"}
            className="Card_logoTop"
          ></img>
        </div>
        <div className="Card_Title">Our Products</div>
        <div className="Card_Body">
          <div>
            {products.map((product, index) => (
              <div className="Item">
                <div
                  className="Item_img"
                  style={{ backgroundColor: product.color }}
                >
                  <img src={product.image}></img>
                </div>
                <div className="Item_name">{product.name}</div>
                <div className="Item_description">{product.description}</div>
                <div className="Item_Footer">
                  <div className="Item_price">{"$" + product.price}</div>
                  <div
                    className="Item_button"
                    onClick={() => {
                      if (!product.inCart) {
                        addToCart(product);
                      }
                    }}
                  >
                    {product.inCart ? (
                      <div className="Item_check">
                        <img
                          src={process.env.PUBLIC_URL + "/images/check.png"}
                        ></img>
                      </div>
                    ) : (
                      <p>ADD TO CART</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="App_card">
        <div className="Card_Top">
          <img
            src={process.env.PUBLIC_URL + "/images/nike.png"}
            className="Card_logoTop"
          ></img>
        </div>
        <div className="Card_Title">
          Your Cart
          <span className="Card_amount">
            ${cartTotal < 0 ? 0 : cartTotal.toFixed(2)}
          </span>
        </div>
        <div className="Card_Body">
          <div>
            <div>
              {cart.map((cartItem, index) => (
                <div className="Cart_item" key={index}>
                  <div className="Cart_left">
                    <div
                      className="Cart_img"
                      style={{ backgroundColor: cartItem.color }}
                    >
                      <div className="Cart_block">
                        <img src={cartItem.image} alt={cartItem.name}></img>
                      </div>
                    </div>
                  </div>
                  <div className="Cart_right">
                    <div className="Cart_itemName">{cartItem.name}</div>
                    <div className="Cart_itemPrice">${cartItem.price}</div>
                    <div className="Cart_itemAction">
                      <div className="Cart_count">
                        <div
                          className="Cart_downBtn"
                          onClick={() => decreaseQuantity(index)}
                        >
                          -
                        </div>
                        <div className="Cart_number">{cartItem.quantity}</div>
                        <div
                          className="Cart_upBtn"
                          onClick={() => increaseQuantity(index)}
                        >
                          +
                        </div>
                      </div>
                      <div
                        className="Cart_removeItem"
                        onClick={() => removeFromCart(index)}
                      >
                        <img
                          src={process.env.PUBLIC_URL + "/images/trash.png"}
                          alt="Remove"
                        ></img>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {cart.length === 0 && (
                <div className="Cart_empty">Cart Empty</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
