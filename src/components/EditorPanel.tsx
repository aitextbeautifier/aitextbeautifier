interface EditorPaneProps {
  content: string;
  setContent: (value: string) => void;
}

export const EditorPane = ({ content, setContent }: EditorPaneProps) => {
  return (
    <div className="flex-1 w-[40%] mr-1 bg-white border-r border-gray-200 shadow-sm flex flex-col h-[calc(100vh-64px)]">
      <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-white">
        <h2 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
          <span className="i-fa-edit text-blue-500" />
          Markdown Editor
        </h2>
      </div>
      <div className="border-b border-blue-500 w-full"></div>
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="w-full h-full p-6 text-gray-800 focus:outline-none focus:ring-2 resize-none font-mono text-base leading-relaxed bg-gray-50 border-gray-100 overflow-y-auto"
        placeholder="Start writing your markdown here..."
        spellCheck="false"
      />
    </div>
  );
};
