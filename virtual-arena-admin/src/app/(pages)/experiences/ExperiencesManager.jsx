'use client'
import React, { useEffect, useMemo, useState } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import { API_URL, getAuthHeaders } from '@/utils/ApiUrl'
import DynamicTable from '@/components/common/Table'
import Modal from '@/components/common/Modal'

const slugify = (text = '') =>
  text
    .toString()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '')

const emptyForm = {
  title: '',
  title_fr: '',
  slug: '',
  description: '',
  description_fr: '',
  features: '',
  features_fr: '',
  capacity: '',
  duration: '',
  age_requirement: '',
  single_player_price: '',
  pair_price: '',
  header_image_url: '',
  is_active: true,
}

const uploadHeaderImage = async (file) => {
  const formData = new FormData()
  formData.append('image', file)
  
  try {
    const response = await axios.post(`${API_URL}/admin/upload-header-image`, formData, {
      ...getAuthHeaders(),
      headers: {
        ...getAuthHeaders().headers,
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data
  } catch (error) {
    console.error('Upload error:', error)
    throw error
  }
}

const parseFeatures = (val) => {
  if (!val) return []
  try {
    const parsed = JSON.parse(val)
    return Array.isArray(parsed) ? parsed : []
  } catch (e) {
    // fallback comma-separated
    return val
      .split(',')
      .map((f) => f.trim())
      .filter(Boolean)
  }
}

export default function ExperiencesManager() {
  const [experiences, setExperiences] = useState([])
  const [loading, setLoading] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(null)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [selected, setSelected] = useState(null)

  const [createOpen, setCreateOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [uploading, setUploading] = useState(false)

  const headers = useMemo(
    () => [
      { accessor: 'id', header: 'ID' },
      { accessor: 'title', header: 'Title' },
      { accessor: 'slug', header: 'Slug' },
      { accessor: 'is_active', header: 'Status', render: (v) => (
        <span className={`px-2 py-1 rounded text-xs ${v ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {v ? 'Active' : 'Inactive'}
        </span>
      ) },
    ],
    []
  )

  const fetchExperiences = async () => {
    try {
      setLoading(true)
      const res = await axios.get(`${API_URL}/admin/experiences`, getAuthHeaders())
      if (res.data.success) {
        setExperiences(res.data.experiences || [])
      } else {
        setExperiences([])
      }
    } catch (e) {
      console.error(e)
      toast.error('Failed to fetch experiences')
      setExperiences([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchExperiences()
  }, [])

  // Listen to cross-page updates (e.g., ExperienceMediaManager dropdown refresh)
  useEffect(() => {
    const onExternalUpdate = () => fetchExperiences()
    const onFocus = () => fetchExperiences()
    if (typeof window !== 'undefined') {
      window.addEventListener('experiences:updated', onExternalUpdate)
      window.addEventListener('focus', onFocus)
    }
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('experiences:updated', onExternalUpdate)
        window.removeEventListener('focus', onFocus)
      }
    }
  }, [])

  const openCreate = () => {
    setForm(emptyForm)
    setCreateOpen(true)
  }

  const openEdit = (row) => {
    setSelected(row)
    setForm({
      title: row.title || '',
      title_fr: row.title_fr || '',
      slug: row.slug || '',
      description: row.description || '',
      description_fr: row.description_fr || '',
      features: Array.isArray(row.features) ? row.features.join('\n') : (row.features ? String(row.features) : ''),
      features_fr: Array.isArray(row.features_fr) ? row.features_fr.join('\n') : (row.features_fr ? String(row.features_fr) : ''),
      capacity: row.capacity || '',
      duration: row.duration || '',
      age_requirement: row.age_requirement || '',
      single_player_price: row.single_player_price || '',
      pair_price: row.pair_price || '',
      header_image_url: row.header_image_url || '',
      is_active: !!row.is_active,
    })
    setEditOpen(true)
  }

  const handleDelete = (row) => {
    setSelected(row)
    setDeleteModalOpen(true)
  }

  const confirmDelete = async () => {
    if (!selected) return
    try {
      await axios.delete(`${API_URL}/admin/experiences/${selected.id}`, getAuthHeaders())
      toast.success('Experience deleted')
      setDeleteModalOpen(false)
      setSelected(null)
      await fetchExperiences()
      if (typeof window !== 'undefined') window.dispatchEvent(new Event('experiences:updated'))
    } catch (e) {
      console.error(e)
      toast.error(e?.response?.data?.message || 'Failed to delete')
    }
  }

  const handleCreateSubmit = async (e) => {
    e.preventDefault()
    const payload = {
      title: form.title,
      title_fr: form.title_fr,
      slug: slugify(form.title),
      description: form.description,
      description_fr: form.description_fr,
      features: form.features.split('\n').map(f => f.trim()).filter(Boolean),
      features_fr: form.features_fr.split('\n').map(f => f.trim()).filter(Boolean),
      capacity: form.capacity,
      duration: form.duration,
      age_requirement: form.age_requirement,
      single_player_price: form.single_player_price ? parseFloat(form.single_player_price) : null,
      pair_price: form.pair_price ? parseFloat(form.pair_price) : null,
      header_image_url: form.header_image_url,
      is_active: !!form.is_active,
    }
    try {
      const res = await axios.post(`${API_URL}/admin/experiences`, payload, getAuthHeaders())
      if (res.data.success) {
        toast.success('Experience created')
        setCreateOpen(false)
        await fetchExperiences()
        if (typeof window !== 'undefined') window.dispatchEvent(new Event('experiences:updated'))
      } else {
        toast.error('Failed to create experience')
      }
    } catch (e) {
      console.error(e)
      toast.error(e?.response?.data?.message || 'Failed to create')
    }
  }

  const handleEditSubmit = async (e) => {
    e.preventDefault()
    if (!selected) return
    const payload = {
      title: form.title,
      title_fr: form.title_fr,
      slug: form.slug || slugify(form.title),
      description: form.description,
      description_fr: form.description_fr,
      features: form.features.split('\n').map(f => f.trim()).filter(Boolean),
      features_fr: form.features_fr.split('\n').map(f => f.trim()).filter(Boolean),
      capacity: form.capacity,
      duration: form.duration,
      age_requirement: form.age_requirement,
      single_player_price: form.single_player_price ? parseFloat(form.single_player_price) : null,
      pair_price: form.pair_price ? parseFloat(form.pair_price) : null,
      header_image_url: form.header_image_url,
      is_active: !!form.is_active,
    }
    try {
      const res = await axios.put(`${API_URL}/admin/experiences/${selected.id}`, payload, getAuthHeaders())
      if (res.data.success) {
        toast.success('Experience updated')
        setEditOpen(false)
        await fetchExperiences()
        if (typeof window !== 'undefined') window.dispatchEvent(new Event('experiences:updated'))
      } else {
        toast.error('Failed to update experience')
      }
    } catch (e) {
      console.error(e)
      toast.error(e?.response?.data?.message || 'Failed to update')
    }
  }

  return (
    <div className="p-2 md:p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gradiant">Experiences</h1>
        <button onClick={openCreate} className="px-4 py-2 bg-grad text-white rounded-md">
          New Experience
        </button>
      </div>

      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading experiences...</p>
        </div>
      ) : (
        <DynamicTable
          headers={headers}
          data={experiences}
          onEdit={openEdit}
          onDetail={() => {}}
          onDelete={handleDelete}
          onConfirm={confirmDelete}
          dropdownOpen={dropdownOpen}
          setDropdownOpen={setDropdownOpen}
          deleteModalOpen={deleteModalOpen}
          setDeleteModalOpen={setDeleteModalOpen}
        />
      )}

      {/* Create Modal */}
      <Modal isOpen={createOpen} onClose={() => setCreateOpen(false)}>
        <div className="bg-white p-6 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <h2 className="text-lg font-semibold mb-4">Create Experience</h2>
          <form onSubmit={handleCreateSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Title (English) *</label>
                <input
                  type="text"
                  className="w-full border rounded px-3 py-2"
                  value={form.title}
                  onChange={(e) => setForm((f) => ({ ...f, title: e.target.value, slug: slugify(e.target.value) }))}
                  required
                  placeholder="e.g., Free Roaming Arena"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Title (French)</label>
                <input
                  type="text"
                  className="w-full border rounded px-3 py-2"
                  value={form.title_fr}
                  onChange={(e) => setForm((f) => ({ ...f, title_fr: e.target.value }))}
                  placeholder="e.g., Arène de Libre Parcours"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Slug (auto-generated)</label>
              <input 
                type="text" 
                className="w-full border rounded px-3 py-2 bg-gray-100" 
                value={slugify(form.title)} 
                disabled 
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Description (English) *</label>
                <textarea 
                  className="w-full border rounded px-3 py-2" 
                  rows={3} 
                  value={form.description} 
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} 
                  required
                  placeholder="Brief description of the experience"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Description (French)</label>
                <textarea 
                  className="w-full border rounded px-3 py-2" 
                  rows={3} 
                  value={form.description_fr} 
                  onChange={(e) => setForm((f) => ({ ...f, description_fr: e.target.value }))} 
                  placeholder="Brève description de l'expérience"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Features (English, one per line)</label>
                <textarea 
                  className="w-full border rounded px-3 py-2" 
                  rows={4} 
                  value={form.features} 
                  onChange={(e) => setForm((f) => ({ ...f, features: e.target.value }))} 
                  placeholder="Full-body tracking&#10;Wireless headsets&#10;Multiplayer support&#10;Interactive environments"
                />
                <p className="text-sm text-gray-500 mt-1">Enter each feature on a new line</p>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Features (French, one per line)</label>
                <textarea 
                  className="w-full border rounded px-3 py-2" 
                  rows={4} 
                  value={form.features_fr} 
                  onChange={(e) => setForm((f) => ({ ...f, features_fr: e.target.value }))} 
                  placeholder="Suivi corporel complet&#10;Casques sans fil&#10;Support multijoueur&#10;Environnements interactifs"
                />
                <p className="text-sm text-gray-500 mt-1">Entrez chaque fonctionnalité sur une nouvelle ligne</p>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Capacity</label>
              <input 
                type="text" 
                className="w-full border rounded px-3 py-2" 
                value={form.capacity} 
                onChange={(e) => setForm((f) => ({ ...f, capacity: e.target.value }))} 
                placeholder="e.g., Up to 10 players, 2 players"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Duration</label>
              <input 
                type="text" 
                className="w-full border rounded px-3 py-2" 
                value={form.duration} 
                onChange={(e) => setForm((f) => ({ ...f, duration: e.target.value }))} 
                placeholder="e.g., 45-60 minutes per session, 15 minutes"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Age Requirement</label>
              <input 
                type="text" 
                className="w-full border rounded px-3 py-2" 
                value={form.age_requirement} 
                onChange={(e) => setForm((f) => ({ ...f, age_requirement: e.target.value }))} 
                placeholder="e.g., 12 years and older, All ages"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Single Player Price ($)</label>
                <input 
                  type="number" 
                  step="0.01" 
                  className="w-full border rounded px-3 py-2" 
                  value={form.single_player_price} 
                  onChange={(e) => setForm((f) => ({ ...f, single_player_price: e.target.value }))} 
                  placeholder="9.00"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Pair Price ($)</label>
                <input 
                  type="number" 
                  step="0.01" 
                  className="w-full border rounded px-3 py-2" 
                  value={form.pair_price} 
                  onChange={(e) => setForm((f) => ({ ...f, pair_price: e.target.value }))} 
                  placeholder="15.00"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Header Image</label>
              <div className="space-y-2">
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={async (e) => {
                    const file = e.target.files[0]
                    if (file) {
                      setUploading(true)
                      try {
                        const result = await uploadHeaderImage(file)
                        if (result.success) {
                          setForm(f => ({ ...f, header_image_url: result.imageUrl }))
                          toast.success('Image uploaded successfully')
                        }
                      } catch (error) {
                        toast.error('Failed to upload image')
                      } finally {
                        setUploading(false)
                      }
                    }
                  }}
                  className="w-full border rounded px-3 py-2"
                  disabled={uploading}
                />
                {uploading && <p className="text-sm text-blue-600">Uploading...</p>}
                {form.header_image_url && (
                  <div className="mt-2">
                    <img src={`${API_URL.replace('/api/v1', '')}${form.header_image_url}`} alt="Header preview" className="w-32 h-20 object-cover rounded" />
                    <p className="text-sm text-gray-500 mt-1">{form.header_image_url}</p>
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <input id="create-is-active" type="checkbox" checked={form.is_active} onChange={(e) => setForm((f) => ({ ...f, is_active: e.target.checked }))} />
              <label htmlFor="create-is-active">Active (visible to users)</label>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={() => setCreateOpen(false)} className="px-4 py-2 rounded border">Cancel</button>
              <button type="submit" className="px-4 py-2 bg-grad text-white rounded">Create Experience</button>
            </div>
          </form>
        </div>
      </Modal>

      {/* Edit Modal */}
      <Modal isOpen={editOpen} onClose={() => setEditOpen(false)}>
        <div className="bg-white p-6 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <h2 className="text-lg font-semibold mb-4">Edit Experience</h2>
          <form onSubmit={handleEditSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Title (English) *</label>
                <input 
                  type="text" 
                  className="w-full border rounded px-3 py-2" 
                  value={form.title} 
                  onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} 
                  required 
                  placeholder="e.g., Free Roaming Arena"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Title (French)</label>
                <input 
                  type="text" 
                  className="w-full border rounded px-3 py-2" 
                  value={form.title_fr} 
                  onChange={(e) => setForm((f) => ({ ...f, title_fr: e.target.value }))} 
                  placeholder="e.g., Arène de Libre Parcours"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Slug</label>
              <input 
                type="text" 
                className="w-full border rounded px-3 py-2" 
                value={form.slug} 
                onChange={(e) => setForm((f) => ({ ...f, slug: slugify(e.target.value) }))} 
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Description (English) *</label>
                <textarea 
                  className="w-full border rounded px-3 py-2" 
                  rows={3} 
                  value={form.description} 
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} 
                  required
                  placeholder="Brief description of the experience"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Description (French)</label>
                <textarea 
                  className="w-full border rounded px-3 py-2" 
                  rows={3} 
                  value={form.description_fr} 
                  onChange={(e) => setForm((f) => ({ ...f, description_fr: e.target.value }))} 
                  placeholder="Brève description de l'expérience"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Features (English, one per line)</label>
                <textarea 
                  className="w-full border rounded px-3 py-2" 
                  rows={4} 
                  value={form.features} 
                  onChange={(e) => setForm((f) => ({ ...f, features: e.target.value }))} 
                  placeholder="Full-body tracking&#10;Wireless headsets&#10;Multiplayer support&#10;Interactive environments"
                />
                <p className="text-sm text-gray-500 mt-1">Enter each feature on a new line</p>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Features (French, one per line)</label>
                <textarea 
                  className="w-full border rounded px-3 py-2" 
                  rows={4} 
                  value={form.features_fr} 
                  onChange={(e) => setForm((f) => ({ ...f, features_fr: e.target.value }))} 
                  placeholder="Suivi corporel complet&#10;Casques sans fil&#10;Support multijoueur&#10;Environnements interactifs"
                />
                <p className="text-sm text-gray-500 mt-1">Entrez chaque fonctionnalité sur une nouvelle ligne</p>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Capacity</label>
              <input 
                type="text" 
                className="w-full border rounded px-3 py-2" 
                value={form.capacity} 
                onChange={(e) => setForm((f) => ({ ...f, capacity: e.target.value }))} 
                placeholder="e.g., Up to 10 players, 2 players"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Duration</label>
              <input 
                type="text" 
                className="w-full border rounded px-3 py-2" 
                value={form.duration} 
                onChange={(e) => setForm((f) => ({ ...f, duration: e.target.value }))} 
                placeholder="e.g., 45-60 minutes per session, 15 minutes"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Age Requirement</label>
              <input 
                type="text" 
                className="w-full border rounded px-3 py-2" 
                value={form.age_requirement} 
                onChange={(e) => setForm((f) => ({ ...f, age_requirement: e.target.value }))} 
                placeholder="e.g., 12 years and older, All ages"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Single Player Price ($)</label>
                <input 
                  type="number" 
                  step="0.01" 
                  className="w-full border rounded px-3 py-2" 
                  value={form.single_player_price} 
                  onChange={(e) => setForm((f) => ({ ...f, single_player_price: e.target.value }))} 
                  placeholder="9.00"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Pair Price ($)</label>
                <input 
                  type="number" 
                  step="0.01" 
                  className="w-full border rounded px-3 py-2" 
                  value={form.pair_price} 
                  onChange={(e) => setForm((f) => ({ ...f, pair_price: e.target.value }))} 
                  placeholder="15.00"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Header Image</label>
              <div className="space-y-2">
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={async (e) => {
                    const file = e.target.files[0]
                    if (file) {
                      setUploading(true)
                      try {
                        const result = await uploadHeaderImage(file)
                        if (result.success) {
                          setForm(f => ({ ...f, header_image_url: result.imageUrl }))
                          toast.success('Image uploaded successfully')
                        }
                      } catch (error) {
                        toast.error('Failed to upload image')
                      } finally {
                        setUploading(false)
                      }
                    }
                  }}
                  className="w-full border rounded px-3 py-2"
                  disabled={uploading}
                />
                {uploading && <p className="text-sm text-blue-600">Uploading...</p>}
                {form.header_image_url && (
                  <div className="mt-2">
                    <img src={`${API_URL.replace('/api/v1', '')}${form.header_image_url}`} alt="Header preview" className="w-32 h-20 object-cover rounded" />
                    <p className="text-sm text-gray-500 mt-1">{form.header_image_url}</p>
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <input id="edit-is-active" type="checkbox" checked={form.is_active} onChange={(e) => setForm((f) => ({ ...f, is_active: e.target.checked }))} />
              <label htmlFor="edit-is-active">Active (visible to users)</label>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={() => setEditOpen(false)} className="px-4 py-2 rounded border">Cancel</button>
              <button type="submit" className="px-4 py-2 bg-grad text-white rounded">Update Experience</button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  )
}
