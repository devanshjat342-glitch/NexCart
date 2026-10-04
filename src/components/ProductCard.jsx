import { useContext } from "react";
import { Link } from "react-router-dom";

import { CartContext } from "../context/CartContext";

function ProductCard({ product }) {
  const { addToCart } = useContext(CartContext);

  return (
    <div className="bg-white shadow-lg rounded-xl p-4 hover:shadow-xl transition">

      {/* Product Image */}
      <Link to={`/product/${product.id}`}>
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-56 object-cover rounded-lg cursor-pointer"
        />
      </Link>

      {/* Product Name */}
      <Link to={`/product/${product.id}`}>
        <h2 className="text-xl font-semibold mt-4 hover:text-blue-600 cursor-pointer">
          {product.name}
        </h2>
      </Link>

      {/* Price */}
      <p className="text-blue-600 font-bold mt-2">
        ₹{product.price}
      </p>

      {/* Add To Cart */}
      <button
        onClick={() => addToCart(product)}
        className="w-full mt-4 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
      >
        Add to Cart
      </button>

    </div>
  );
}

export default ProductCard;