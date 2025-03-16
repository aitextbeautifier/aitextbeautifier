import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface PreviewPaneProps {
  content: string;
}

export const PreviewPane = ({ content }: PreviewPaneProps) => {
  return (
    <div className="flex-1 w-[60%] bg-white border-l border-gray-200 flex flex-col h-[calc(100vh-64px)]">
      <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-white">
        <h2 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
          <span className="i-fa-eye text-purple-500" />
          Live Preview
        </h2>
      </div>
      <div className="flex-1 p-8 prose prose-sm max-w-none overflow-y-auto bg-gray-50 border-t  border-blue-500">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
      </div>
    </div>
  );
};
