"use client";
import { useState } from "react";

export default function Home() {
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [result, setResult] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setResult(null);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/predict`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          subject,
          body,
        }),
      });

      const data = await res.json();
      setResult(JSON.stringify(data));
    } catch (error) {
      console.error("❌ Fetch failed:", error);
      setResult("Error: Could not connect to backend");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main
      className="min-h-screen text-green-400 font-mono bg-cover bg-center"
      style={{
        backgroundImage: "url('/matrix-rain-v2.png')",
        backgroundRepeat: "repeat",
        backgroundSize: "cover",
        backgroundColor: "#000",
      }}
    >
      <div className="flex flex-col items-center justify-center min-h-screen bg-black bg-opacity-70 p-8">
        {/* Logo + Header */}
        <div className="flex flex-col items-center mb-6 border border-green-400 bg-black bg-opacity-80 px-6 py-4 rounded-lg">
          <img src="/a34.png" alt="Decrypt Mike Logo" className="h-20 mb-2" />
          <h1 className="text-3xl font-bold text-center">
            Decrypt Mike AI Phishing Detector
          </h1>
        </div>

        {/* Email Analyzer */}
        <div className="w-full max-w-2xl bg-black bg-opacity-80 rounded-lg p-6 border border-green-400">
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm mb-1">Email Subject</label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-4 py-2 bg-black border border-green-400 rounded text-green-400 placeholder-green-600 focus:outline-none"
                placeholder="e.g. Update your account info"
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Email Body</label>
              <textarea
                rows={6}
                value={body}
                onChange={(e) => setBody(e.target.value)}
                className="w-full px-4 py-2 bg-black border border-green-400 rounded text-green-400 placeholder-green-600 focus:outline-none"
                placeholder="Paste the email message here..."
              ></textarea>
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className={`${
                isLoading ? "bg-green-800 cursor-not-allowed" : "bg-green-400 hover:bg-green-300"
              } text-black font-bold py-2 px-4 rounded transition`}
            >
              {isLoading ? "Analyzing..." : "Analyze Email"}
            </button>
          </form>

          {/* Loader */}
          {isLoading && (
            <div className="flex justify-center mt-6">
              <img
                src="/robot-run.gif"
                alt="Loading animation"
                className="h-24 w-auto animate-pulse"
              />
            </div>
          )}

          {/* Result Box */}
          {result && !isLoading && (() => {
            const parsed = JSON.parse(result);
            const label = parsed.label.toLowerCase();
            const confidence = parsed.confidence;

            const emotionIcons: { [key: string]: string } = {
              joy: "✅",
              love: "💚",
              surprise: "🤯",
              anger: "⚠️",
              sadness: "😢",
              fear: "❌",
              disgust: "🚫",
            };

            const emotionColors: { [key: string]: string } = {
              joy: "text-green-400 border-green-400",
              love: "text-pink-400 border-pink-400",
              surprise: "text-yellow-400 border-yellow-400",
              anger: "text-red-400 border-red-400",
              sadness: "text-blue-400 border-blue-400",
              fear: "text-orange-400 border-orange-400",
              disgust: "text-purple-400 border-purple-400",
            };

            const icon = emotionIcons[label] || "🤖";
            const colorClass = emotionColors[label] || "text-white border-white";

            return (
              <div className={`mt-4 p-4 border rounded ${colorClass} bg-black bg-opacity-80`}>
                <p className="text-xl font-bold">
                  {icon} Detected Emotion: {label.toUpperCase()}
                </p>
                <p className="text-sm mt-1">Confidence: {confidence}%</p>
              </div>
            );
          })()}
        </div>
      </div>
    </main>
  );
}