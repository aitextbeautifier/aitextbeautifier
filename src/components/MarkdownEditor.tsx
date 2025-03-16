import { useState } from "react";
import { Document, Packer } from "docx";
import { saveAs } from "file-saver";
import { EditorPane } from "./EditorPanel";
import { PreviewPane } from "./PreviewPanel";
import { Footer } from "./Footer";
import { parseMarkdownToDocx } from "./DocxParser";

const MarkdownEditor = () => {
  const [content, setContent] = useState("");

  const handleExportDOCX = () => {
    const doc = new Document({
      sections: [
        {
          properties: {
            page: {
              margin: {
                top: 1440,
                right: 1440,
                bottom: 1440,
                left: 1440,
              },
            },
          },
          children: parseMarkdownToDocx(content),
        },
      ],
    });

    Packer.toBlob(doc).then((blob) => {
      saveAs(blob, "document.docx");
    });
  };

  return (
    <div className="h-screen bg-gray-50 flex flex-col">
      <main className="flex-1 flex">
        <EditorPane content={content} setContent={setContent} />
        <PreviewPane content={content} />
      </main>
      <Footer content={content} handleExportDOCX={handleExportDOCX} />
    </div>
  );
};

export default MarkdownEditor;
