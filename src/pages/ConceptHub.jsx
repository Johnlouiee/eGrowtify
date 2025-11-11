import React, { useEffect, useMemo, useState } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import { useAuth } from '../contexts/AuthContext'
import {
  Plus,
  Upload,
  Download,
  Trash2,
  Users,
  User,
  FileInput,
  FileOutput,
  Loader2,
  Lock,
  Globe
} from 'lucide-react'

const defaultForm = {
  title: '',
  summary: '',
  technique_steps: '',
  tips: '',
  tags: '',
  is_public: true
}

const ConceptHub = () => {
  const { user } = useAuth()
  const [concepts, setConcepts] = useState({ community: [], mine: [] })
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [activeTab, setActiveTab] = useState('community')
  const [form, setForm] = useState(defaultForm)
  const [showForm, setShowForm] = useState(false)
  const [importing, setImporting] = useState(false)
  const [importFile, setImportFile] = useState(null)
  const [editingConcept, setEditingConcept] = useState(null)

  const sortedCommunity = useMemo(() => {
    return [...(concepts.community || [])].sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
  }, [concepts.community])

  const sortedMine = useMemo(() => {
    return [...(concepts.mine || [])].sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
  }, [concepts.mine])

  const fetchConcepts = async () => {
    try {
      setLoading(true)
      const response = await axios.get('/concepts')
      setConcepts(response.data.concepts || { community: [], mine: [] })
    } catch (error) {
      const message = error.response?.data?.error || 'Failed to load shared concepts'
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchConcepts()
  }, [])

  const resetForm = () => {
    setForm(defaultForm)
    setEditingConcept(null)
    setShowForm(false)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.title.trim()) {
      toast.error('Title is required')
      return
    }

    setSubmitting(true)
    try {
      const payload = {
        ...form,
        tags: form.tags
          .split(',')
          .map((tag) => tag.trim())
          .filter(Boolean)
      }

      if (editingConcept) {
        await axios.put(`/concepts/${editingConcept.id}`, payload)
        toast.success('Concept updated successfully')
      } else {
        await axios.post('/concepts', payload)
        toast.success('Concept shared with the community!')
      }

      resetForm()
      fetchConcepts()
    } catch (error) {
      const message = error.response?.data?.error || 'Failed to save concept'
      toast.error(message)
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (conceptId) => {
    if (!window.confirm('Are you sure you want to delete this concept?')) {
      return
    }

    try {
      await axios.delete(`/concepts/${conceptId}`)
      toast.success('Concept removed')
      fetchConcepts()
    } catch (error) {
      const message = error.response?.data?.error || 'Failed to delete concept'
      toast.error(message)
    }
  }

  const handleExport = async (conceptId, title) => {
    try {
      const response = await axios.get(`/concepts/${conceptId}/export`, {
        responseType: 'blob'
      })
      const blob = new Blob([response.data], { type: 'application/json' })
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `${title?.replace(/\s+/g, '_').toLowerCase() || 'concept'}.json`
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)
    } catch (error) {
      const message = error.response?.data?.error || 'Failed to export concept'
      toast.error(message)
    }
  }

  const handleToggleVisibility = async (concept) => {
    try {
      await axios.put(`/concepts/${concept.id}`, { is_public: !concept.is_public })
      toast.success(`Concept is now ${concept.is_public ? 'private' : 'public'}`)
      fetchConcepts()
    } catch (error) {
      const message = error.response?.data?.error || 'Failed to update visibility'
      toast.error(message)
    }
  }

  const handleImport = async (e) => {
    e.preventDefault()
    if (!importFile) {
      toast.error('Please select a file to import')
      return
    }

    const formData = new FormData()
    formData.append('file', importFile)

    setImporting(true)
    try {
      await axios.post('/concepts/import', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      toast.success('Concept imported successfully')
      setImportFile(null)
      fetchConcepts()
    } catch (error) {
      const message = error.response?.data?.error || 'Import failed'
      toast.error(message)
    } finally {
      setImporting(false)
    }
  }

  const startEditing = (concept) => {
    setEditingConcept(concept)
    setForm({
      title: concept.title || '',
      summary: concept.summary || '',
      technique_steps: concept.technique_steps || '',
      tips: concept.tips || '',
      tags: (concept.tags || []).join(', '),
      is_public: concept.is_public
    })
    setShowForm(true)
  }

  const renderConceptCard = (concept, isOwner = false) => (
    <div key={concept.id} className="border border-gray-200 rounded-lg p-5 shadow-sm bg-white">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold text-gray-900">{concept.title}</h3>
            {concept.is_public ? (
              <span className="inline-flex items-center gap-1 text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">
                <Globe className="w-3 h-3" />
                Public
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded-full">
                <Lock className="w-3 h-3" />
                Private
              </span>
            )}
          </div>
          {concept.summary && <p className="mt-1 text-sm text-gray-600">{concept.summary}</p>}
          <div className="mt-3 space-y-2 text-sm text-gray-700">
            {concept.technique_steps && (
              <div>
                <p className="font-medium text-gray-900">Technique / Steps</p>
                <p className="whitespace-pre-line">{concept.technique_steps}</p>
              </div>
            )}
            {concept.tips && (
              <div>
                <p className="font-medium text-gray-900">Tips</p>
                <p className="whitespace-pre-line">{concept.tips}</p>
              </div>
            )}
          </div>
          {concept.tags?.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {concept.tags.map((tag) => (
                <span key={tag} className="text-xs bg-primary-50 text-primary-700 px-2 py-1 rounded-full">
                  #{tag}
                </span>
              ))}
            </div>
          )}
          {concept.owner && (
            <p className="mt-3 text-xs text-gray-500">
              Shared by {concept.owner.name} • {new Date(concept.created_at).toLocaleString()}
            </p>
          )}
        </div>
        <div className="flex flex-col gap-2">
          <button
            onClick={() => handleExport(concept.id, concept.title)}
            className="p-2 rounded-md border border-gray-200 hover:bg-gray-100 text-gray-600"
            title="Export as JSON"
          >
            <Download className="w-4 h-4" />
          </button>
          {isOwner && (
            <>
              <button
                onClick={() => startEditing(concept)}
                className="p-2 rounded-md border border-gray-200 hover:bg-gray-100 text-gray-600"
                title="Edit concept"
              >
                <FileInput className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleToggleVisibility(concept)}
                className="p-2 rounded-md border border-gray-200 hover:bg-gray-100 text-gray-600"
                title="Toggle visibility"
              >
                {concept.is_public ? <Lock className="w-4 h-4" /> : <Globe className="w-4 h-4" />}
              </button>
              <button
                onClick={() => handleDelete(concept.id)}
                className="p-2 rounded-md border border-red-200 hover:bg-red-50 text-red-600"
                title="Delete concept"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )

  if (!user) {
    return null
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Concept & Technique Hub</h1>
          <p className="text-gray-600 mt-1">
            Share your growing concepts, import community wisdom, and collaborate with fellow gardeners.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => {
              setShowForm(true)
              setEditingConcept(null)
              setForm(defaultForm)
            }}
            className="inline-flex items-center gap-2 bg-primary-600 text-white px-4 py-2 rounded-md shadow-sm hover:bg-primary-700"
          >
            <Plus className="w-4 h-4" />
            Share Concept
          </button>
          <form onSubmit={handleImport} className="flex items-center gap-2">
            <label className="inline-flex items-center gap-2 border border-gray-200 px-3 py-2 rounded-md cursor-pointer hover:bg-gray-50">
              <Upload className="w-4 h-4 text-gray-600" />
              <span className="text-sm text-gray-700">Import</span>
              <input
                type="file"
                accept="application/json"
                className="hidden"
                onChange={(event) => setImportFile(event.target.files?.[0] || null)}
              />
            </label>
            <button
              type="submit"
              disabled={!importFile || importing}
              className="inline-flex items-center gap-2 border border-gray-200 px-3 py-2 rounded-md hover:bg-gray-50 disabled:opacity-60"
            >
              {importing ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileOutput className="w-4 h-4" />}
              <span className="text-sm text-gray-700">{importing ? 'Importing...' : 'Upload'}</span>
            </button>
          </form>
        </div>
      </div>

      <div className="mt-8">
        <div className="flex gap-4 border-b border-gray-200">
          <button
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium border-b-2 ${
              activeTab === 'community' ? 'border-primary-600 text-primary-600' : 'border-transparent text-gray-500'
            }`}
            onClick={() => setActiveTab('community')}
          >
            <Users className="w-4 h-4" />
            Community Concepts
          </button>
          <button
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium border-b-2 ${
              activeTab === 'mine' ? 'border-primary-600 text-primary-600' : 'border-transparent text-gray-500'
            }`}
            onClick={() => setActiveTab('mine')}
          >
            <User className="w-4 h-4" />
            My Concepts
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-6 h-6 text-primary-600 animate-spin" />
          </div>
        ) : (
          <div className="mt-6 space-y-4">
            {activeTab === 'community' && sortedCommunity.length === 0 && (
              <div className="border border-dashed border-gray-300 rounded-lg p-8 text-center text-gray-500">
                No shared concepts yet. Be the first to share your growing wisdom!
              </div>
            )}
            {activeTab === 'mine' && sortedMine.length === 0 && (
              <div className="border border-dashed border-gray-300 rounded-lg p-8 text-center text-gray-500">
                You have not shared any concepts yet. Click &quot;Share Concept&quot; to get started.
              </div>
            )}

            {activeTab === 'community'
              ? sortedCommunity.map((concept) => renderConceptCard(concept, concept.user_id === user?.id))
              : sortedMine.map((concept) => renderConceptCard(concept, true))}
          </div>
        )}
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">{editingConcept ? 'Edit Concept' : 'Share a Concept'}</h2>
              <button
                onClick={resetForm}
                className="text-gray-500 hover:text-gray-700 px-2 py-1 rounded-md"
                type="button"
              >
                Close
              </button>
            </div>
            <form onSubmit={handleSubmit} className="px-6 py-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Title *</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-400"
                  placeholder="Succulent Care Concept"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Summary</label>
                <input
                  type="text"
                  value={form.summary}
                  onChange={(e) => setForm({ ...form, summary: e.target.value })}
                  className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-400"
                  placeholder="A quick overview of your concept"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Technique / Steps</label>
                <textarea
                  value={form.technique_steps}
                  onChange={(e) => setForm({ ...form, technique_steps: e.target.value })}
                  rows={4}
                  className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-400"
                  placeholder="List the steps or key ideas for this technique..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Tips</label>
                <textarea
                  value={form.tips}
                  onChange={(e) => setForm({ ...form, tips: e.target.value })}
                  rows={3}
                  className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-400"
                  placeholder="Any additional advice or reminders..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Tags</label>
                <input
                  type="text"
                  value={form.tags}
                  onChange={(e) => setForm({ ...form, tags: e.target.value })}
                  className="mt-1 w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-400"
                  placeholder="watering, propagation, succulents"
                />
                <p className="mt-1 text-xs text-gray-500">Separate tags with commas</p>
              </div>
              <div className="flex items-center gap-2">
                <input
                  id="concept_public"
                  type="checkbox"
                  checked={form.is_public}
                  onChange={(e) => setForm({ ...form, is_public: e.target.checked })}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <label htmlFor="concept_public" className="text-sm text-gray-700">
                  Make concept public for the community
                </label>
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 rounded-md border border-gray-200 text-gray-600 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 rounded-md bg-primary-600 text-white hover:bg-primary-700 disabled:opacity-60 inline-flex items-center gap-2"
                >
                  {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  {editingConcept ? 'Update Concept' : 'Share Concept'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default ConceptHub

