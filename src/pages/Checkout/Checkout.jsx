import React from 'react';
import './Checkout.css';

function Checkout() {
  const userId = localStorage.getItem('userId');

  if (!userId) {
    return <p>You need to log in to view checkout.</p>;
  }
  return (
    <div className="checkout">
      <h2>Checkout</h2>
      <p>Enter your shipping and payment details to complete the purchase.</p>
    </div>
  );
}

export default Checkout;
