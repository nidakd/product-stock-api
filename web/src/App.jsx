import { useEffect, useMemo, useState } from 'react'
import axios from 'axios'
import './App.css'

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:5000'

const emptyForm = {
  name: '',
  price: '',
  stockQuantity: '',
}

const formatPrice = (price) => {
  return new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: 'TRY',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(price)
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
  const [deleteConfirmId, setDeleteConfirmId] = useState(null)
  const [editingId, setEditingId] = useState(null)
  const [editForm, setEditForm] = useState(emptyForm)

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
      setDeleteConfirmId(null)
    } catch {
      setError('Urun silinemedi. Ilgili kayit bulunamadi olabilir.')
    } finally {
      setDeletingId(null)
    }
  }

  const confirmDelete = (productId) => {
    setDeleteConfirmId(productId)
  }

  const cancelDelete = () => {
    setDeleteConfirmId(null)
  }

  const startEdit = (product) => {
    setEditingId(product.id)
    setEditForm({
      name: product.name,
      price: product.price.toString(),
      stockQuantity: product.stockQuantity.toString(),
    })
    setError('')
    setSuccess('')
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditForm(emptyForm)
  }

  const handleEditChange = (event) => {
    const { name, value } = event.target
    setEditForm((current) => ({ ...current, [name]: value }))
  }

  const handleEditSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setSuccess('')

    const trimmedName = editForm.name.trim()
    const price = Number(editForm.price)
    const stockQuantity = Number(editForm.stockQuantity)

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
      await axios.put(`${apiBaseUrl}/api/products/${editingId}`, {
        name: trimmedName,
        price,
        stockQuantity,
      })
      setEditForm(emptyForm)
      setEditingId(null)
      await fetchProducts()
      setSuccess('Urun guncellendi.')
    } catch {
      setError('Urun guncellenemedi. API hata dondu.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <main className="app-shell">
      <section className="hero-card">
        <div className="hero-copy">
          <p className="eyebrow">Full-Stack Homework</p>
          <h1>Urun Stok Yonetim Paneli</h1>
          <p className="hero-text">
            Bu panel, odevde istenen CRUD akislarini (Create, Read, Update, Delete)
            tek bir ekranda gostermek icin hazirlandi. Bu ekranda yeni urun eklenerek
            Create islemi, urun listesi goruntulenerek Read islemi ve urun silinerek
            Delete islemi test edilebilir. Ayrica arama kutusuyla urunler isme gore
            filtrelenerek veri daha hizli yonetilebilir.
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
            <div className="empty-state">Urun listemiz bos. Yukaridan yeni urun ekleyerek basla.</div>
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
                      <td>{formatPrice(product.price)}</td>
                      <td>{product.stockQuantity}</td>
                      <td>
                        <div className="action-buttons">
                          <button
                            type="button"
                            className="edit-button"
                            onClick={() => startEdit(product)}
                          >
                            Duzenle
                          </button>
                          <button
                            type="button"
                            className="danger-button"
                            onClick={() => confirmDelete(product.id)}
                            disabled={deletingId === product.id}
                          >
                            {deletingId === product.id ? 'Siliniyor...' : 'Sil'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </article>
      </section>

      {deleteConfirmId !== null && (
        <div className="modal-overlay" onClick={cancelDelete}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Urunu Sil</h3>
            <p>Bu islemi geri alamazsiniz. Urunu silmek istediginizden emin misiniz?</p>
            <div className="modal-actions">
              <button
                type="button"
                className="secondary-button"
                onClick={cancelDelete}
              >
                Iptal
              </button>
              <button
                type="button"
                className="danger-button"
                onClick={() => handleDelete(deleteConfirmId)}
                disabled={deletingId === deleteConfirmId}
              >
                {deletingId === deleteConfirmId ? 'Siliniyor...' : 'Evet, Sil'}
              </button>
            </div>
          </div>
        </div>
      )}

      {editingId !== null && (
        <div className="modal-overlay" onClick={cancelEdit}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Urunu Duzenle</h3>
            <form onSubmit={handleEditSubmit} className="modal-form">
              <label>
                Urun Adi
                <input
                  name="name"
                  value={editForm.name}
                  onChange={handleEditChange}
                  placeholder="Ornek: Monitor"
                  autoFocus
                />
              </label>

              <label>
                Fiyat
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  name="price"
                  value={editForm.price}
                  onChange={handleEditChange}
                  placeholder="0.00"
                />
              </label>

              <label>
                Stok Adedi
                <input
                  type="number"
                  min="0"
                  name="stockQuantity"
                  value={editForm.stockQuantity}
                  onChange={handleEditChange}
                  placeholder="0"
                />
              </label>

              <div className="modal-actions">
                <button
                  type="button"
                  className="secondary-button"
                  onClick={cancelEdit}
                >
                  Iptal
                </button>
                <button
                  type="submit"
                  className="primary-button"
                  disabled={saving}
                >
                  {saving ? 'Guncelleniyor...' : 'Kaydet'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  )
}

export default App
