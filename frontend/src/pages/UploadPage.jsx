import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDropzone } from 'react-dropzone'
import toast from 'react-hot-toast'
import { Upload, FileText, X, ArrowLeft, Sparkles } from 'lucide-react'
import { useAnalysis } from '../hooks/useAnalysis'
import { analyzeCVForPortfolio } from '../services/geminiService'
import { fileToBase64, formatFileSize } from '../utils/helpers'

const loadingMessages = [
  'Reading your CV…',
  'Extracting skills & experience…',
  'Analyzing project quality…',
  'Scoring your portfolio readiness…',
  'Writing improvement suggestions…',
  'Almost ready…',
]

export default function UploadPage() {
  const navigate = useNavigate()
  const { setAnalysisResult, setUploadedFile } = useAnalysis()
  const [file, setFile] = useState(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [loadingIdx, setLoadingIdx] = useState(0)

  const onDrop = useCallback((accepted, rejected) => {
    if (rejected.length > 0) { toast.error('Please upload a PDF file only.'); return }
    if (accepted[0].size > 10 * 1024 * 1024) { toast.error('File too large. Max 10MB.'); return }
    setFile(accepted[0])
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    maxFiles: 1,
  })

  const handleAnalyze = async () => {
    if (!file) { toast.error('Please upload your CV first.'); return }
    setIsAnalyzing(true)
    const interval = setInterval(() => setLoadingIdx(p => (p + 1) % loadingMessages.length), 2000)
    try {
      const pdfBase64 = await fileToBase64(file)
      const result = await analyzeCVForPortfolio({ pdfBase64 })
      setAnalysisResult(result)
      setUploadedFile({ name: file.name, size: file.size })
      // Save to backend if logged in
      try {
        const { api } = await import('../services/api')
        await api.saveAnalysis({
          candidateName: result.personal?.name || 'Unknown',
          candidateTitle: result.personal?.title || '',
          overallScore: result.overall_score || 0,
          resultJson: JSON.stringify(result),
          selectedTemplateId: null,
        })
      } catch (e) { /* not logged in or limit reached — still show result */ }
      navigate('/result')
    } catch (err) {
      console.error(err)
      toast.error(err.message || 'Analysis failed. Check your API key and try again.')
    } finally {
      clearInterval(interval)
      setIsAnalyzing(false)
    }
  }

  return (
    <div className="min-h-screen bg-canvas-50 grain flex flex-col">
      {/* Nav */}
      <nav className="flex items-center justify-between px-8 py-6 max-w-3xl mx-auto w-full">
        <button onClick={() => navigate('/')} className="flex items-center gap-2 text-canvas-400 hover:text-canvas-950 transition-colors text-sm">
          <ArrowLeft size={16} /> Back
        </button>
        <div className="flex items-center gap-1.5">
          <span className="font-display text-xl font-semibold text-canvas-950">folio</span>
          <span className="w-1.5 h-1.5 rounded-full bg-gold" />
        </div>
        <div className="w-16" />
      </nav>

      <div className="max-w-xl mx-auto px-6 py-10 flex-1 w-full">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="font-display text-5xl font-semibold text-canvas-950 mb-3">Upload your CV</h1>
          <p className="text-canvas-400">We'll analyze it and prepare your portfolio data.</p>
        </div>

        {/* Drop zone */}
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all mb-6 ${
            isDragActive
              ? 'border-gold bg-gold-muted'
              : file
              ? 'border-teal bg-teal-muted'
              : 'border-canvas-200 hover:border-gold/60 hover:bg-gold-muted/30'
          }`}
        >
          <input {...getInputProps()} />
          {file ? (
            <div>
              <div className="w-14 h-14 bg-teal-muted rounded-2xl flex items-center justify-center mx-auto mb-4">
                <FileText size={26} className="text-teal" />
              </div>
              <p className="font-medium text-canvas-950 text-lg">{file.name}</p>
              <p className="text-canvas-400 text-sm mt-1">{formatFileSize(file.size)}</p>
              <button
                onClick={e => { e.stopPropagation(); setFile(null) }}
                className="inline-flex items-center gap-1.5 text-canvas-400 hover:text-danger text-sm mt-3 transition-colors"
              >
                <X size={14} /> Remove
              </button>
            </div>
          ) : (
            <div>
              <div className="w-14 h-14 bg-canvas-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Upload size={26} className="text-canvas-400" />
              </div>
              <p className="font-medium text-canvas-950 text-lg mb-1">
                {isDragActive ? 'Drop it here!' : 'Drag & drop your CV'}
              </p>
              <p className="text-canvas-400 text-sm">PDF format · Max 10MB</p>
            </div>
          )}
        </div>

        {/* Analyze button */}
        <button
          onClick={handleAnalyze}
          disabled={!file || isAnalyzing}
          className={`w-full py-4 rounded-2xl font-medium text-base flex items-center justify-center gap-3 transition-all ${
            !file || isAnalyzing
              ? 'bg-canvas-100 text-canvas-400 cursor-not-allowed'
              : 'bg-canvas-950 text-canvas-50 hover:bg-gold hover:text-canvas-950'
          }`}
        >
          {isAnalyzing ? (
            <>
              <div className="w-5 h-5 border-2 border-canvas-400 border-t-canvas-950 rounded-full animate-spin" />
              {loadingMessages[loadingIdx]}
            </>
          ) : (
            <>
              <Sparkles size={18} />
              Analyze & Build Portfolio
            </>
          )}
        </button>

        {/* API key note */}
        {/* <div className="mt-6 bg-gold-muted border border-gold/20 rounded-xl p-4"> */}
          {/* <p className="text-canvas-700 text-sm">
            <strong>Setup:</strong> Get your free API key at{' '}
            <a href="https://console.groq.com" target="_blank" rel="noreferrer" className="underline text-gold-dark">console.groq.com</a>
            {' '}→ API Keys → Create API Key, then add it to a{' '}
            <code className="bg-gold/20 px-1.5 py-0.5 rounded font-mono text-xs">.env</code> file:{' '}
            <code className="bg-gold/20 px-1.5 py-0.5 rounded font-mono text-xs">VITE_GROQ_API_KEY=your-key</code>
          </p> */}
        {/* </div> */}
      </div>
    </div>
  )
}
