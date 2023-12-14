import Link from 'next/link'
import ProductCard from './components/ProductCard'
import { revalidateTag } from "next/cache";


export default async function Home() {
  const res = await fetch("https://6579983d1acd268f9af9759b.mockapi.io/products", {
    cache: 'no-cache',
    next: { tags: ["products"] }
  })
  const products = await res.json();

  const addProductToDatabase = async (e) => {
    "use server";
    const name = e.get("name")?.toString();
    const price = e.get("price")?.toString();

    if(!name || !price) return;

    const newProduct = {
      name: name,
      price: price,
    };

    await fetch("https://6579983d1acd268f9af9759b.mockapi.io/products", {
      method: 'POST',
      body: JSON.stringify(newProduct),
      headers: {
        'Content-Type': 'application/json'
      }
    });

    revalidateTag('products');
  }

  return (
   <main>
    <h1>Hello World</h1>
    <Link href="/users">Users</Link>
    <ProductCard />
    <form action={addProductToDatabase} className="flex flex-col gap-5 max-w-xl p-5">
      <input 
        name = "name"
        placeholder = "Enter product name"
        className="border border-black rounded-md" 
      />
      <input 
        name = "price"
        placeholder = "Enter product price"
        className="border border-black rounded-md"
      />
      <button className="btn btn-primary">
        Add Product
      </button>
    </form>

    <h2 className = "font-bold">List of Products</h2>
    <div className = "flex flex-col gap-5">
      {products.map(product => 
        <div key={product.id}>
          <p>{product.name}</p>
          <p>${product.price}</p>
        </div>
      )}
    </div>
  </main>
  )
}
