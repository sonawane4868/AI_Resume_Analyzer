"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { Upload } from "lucide-react";
import { useRouter } from "next/navigation";

export default function UploadModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleUpload = () => {
    if (!file) return;
    setLoading(true);
  };

  // fake processing → redirect
  useEffect(() => {
    if (!loading) return;

    const timer = setTimeout(() => {
      router.push("/dashboard");
    }, 2500);

    return () => clearTimeout(timer);
  }, [loading, router]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-[#11161C] border border-gray-800 rounded-xl p-8 w-[420px] text-center relative"
          >
            {/* CLOSE BUTTON */}
            <button
              onClick={onClose}
              className="absolute top-3 right-3 text-gray-500 hover:text-white"
            >
              ✕
            </button>

            {!loading ? (
              <>
                <h2 className="text-white text-xl mb-4">
                  Upload Resume
                </h2>

                <label className="flex flex-col items-center justify-center border border-dashed border-gray-600 rounded-lg p-6 cursor-pointer hover:border-green-400 transition">
                  <Upload className="text-green-400 mb-2" />
                  <span className="text-gray-400 text-sm">
                    Click to upload PDF
                  </span>

                  <input
                    type="file"
                    accept="application/pdf"
                    className="hidden"
                    onChange={(e) =>
                      setFile(e.target.files?.[0] || null)
                    }
                  />
                </label>

                {file && (
                  <p className="text-gray-300 text-sm mt-3">
                    {file.name}
                  </p>
                )}

                <button
                  onClick={handleUpload}
                  disabled={!file}
                  className="mt-6 px-6 py-3 bg-green-400 text-black rounded-lg w-full disabled:opacity-50"
                >
                  Analyze Resume
                </button>
              </>
            ) : (
              <Processing />
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}


function Processing() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(interval);
          return 100;
        }
        return p + 4;
      });
    }, 100);

    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <p className="text-gray-400 mb-4">
        Analyzing Resume...
      </p>

      <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-green-400"
          animate={{ width: `${progress}%` }}
          transition={{ ease: "easeOut" }}
        />
      </div>

      <p className="text-green-400 mt-4 text-sm">
        {progress < 30 && "Extracting data..."}
        {progress >= 30 && progress < 70 && "Matching keywords..."}
        {progress >= 70 && "Generating insights..."}
      </p>
    </div>
  );
}