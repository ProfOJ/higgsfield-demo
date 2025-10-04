"use client";

import { useState, useEffect } from "react";
import MotionSelector from "@/components/MotionSelector";
import ModelSelector from "@/components/ModelSelector";
import type { Motion, GenerateVideoResponse } from "@/types/common";

export default function Home() {
  const [motions, setMotions] = useState<Motion[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [selectedMotionId, setSelectedMotionId] = useState<string>("");
  const [strength, setStrength] = useState<number>(0.8);
  const [selectedModel, setSelectedModel] = useState<"lite" | "standard" | "turbo">("turbo");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [result, setResult] = useState<GenerateVideoResponse | null>(null);

  // Fetch motions on mount
  useEffect(() => {
    fetch("/api/motions")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setMotions(data);
        }
      })
      .catch((err) => console.error("Failed to fetch motions:", err));
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setError("");
      setResult(null);
    }
  };

  const handleGenerate = async () => {
    if (!selectedFile) {
      setError("Please select an image first");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const formData = new FormData();
      formData.append("image", selectedFile);
      formData.append("model", selectedModel);
      if (selectedMotionId) {
        formData.append("motionId", selectedMotionId);
        formData.append("strength", strength.toString());
      }

      const response = await fetch("/api/generate", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate video");
      }

      setResult(data);
    } catch (err: unknown) {
      const error = err as Error;
      setError(error.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-4 sm:p-8">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-bold mb-3 bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
            🦖 Jurassic Park Video Generator
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Turn your photos into epic Jurassic Park-style videos with dinosaurs entering the scene
          </p>
        </header>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 sm:p-8 space-y-6">
          {/* File Upload */}
          <div>
            <label htmlFor="image-upload" className="block text-sm font-medium mb-2">
              Upload Image
            </label>
            <input
              id="image-upload"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              capture="environment"
              onChange={handleFileChange}
              disabled={loading}
              className="w-full p-3 border border-gray-300 rounded-lg cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100 disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>

          {/* Image Preview */}
          {previewUrl && (
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={previewUrl}
                alt="Preview"
                className="w-full h-auto max-h-96 object-contain"
              />
            </div>
          )}

          {/* Model Selector */}
          <ModelSelector
            selectedModel={selectedModel}
            onModelChange={setSelectedModel}
            disabled={loading}
          />

          {/* Motion Selector */}
          <MotionSelector
            motions={motions}
            selectedMotionId={selectedMotionId}
            strength={strength}
            onMotionChange={setSelectedMotionId}
            onStrengthChange={setStrength}
            disabled={loading}
          />

          {/* Generate Button */}
          <button
            onClick={handleGenerate}
            disabled={!selectedFile || loading}
            className="w-full py-4 px-6 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-lg shadow-lg hover:from-green-700 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Generating... (this may take 30-60 seconds)
              </span>
            ) : (
              "🎬 Generate Jurassic Park Video"
            )}
          </button>

          {/* Error Display */}
          {error && (
            <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-red-800 dark:text-red-200 font-medium">❌ {error}</p>
            </div>
          )}

          {/* Result Display */}
          {result && result.success && (
            <div className="space-y-4">
              <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                <p className="text-green-800 dark:text-green-200 font-medium mb-2">
                  ✅ Video generated successfully!
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Job ID: {result.jobSetId}
                </p>
              </div>

              <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                <video src={result.videoUrl} controls autoPlay loop className="w-full">
                  Your browser does not support the video tag.
                </video>
              </div>

              <div className="flex gap-4">
                <a
                  href={result.videoUrl}
                  download
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-3 px-4 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 text-center transition-colors"
                >
                  📥 Download Full Video
                </a>
                <a
                  href={result.previewUrl}
                  download
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-3 px-4 bg-gray-600 text-white font-medium rounded-lg hover:bg-gray-700 text-center transition-colors"
                >
                  📥 Download Preview
                </a>
              </div>
            </div>
          )}
        </div>

        <footer className="text-center mt-8 text-sm text-gray-500 dark:text-gray-400">
          <p>Powered by Higgsfield AI • Built with Next.js</p>
        </footer>
      </div>
    </div>
  );
}
