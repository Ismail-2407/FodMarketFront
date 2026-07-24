import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <PayPalScriptProvider
      options={{
        clientId:
          "AeJp6awjsYU6LRbKuDrEppnKywmYEE2TwF4Qn_ZHZzWRPVddGUZ7NqTEF-41xuaCRDqnFoOyc6hsVwtU",
        currency: "USD",
      }}
    >
      <BrowserRouter>
        <AuthProvider>
          <CartProvider>
            <App />
          </CartProvider>
        </AuthProvider>
      </BrowserRouter>
    </PayPalScriptProvider>
  </React.StrictMode>
);
