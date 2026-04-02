import { useEffect, useMemo, useState } from 'react'
import axios from 'axios'
import './App.css'

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:5000'

const emptyForm = {
  name: '',
  price: '',
  stockQuantity: '',
}

function App() {
  const [products, setProducts] = useState([])
  const [form, setForm] = useState(emptyForm)
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [deletingId, setDeletingId] = useState(null)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const filteredProducts = useMemo(() => {
    const query = searchTerm.trim().toLowerCase()

    if (!query) {
      return products
    }

    return products.filter((product) =>
      product.name.toLowerCase().includes(query),
    )
  }, [products, searchTerm])

  const fetchProducts = async () => {
    try {
      setError('')
      const response = await axios.get(`${apiBaseUrl}/api/products`)
      setProducts(response.data)
    } catch {
      setError('Urunler yuklenemedi. API calisiyor mu kontrol et.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setSuccess('')

    const trimmedName = form.name.trim()
    const price = Number(form.price)
    const stockQuantity = Number(form.stockQuantity)

    if (!trimmedName || Number.isNaN(price) || Number.isNaN(stockQuantity)) {
      setError('Tum alanlari gecerli sekilde doldur.')
      return
    }

    if (price < 0 || stockQuantity < 0) {
      setError('Fiyat ve stok sifirdan kucuk olamaz.')
      return
    }

    try {
      setSaving(true)
      await axios.post(`${apiBaseUrl}/api/products`, {
        name: trimmedName,
        price,
        stockQuantity,
      })
      setForm(emptyForm)
      await fetchProducts()
      setSuccess('Urun basariyla eklendi.')
    } catch {
      setError('Urun eklenemedi. API hata dondu.')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (productId) => {
    setError('')
    setSuccess('')
    try {
      setDeletingId(productId)
      await axios.delete(`${apiBaseUrl}/api/products/${productId}`)
      setProducts((current) => current.filter((product) => product.id !== productId))
      setSuccess('Urun silindi.')
    } catch {
      setError('Urun silinemedi. Ilgili kayit bulunamadi olabilir.')
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <main className="app-shell">
      <section className="hero-card">
        <div className="hero-copy">
          <p className="eyebrow">Full-Stack Homework</p>
          <h1>Urun Stok Yonetim Paneli</h1>
          <p className="hero-text">
            Urunleri listele, yeni urun ekle, sil ve isimle ara. Bu ekran odevin
            temel CRUD ihtiyacini tek sayfada toplar.
          </p>
        </div>

        <div className="hero-stats">
          <article>
            <span>Toplam Urun</span>
            <strong>{products.length}</strong>
          </article>
          <article>
            <span>Filtrelenen</span>
            <strong>{filteredProducts.length}</strong>
          </article>
          <article>
            <span>API</span>
            <strong>Hazir</strong>
          </article>
        </div>
      </section>

      <section className="content-grid">
        <article className="panel form-panel">
          <div className="panel-header">
            <h2>Yeni Urun Ekle</h2>
            <p>Ad, fiyat ve stok miktari girerek listeyi guncelle.</p>
          </div>

          <form onSubmit={handleSubmit} className="product-form">
            <label>
              Urun Adi
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Ornek: Monitor"
              />
            </label>

            <div className="form-row">
              <label>
                Fiyat
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  name="price"
                  value={form.price}
                  onChange={handleChange}
                  placeholder="0.00"
                />
              </label>

              <label>
                Stok Adedi
                <input
                  type="number"
                  min="0"
                  name="stockQuantity"
                  value={form.stockQuantity}
                  onChange={handleChange}
                  placeholder="0"
                />
              </label>
            </div>

            <button type="submit" className="primary-button" disabled={saving}>
              {saving ? 'Ekleniyor...' : 'Urun Ekle'}
            </button>
          </form>
        </article>

        <article className="panel list-panel">
          <div className="panel-header list-toolbar">
            <div>
              <h2>Urunler</h2>
              <p>Liste otomatik olarak API ile senkronize olur.</p>
            </div>

            <label className="search-box">
              Ara
              <input
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Urun adi ile filtrele"
              />
            </label>
          </div>

          {error ? <div className="alert-box error">{error}</div> : null}
          {success ? <div className="alert-box success">{success}</div> : null}

          {loading ? (
            <div className="empty-state">Urunler yukleniyor...</div>
          ) : filteredProducts.length === 0 ? (
            <div className="empty-state">Goruntulenecek urun bulunamadi.</div>
          ) : (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Urun Adi</th>
                    <th>Fiyat</th>
                    <th>Stok</th>
                    <th>Islem</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((product) => (
                    <tr key={product.id}>
                      <td>
                        <strong>{product.name}</strong>
                        <span>ID: {product.id}</span>
                      </td>
                      <td>{product.price}</td>
                      <td>{product.stockQuantity}</td>
                      <td>
                        <button
                          type="button"
                          className="danger-button"
                          onClick={() => handleDelete(product.id)}
                          disabled={deletingId === product.id}
                        >
                          {deletingId === product.id ? 'Siliniyor...' : 'Sil'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </article>
      </section>
    </main>
  )
}

export default App
