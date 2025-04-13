import { useState } from 'react'

function App() {
  const [url, setUrl] = useState('')
  const [shortenedUrl, setShortenedUrl] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!url) {
      setError('Please enter a URL')
      return
    }
    
    setLoading(true)
    setError('')
    try {
      const response = await fetch('https://urlshortbackend-2phu.onrender.com/url/shorten', {
        // const response = await fetch('http://localhost:3000/url/shorten', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ originalURL: url })
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to shorten URL')
      }
      
      const data = await response.json()
      console.log(data)
      setShortenedUrl(`https://urlshortbackend-2phu.onrender.com/${data.id}`)
      // setShortenedUrl(`http://localhost:3000/${data.id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to shorten URL. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">URL Shortener</h1>
          <p className="text-gray-400">Shorten your long URLs in seconds</p>
        </div>

        <div className="bg-gray-800 rounded-2xl shadow-2xl p-8 border border-gray-700">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="url" className="block text-sm font-medium text-gray-300 mb-2">
                Enter your URL
              </label>
              <input
                type="url"
                id="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com"
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                required
              />
            </div>

            {error && (
              <div className="text-red-400 text-sm">{error}</div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-purple-600 text-white py-3 px-4 rounded-xl hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              {loading ? 'Shortening...' : 'Shorten URL'}
            </button>
          </form>

          <div className="mt-8 p-6 bg-gray-700 rounded-xl border border-gray-600">
            <p className="text-sm text-gray-300 mb-3">Your shortened URL:</p>
            <div className="flex items-center space-x-3">
              <input
                type="text"
                value={shortenedUrl || 'Your shortened URL will appear here'}
                readOnly
                className="flex-1 px-4 py-3 bg-gray-800 border border-gray-600 rounded-xl text-white text-sm"
              />
              <button
                onClick={() => {
                  if (shortenedUrl) {
                    navigator.clipboard.writeText(shortenedUrl)
                  }
                }}
                disabled={!shortenedUrl}
                className="px-4 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                Copy
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
