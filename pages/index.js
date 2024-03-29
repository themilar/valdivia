import { useEffect } from "react";
import Image from "next/image";
import Link from "@/components/Link";
import shallow from "zustand/shallow";
import useAuthStore from "store/user";
import { BASE_URL } from "../constants";
import { fetchProducts, currencyFormat } from "../lib/";
import client from "lib/axiosWrapper";
export async function getStaticProps() {
  const products = await fetchProducts();
  return {
    props: { products },
  };
}

export default function LandingPage({ products }) {
  const [userData, token, setUserData] = useAuthStore(
    (state) => [state.userData, state.token, state.setUserData],
    shallow
  );
  useEffect(() => {
    if (token) {
      client(`${BASE_URL}/auth/users/me/`, {
        headers: { Authorization: `JWT ${token}` },
      })
        .then((response) => setUserData(response.data))
        .catch((err) => console.log(err));
    }
  }, [token, setUserData]);
  const placeholderImage =
    "https://res.cloudinary.com/dsuqfsnp2/image/upload/v1658883630/cld-sample-4.jpg";
  return (
    <div>
      <section className="hero p-8 bg-hero-pattern">
        <h1 className="text-5xl text-gray-100 p-12">
          Welcome to the shop {userData && userData.username}
        </h1>
      </section>
      <section className="featured-products m-4">
        <div className="flex justify-center">
          <h2 className="text-2xl mb-2 ">Featured Products</h2>
        </div>
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
          {products &&
            products.map((product) => (
              <div
                className="product-card w-full border-solid border-gray-200 border-2"
                key={product.id}
              >
                <div className="bg-main active:bg-brand w-full aspect-1">
                  <div className="bg-white w-full h-full relative hover:translate-y-[-10px] hover:translate-x-[-10px] transition-transform object-contain ">
                    <Image
                      src={product.image?.image || placeholderImage}
                      width={305}
                      height={200}
                      alt={product.title}
                    />
                  </div>
                </div>
                <div className="details h-2/6">
                  <p
                    className="block mt-2 text-md font-extrabold text-main truncate"
                    data-testid={`productName${product.name}`}
                  >
                    {product.title}
                  </p>

                  <p className="description text-gray-500">
                    {product.description}
                  </p>

                  <span>$ {currencyFormat(product.price_with_tax)}</span>

                  <span className="p-4 mt-8">
                    <Link
                      className="border-solid border-2 border-sky-500 bg-green-400 text-gray-50 p-2 "
                      href="#"
                    >
                      Add to Cart
                    </Link>
                  </span>
                </div>
              </div>
            ))}
        </ul>
      </section>
    </div>
  );
}
