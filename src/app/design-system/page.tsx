import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import Button from "@/components/ui/button";
import Badge from "@/components/ui/badge";
import CategoryChip from "@/components/ui/category-chip";
import ProductCard from "@/components/ui/product-card";
import Price from "@/components/ui/price";
import Rating from "@/components/ui/rating";

export default function DesignSystemPage() {
  return (
    <div className="min-h-screen bg-[var(--color-muted)]">
      <Navbar />
      <main className="container-page py-10">
        <section className="mb-10">
          <h1 className="text-[var(--text-3xl)] font-bold">Design System</h1>
          <p className="text-black/60 dark:text-white/70">Tokens, components, and examples inspired by the grocery marketplace theme.</p>
        </section>

        <section className="mb-12 space-y-4">
          <h2 className="text-[var(--text-xl)] font-semibold">Buttons</h2>
          <div className="flex flex-wrap gap-3">
            <Button>Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="danger">Danger</Button>
          </div>
        </section>

        <section className="mb-12 space-y-4">
          <h2 className="text-[var(--text-xl)] font-semibold">Badges</h2>
          <div className="flex flex-wrap items-center gap-3">
            <Badge>Default</Badge>
            <Badge variant="success">In Stock</Badge>
            <Badge variant="warning">Limited</Badge>
            <Badge variant="danger">-25%</Badge>
            <Badge variant="muted">New</Badge>
          </div>
        </section>

        <section className="mb-12 space-y-4">
          <h2 className="text-[var(--text-xl)] font-semibold">Chips</h2>
          <div className="flex flex-wrap gap-3">
            <CategoryChip>All</CategoryChip>
            <CategoryChip active>Beverages</CategoryChip>
            <CategoryChip>Snacks</CategoryChip>
            <CategoryChip>Fresh</CategoryChip>
            <CategoryChip>Household</CategoryChip>
          </div>
        </section>

        <section className="mb-12 space-y-4">
          <h2 className="text-[var(--text-xl)] font-semibold">Pricing & Rating</h2>
          <div className="flex flex-wrap items-center gap-6 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white p-6">
            <Price value={29900} original={39900} />
            <Rating value={4.5} />
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-[var(--text-xl)] font-semibold">Product Cards</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <ProductCard product={{
              id: "demo-1",
              name: "Mango Juice 300ml – 100% Organic, Fresh and Tasty",
              image: "https://images.unsplash.com/photo-1578916171728-46686eac8d58?q=80&w=640&auto=format&fit=crop",
              price: 29900,
              originalPrice: 39900,
              rating: 4.7,
              tags: ["-25%", "Top Seller"],
            }} />
            <ProductCard product={{
              id: "demo-2",
              name: "Olive Oil Extra Virgin 500ml",
              image: "https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=640&auto=format&fit=crop",
              price: 125900,
              rating: 4.4,
              tags: ["New"],
            }} />
            <ProductCard product={{
              id: "demo-3",
              name: "Fresh Broccoli – 500g",
              image: "https://images.unsplash.com/photo-1560807707-8cc77767d783?q=80&w=640&auto=format&fit=crop",
              price: 18900,
              rating: 4.8,
              tags: ["Fresh"],
            }} />
            <ProductCard product={{
              id: "demo-4",
              name: "Mixed Nuts – Healthy Snack Pack",
              image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=640&auto=format&fit=crop",
              price: 45900,
              originalPrice: 55900,
              rating: 4.3,
              tags: ["Sale"],
            }} />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
