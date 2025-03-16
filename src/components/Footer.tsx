import { Download } from "lucide-react";
import { BlobProvider } from "@react-pdf/renderer";
import { PDFContent } from "./PDFContent";

interface FooterProps {
  content: string;
  handleExportDOCX: () => void;
}

export const Footer = ({ content, handleExportDOCX }: FooterProps) => {
  return (
    <footer className="bg-white border-t border-gray-200 shadow-lg">
      <div className="max-w-7xl mx-auto px-6 py-2 flex justify-center gap-10">
        {/* Export to DOCX */}
        <button
          onClick={handleExportDOCX}
          disabled={!content.trim()}
          className={`flex items-center gap-2 px-6 py-2 text-sm font-medium rounded-lg transition-all duration-200 border ${
            !content.trim()
              ? "bg-gray-50 text-gray-400 border-gray-200 cursor-not-allowed"
              : "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100 hover:border-blue-300 active:bg-purple-200"
          } focus:outline-none focus:ring-2 focus:ring-blue-400`}
        >
          <Download size={16} />
          Export to DOCX
        </button>

        {/* Export to PDF */}
        <BlobProvider document={<PDFContent content={content} />}>
          {({ url, loading }) => (
            <a
              href={url || "#"}
              download="document.pdf"
              className={`flex items-center gap-2 px-6 py-2 text-sm font-medium rounded-lg transition-all duration-200 border ${
                loading || !url || !content.trim()
                  ? "bg-gray-50 text-gray-400 border-gray-200 cursor-not-allowed"
                  : "bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100 hover:border-purple-300 active:bg-purple-200"
              } focus:outline-none focus:ring-2 focus:ring-purple-400`}
              onClick={(e) => {
                if (loading || !url || !content.trim()) e.preventDefault();
              }}
            >
              <Download size={16} />
              {loading ? "Generating PDF..." : "Export to PDF"}
            </a>
          )}
        </BlobProvider>
      </div>
    </footer>
  );
};
