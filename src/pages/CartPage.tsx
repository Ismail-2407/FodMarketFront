import { useCart } from "../context/CartContext";
import styles from "./CartPage.module.css";

function CartPage() {
  const { cart, removeFromCart, updateQuantity, clearCart } = useCart();

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Корзина</h1>

      {cart.length === 0 ? (
        <p className={styles.empty}>Корзина пуста</p>
      ) : (
        <>
          <div className={styles.items}>
            {cart.map((item) => (
              <div key={item.id} className={styles.item}>
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className={styles.image}
                />
                <div className={styles.details}>
                  <h3>{item.name}</h3>
                  <p>{item.price} ₽</p>
                  <input
                    type="number"
                    min={1}
                    value={item.quantity}
                    onChange={(e) =>
                      updateQuantity(item.id, parseInt(e.target.value))
                    }
                    className={styles.quantity}
                  />
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className={styles.remove}
                  >
                    Удалить
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className={styles.summary}>
            <h2>Итого: {total.toFixed(2)} ₽</h2>
            <button onClick={clearCart} className={styles.clear}>
              Очистить корзину
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default CartPage;
