import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Upload, File, Loader2, CheckCircle2 } from 'lucide-react';

function ResourceShareModal({ isOpen, onClose, roomId, onUploadSuccess }) {
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadComplete, setUploadComplete] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    setError('');
    const selectedFile = e.target.files[0];
    if (selectedFile) {
        if (selectedFile.size > 10 * 1024 * 1024) { // 10MB limit
            setError('File exceeds 10MB limit.');
            return;
        }
        setFile(selectedFile);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setError('');
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
        if (droppedFile.size > 10 * 1024 * 1024) {
            setError('File exceeds 10MB limit.');
            return;
        }
        setFile(droppedFile);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file first.');
      return;
    }

    setIsUploading(true);
    setError('');

    const formData = new FormData();
    formData.append('resourceFile', file);
    formData.append('roomId', roomId);

    try {
        // Assume API url is locally hosted and Auth cookies are sent automatically
        const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5001'}/api/resources/upload`, {
            method: 'POST',
            body: formData,
            // fetch automatically handles Content-Type for FormData
        });

        const data = await response.json();

        if (data.success) {
            setUploadComplete(true);
            setTimeout(() => {
                onUploadSuccess(data.resource);
                onClose();
                // Reset State
                setFile(null);
                setUploadComplete(false);
                setIsUploading(false);
            }, 1500);
        } else {
            setError(data.message || 'Upload failed.');
            setIsUploading(false);
        }
    } catch (err) {
        setError('Network error occurred during upload.');
        setIsUploading(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        {/* Backdrop overlay */}
        <motion.div
           initial={{ opacity: 0 }}
           animate={{ opacity: 1 }}
           exit={{ opacity: 0 }}
           onClick={onClose}
           className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        />

        {/* Modal body */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-white/10 overflow-hidden"
        >
          {/* Header */}
          <div className="px-6 py-4 flex justify-between items-center border-b border-slate-100 dark:border-white/5">
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">Share Resource</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Upload files up to 10MB. Earn +10pts!</p>
            </div>
            <button 
              onClick={onClose}
              disabled={isUploading}
              className="p-2 -mr-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6">
            {!uploadComplete ? (
              <>
                {/* Drag / Drop Area */}
                <div 
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`
                    w-full h-48 border-2 border-dashed rounded-xl flex flex-col items-center justify-center cursor-pointer transition-all
                    ${file ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-500/10' : 'border-slate-300 dark:border-slate-700 hover:border-indigo-400 hover:bg-slate-50 dark:hover:bg-slate-800/50'}
                  `}
                >
                  <input 
                    type="file" 
                    className="hidden" 
                    ref={fileInputRef} 
                    onChange={handleFileChange}
                    accept="image/*,.pdf,.doc,.docx,.txt"
                  />
                  
                  {file ? (
                    <div className="text-center">
                      <File className="w-12 h-12 text-indigo-500 mx-auto mb-3" />
                      <p className="text-sm font-medium text-slate-900 dark:text-white break-all">{file.name}</p>
                      <p className="text-xs text-slate-500 mt-1">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                  ) : (
                    <div className="text-center px-4">
                      <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-500/10 rounded-full flex items-center justify-center mx-auto mb-3">
                         <Upload className="w-6 h-6 text-indigo-500" />
                      </div>
                      <p className="text-sm font-medium text-slate-900 dark:text-white">Click to upload or drag and drop</p>
                      <p className="text-xs text-slate-500 mt-1">PDF, JPG, PNG, DOC (max. 10MB)</p>
                    </div>
                  )}
                </div>

                {error && <p className="text-sm text-red-500 mt-3">{error}</p>}

                {/* Footer Buttons */}
                <div className="mt-6 flex justify-end gap-3">
                  <button 
                    onClick={onClose}
                    disabled={isUploading}
                    className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleUpload}
                    disabled={!file || isUploading}
                    className="flex items-center gap-2 px-5 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isUploading ? (
                        <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Uploading...
                        </>
                    ) : (
                        'Upload & Share'
                    )}
                  </button>
                </div>
              </>
            ) : (
                /* Success State */
                <div className="py-10 flex flex-col items-center justify-center text-center">
                    <motion.div 
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-16 h-16 bg-emerald-100 dark:bg-emerald-500/20 rounded-full flex items-center justify-center mb-4 text-emerald-600 dark:text-emerald-400"
                    >
                        <CheckCircle2 className="w-8 h-8" />
                    </motion.div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">File Uploaded!</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                        We're sharing it with the room and you earned +10 points!
                    </p>
                </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

export default ResourceShareModal;
