import { createContext, useContext, useState } from 'react'

const AnalysisContext = createContext(null)

export function AnalysisProvider({ children }) {
  const [analysisResult, setAnalysisResult] = useState(null)
  const [uploadedFile, setUploadedFile] = useState(null)
  const [selectedTemplate, setSelectedTemplate] = useState(null)

  return (
    <AnalysisContext.Provider value={{
      analysisResult, setAnalysisResult,
      uploadedFile, setUploadedFile,
      selectedTemplate, setSelectedTemplate,
    }}>
      {children}
    </AnalysisContext.Provider>
  )
}

export function useAnalysis() {
  const ctx = useContext(AnalysisContext)
  if (!ctx) throw new Error('useAnalysis must be used inside AnalysisProvider')
  return ctx
}
