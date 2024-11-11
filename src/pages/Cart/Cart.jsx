import React from 'react';
import './Cart.css';

function Cart() {
  const userId = localStorage.getItem('userId');

  if (!userId) {
    return <p>You need to log in to view your cart.</p>;
  }
  return (
    <div className="cart">
      <h2>Your Shopping Cart</h2>
      <p>Items added to your cart will appear here.</p>
    </div>
  );
}

export default Cart;
