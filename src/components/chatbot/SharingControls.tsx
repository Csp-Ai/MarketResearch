import React, { useState } from 'react';
import { Copy, Share2, Code, QrCode, ExternalLink } from 'lucide-react';

interface SharingControlsProps {
  chatbotId: string;
  chatbotName: string;
}

export default function SharingControls({ chatbotId, chatbotName }: SharingControlsProps) {
  const [activeTab, setActiveTab] = useState<'link' | 'embed' | 'qr'>('link');
  const [copied, setCopied] = useState(false);

  const shareUrl = `${window.location.origin}/chat/${chatbotId}`;
  const embedCode = `<script src="${window.location.origin}/embed.js"></script>
<iframe src="${window.location.origin}/embed/${chatbotId}" width="350" height="500" frameborder="0"></iframe>`;

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const generateQRCode = () => {
    // You can use a QR code library like qrcode.react
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(shareUrl)}`;
    return qrUrl;
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold mb-4">Share Your Chatbot</h3>
      
      {/* Tab Navigation */}
      <div className="flex border-b border-gray-200 mb-4">
        <button
          onClick={() => setActiveTab('link')}
          className={`flex items-center gap-2 px-4 py-2 font-medium ${
            activeTab === 'link' 
              ? 'text-blue-600 border-b-2 border-blue-600' 
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <Share2 className="w-4 h-4" />
          Direct Link
        </button>
        <button
          onClick={() => setActiveTab('embed')}
          className={`flex items-center gap-2 px-4 py-2 font-medium ${
            activeTab === 'embed' 
              ? 'text-blue-600 border-b-2 border-blue-600' 
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <Code className="w-4 h-4" />
          Embed Code
        </button>
        <button
          onClick={() => setActiveTab('qr')}
          className={`flex items-center gap-2 px-4 py-2 font-medium ${
            activeTab === 'qr' 
              ? 'text-blue-600 border-b-2 border-blue-600' 
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <QrCode className="w-4 h-4" />
          QR Code
        </button>
      </div>

      {/* Tab Content */}
      <div className="space-y-4">
        {activeTab === 'link' && (
          <div>
            <p className="text-sm text-gray-600 mb-2">
              Share this link with anyone to let them chat with your {chatbotName}:
            </p>
            <div className="flex gap-2">
              <input
                type="text"
                value={shareUrl}
                readOnly
                className="flex-1 px-3 py-2 border rounded text-sm"
              />
              <button
                onClick={() => copyToClipboard(shareUrl)}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center gap-2"
              >
                <Copy className="w-4 h-4" />
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
            <a
              href={shareUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm mt-2"
            >
              <ExternalLink className="w-4 h-4" />
              Open in new tab
            </a>
          </div>
        )}

        {activeTab === 'embed' && (
          <div>
            <p className="text-sm text-gray-600 mb-2">
              Add this code to your website to embed the chatbot:
            </p>
            <div className="bg-gray-50 rounded p-3 mb-3">
              <pre className="text-xs text-gray-800 overflow-x-auto">
                <code>{embedCode}</code>
              </pre>
            </div>
            <button
              onClick={() => copyToClipboard(embedCode)}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center gap-2"
            >
              <Copy className="w-4 h-4" />
              {copied ? 'Copied!' : 'Copy Embed Code'}
            </button>
          </div>
        )}

        {activeTab === 'qr' && (
          <div>
            <p className="text-sm text-gray-600 mb-4">
              Scan this QR code to open the chatbot on mobile:
            </p>
            <div className="flex justify-center">
              <img
                src={generateQRCode()}
                alt="QR Code"
                className="border border-gray-200 rounded"
              />
            </div>
            <div className="text-center mt-4">
              <button
                onClick={() => copyToClipboard(shareUrl)}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center gap-2 mx-auto"
              >
                <Copy className="w-4 h-4" />
                Copy Link
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 