import React, { useEffect, useState } from 'react';
import { X, QrCode, Copy, Check, Sparkles, Smartphone, Download } from 'lucide-react';
import QRCode from 'qrcode';

export function QRCodeModal({ onClose }) {
  const [qrDataUrl, setQrDataUrl] = useState('');
  const [copied, setCopied] = useState(false);
  const currentUrl = window.location.href;

  useEffect(() => {
    QRCode.toDataURL(currentUrl, {
      width: 400,
      margin: 2,
      color: {
        dark: '#0A0A0C',
        light: '#F3E5AB'
      }
    })
      .then(url => setQrDataUrl(url))
      .catch(err => console.error('QR code generation failed:', err));
  }, [currentUrl]);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(currentUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.error('Copy link failed:', err);
    }
  };

  const handleDownloadQr = () => {
    if (!qrDataUrl) return;
    const link = document.createElement('a');
    link.href = qrDataUrl;
    link.download = 'Sri_Lakshmi_Sai_Teja_Wedding_Gallery_QR.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0A0A0C]/90 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-md glass-panel-gold rounded-3xl p-6 sm:p-8 border border-[#D4AF37] shadow-2xl text-center">

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-[#14141A] hover:bg-[#1D1D26] text-[#F3E5AB] border border-[#D4AF37]/30 transition-all cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <div className="w-14 h-14 rounded-full glass-panel flex items-center justify-center mx-auto mb-4 border border-[#D4AF37]">
          <QrCode className="w-7 h-7 text-[#D4AF37]" />
        </div>

        <h3 className="text-2xl font-extrabold font-serif-luxury gold-gradient-text">
          Scan Venue QR Code
        </h3>
        <p className="text-xs text-[#C5BBAA] mt-1 mb-6">
          Guests can point their phone camera to instantly access the Live Tethered Photo Stream!
        </p>

        {/* QR Canvas Box */}
        <div className="bg-[#FAF6EE] p-4 rounded-2xl inline-block shadow-2xl border-2 border-[#D4AF37] mb-6 relative group">
          {qrDataUrl ? (
            <img src={qrDataUrl} alt="Wedding Gallery QR Code" className="w-56 h-56 mx-auto rounded-lg" />
          ) : (
            <div className="w-56 h-56 flex items-center justify-center">
              <Sparkles className="w-8 h-8 text-[#D4AF37] animate-spin" />
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3">
          <button
            onClick={handleCopyLink}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#14141A] hover:bg-[#1D1D26] text-[#F3E5AB] border border-[#D4AF37]/40 text-xs font-semibold transition-all cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span className="text-emerald-400">Venue Link Copied to Clipboard!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-[#D4AF37]" />
                <span>Copy Mobile Gallery Link</span>
              </>
            )}
          </button>

          <button
            onClick={handleDownloadQr}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#AA820A] text-[#0A0A0C] font-bold text-xs shadow-lg hover:brightness-110 active:scale-95 transition-all cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Download Printable QR Image</span>
          </button>
        </div>

        <p className="text-[10px] text-[#8C8270] mt-4 flex items-center justify-center gap-1">
          <Smartphone className="w-3 h-3" /> Works on iOS & Android cellular data (4G/5G)
        </p>

      </div>
    </div>
  );
}
