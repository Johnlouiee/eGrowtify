import React from 'react'
import { ChevronDown, ChevronUp, MoreVertical, Eye, Edit, Trash2, Download, Share2 } from 'lucide-react'

const AdminDataTable = ({
  data = [],
  columns = [],
  loading = false,
  onRowClick,
  onEdit,
  onDelete,
  onView,
  onDownload,
  onShare,
  bulkActions = [],
  selectedRows = [],
  onRowSelect,
  onSelectAll,
  sortBy,
  sortOrder,
  onSort,
  viewMode = 'table', // table, grid, list
  onViewModeChange,
  viewModes = [
    { id: 'table', icon: MoreVertical, title: 'Table View' },
    { id: 'grid', icon: MoreVertical, title: 'Grid View' },
    { id: 'list', icon: MoreVertical, title: 'List View' }
  ],
  emptyMessage = 'No data available',
  className = ''
}) => {
  const handleSort = (column) => {
    if (onSort) {
      const newOrder = sortBy === column && sortOrder === 'asc' ? 'desc' : 'asc'
      onSort(column, newOrder)
    }
  }

  const getSortIcon = (column) => {
    if (sortBy !== column) return null
    return sortOrder === 'asc' ? 
      <ChevronUp className="h-4 w-4" /> : 
      <ChevronDown className="h-4 w-4" />
  }

  const renderCell = (item, column) => {
    if (column.render) {
      return column.render(item[column.key], item, column)
    }
    return item[column.key]
  }

  const renderTable = () => (
    <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-slate-200/50 overflow-hidden hover:shadow-lg transition-all duration-300">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              {bulkActions.length > 0 && (
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedRows.length === data.length && data.length > 0}
                    onChange={(e) => onSelectAll && onSelectAll(e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                </th>
              )}
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={`px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider ${
                    column.sortable ? 'cursor-pointer hover:text-slate-700' : ''
                  }`}
                  onClick={() => column.sortable && handleSort(column.key)}
                >
                  <div className="flex items-center space-x-1">
                    <span>{column.title}</span>
                    {column.sortable && getSortIcon(column.key)}
                  </div>
                </th>
              ))}
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-200">
            {data.map((item, index) => (
              <tr
                key={item.id || index}
                className={`hover:bg-slate-50 transition-colors duration-200 ${
                  onRowClick ? 'cursor-pointer' : ''
                }`}
                onClick={() => onRowClick && onRowClick(item)}
              >
                {bulkActions.length > 0 && (
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedRows.includes(item.id)}
                      onChange={(e) => onRowSelect && onRowSelect(item.id, e.target.checked)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      onClick={(e) => e.stopPropagation()}
                    />
                  </td>
                )}
                {columns.map((column) => (
                  <td key={column.key} className="px-6 py-4 whitespace-nowrap">
                    {renderCell(item, column)}
                  </td>
                ))}
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex items-center space-x-2">
                    {onView && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          onView(item)
                        }}
                        className="text-blue-600 hover:text-blue-900 flex items-center px-2 py-1 rounded-lg hover:bg-blue-50 transition-all duration-200"
                        title="View"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                    )}
                    {onEdit && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          onEdit(item)
                        }}
                        className="text-green-600 hover:text-green-900 flex items-center px-2 py-1 rounded-lg hover:bg-green-50 transition-all duration-200"
                        title="Edit"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                    )}
                    {onDownload && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          onDownload(item)
                        }}
                        className="text-purple-600 hover:text-purple-900 flex items-center px-2 py-1 rounded-lg hover:bg-purple-50 transition-all duration-200"
                        title="Download"
                      >
                        <Download className="h-4 w-4" />
                      </button>
                    )}
                    {onShare && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          onShare(item)
                        }}
                        className="text-indigo-600 hover:text-indigo-900 flex items-center px-2 py-1 rounded-lg hover:bg-indigo-50 transition-all duration-200"
                        title="Share"
                      >
                        <Share2 className="h-4 w-4" />
                      </button>
                    )}
                    {onDelete && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          onDelete(item)
                        }}
                        className="text-red-600 hover:text-red-900 flex items-center px-2 py-1 rounded-lg hover:bg-red-50 transition-all duration-200"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )

  const renderGrid = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {data.map((item, index) => (
        <div
          key={item.id || index}
          className="group relative overflow-hidden bg-white/70 backdrop-blur-sm rounded-2xl border border-slate-200/50 hover:border-blue-300/50 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="relative p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-slate-900 mb-2">
                  {item.title || item.name || `Item ${index + 1}`}
                </h3>
                <p className="text-sm text-slate-600 line-clamp-2">
                  {item.description || item.summary || 'No description available'}
                </p>
              </div>
              {bulkActions.length > 0 && (
                <input
                  type="checkbox"
                  checked={selectedRows.includes(item.id)}
                  onChange={(e) => onRowSelect && onRowSelect(item.id, e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
              )}
            </div>
            
            <div className="space-y-2 mb-4">
              {columns.slice(0, 3).map((column) => (
                <div key={column.key} className="flex items-center text-sm text-slate-500">
                  <span className="font-medium text-slate-700 mr-2">{column.title}:</span>
                  <span>{renderCell(item, column)}</span>
                </div>
              ))}
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                {onView && (
                  <button
                    onClick={() => onView(item)}
                    className="flex items-center px-3 py-2 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded-xl transition-all duration-200"
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    <span className="text-sm font-medium">View</span>
                  </button>
                )}
                {onEdit && (
                  <button
                    onClick={() => onEdit(item)}
                    className="flex items-center px-3 py-2 text-green-600 hover:text-green-900 hover:bg-green-50 rounded-xl transition-all duration-200"
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    <span className="text-sm font-medium">Edit</span>
                  </button>
                )}
              </div>
              {onDelete && (
                <button
                  onClick={() => onDelete(item)}
                  className="flex items-center px-3 py-2 text-red-600 hover:text-red-900 hover:bg-red-50 rounded-xl transition-all duration-200"
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  <span className="text-sm font-medium">Delete</span>
                </button>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  )

  const renderList = () => (
    <div className="space-y-4">
      {data.map((item, index) => (
        <div
          key={item.id || index}
          className="group bg-white/70 backdrop-blur-sm rounded-xl border border-slate-200/50 hover:border-blue-300/50 transition-all duration-300 hover:shadow-lg"
        >
          <div className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-4">
                {bulkActions.length > 0 && (
                  <input
                    type="checkbox"
                    checked={selectedRows.includes(item.id)}
                    onChange={(e) => onRowSelect && onRowSelect(item.id, e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mt-1"
                  />
                )}
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">
                    {item.title || item.name || `Item ${index + 1}`}
                  </h3>
                  <p className="text-slate-600 mb-3">
                    {item.description || item.summary || 'No description available'}
                  </p>
                  <div className="flex items-center space-x-6">
                    {columns.slice(0, 4).map((column) => (
                      <div key={column.key} className="flex items-center text-sm text-slate-500">
                        <span className="font-medium text-slate-700 mr-2">{column.title}:</span>
                        <span>{renderCell(item, column)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {onView && (
                  <button
                    onClick={() => onView(item)}
                    className="flex items-center px-3 py-2 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded-lg transition-all duration-200"
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    View
                  </button>
                )}
                {onEdit && (
                  <button
                    onClick={() => onEdit(item)}
                    className="flex items-center px-3 py-2 text-green-600 hover:text-green-900 hover:bg-green-50 rounded-lg transition-all duration-200"
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </button>
                )}
                {onDelete && (
                  <button
                    onClick={() => onDelete(item)}
                    className="flex items-center px-3 py-2 text-red-600 hover:text-red-900 hover:bg-red-50 rounded-lg transition-all duration-200"
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Delete
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )

  if (loading) {
    return (
      <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-slate-200/50 p-8">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-slate-600">Loading data...</span>
        </div>
      </div>
    )
  }

  if (data.length === 0) {
    return (
      <div className="bg-white/70 backdrop-blur-sm rounded-2xl border border-slate-200/50 p-8 text-center">
        <div className="text-slate-400 mb-4">
          <MoreVertical className="h-12 w-12 mx-auto" />
        </div>
        <h3 className="text-lg font-medium text-slate-900 mb-2">No data available</h3>
        <p className="text-slate-600">{emptyMessage}</p>
      </div>
    )
  }

  return (
    <div className={className}>
      {viewMode === 'table' && renderTable()}
      {viewMode === 'grid' && renderGrid()}
      {viewMode === 'list' && renderList()}
    </div>
  )
}

export default AdminDataTable
