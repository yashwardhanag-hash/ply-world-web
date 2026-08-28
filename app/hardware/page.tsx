import { createClient } from '../../lib/supabase'
import CatalogView from '../../components/CatalogView'

export default async function HardwarePage() {
  const supabase = createClient()

  // Fetch products with relations and nested variants
  const [
    { data: products },
    { data: categories },
    { data: brands },
    { data: series }
  ] = await Promise.all([
    supabase.from('products').select(`
      id,
      title,
      slug,
      description,
      image_urls,
      base_price,
      categories (id, name, slug),
      brands (id, name, slug),
      series (id, name, slug, brands (slug)),
      product_variants (id, sku, thickness_mm, size_ft, price)
    `),
    supabase.from('categories').select('id, name, slug'),
    supabase.from('brands').select('id, name, slug'),
    supabase.from('series').select('id, name, slug, brands (slug)')
  ])

  return (
    <main className="min-h-screen bg-slate-50 p-6 md:p-12">
      <div className="max-w-6xl mx-auto space-y-8">
        <header className="border-b pb-6">
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
            PLY WORLD
          </h1>
          <p className="text-slate-600 mt-1">
            Premium Plywood, Decorative Laminates, Roca Sanitaryware & Architectural Hardware
          </p>
        </header>

        <CatalogView
          initialProducts={products || []}
          categories={categories || []}
          brands={brands || []}
          series={series || []}
          defaultCategory="hardware"
        />
      </div>
    </main>
  )
}
