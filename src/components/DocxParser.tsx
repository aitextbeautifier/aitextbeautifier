import {
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
  BorderStyle,
  Table,
  TableRow,
  TableCell,
} from "docx";

export const parseMarkdownToDocx = (
  markdown: string
): (Paragraph | Table)[] => {
  if (!markdown) return [];

  const lines = markdown.split("\n");
  const children: (Paragraph | Table)[] = [];
  let inCodeBlock = false;
  let codeContent: string[] = [];
  let inTable = false;
  let tableRows: string[][] = [];
  let tableHeaders: string[] = [];

  const processInlineFormatting = (text: string): TextRun[] => {
    const parts: TextRun[] = [];
    let i = 0;

    while (i < text.length) {
      if (text.substring(i, i + 1) === "`") {
        let j = i + 1;
        while (j < text.length && text.substring(j, j + 1) !== "`") {
          j++;
        }
        if (j < text.length) {
          const code = text.substring(i + 1, j);
          parts.push(
            new TextRun({
              text: code,
              font: "Courier New",
              size: 22,
              color: "1A1A1A",
              shading: { fill: "F0F0F0" },
            })
          );
          i = j + 1;
          continue;
        }
      }

      if (text.substring(i, i + 2) === "**") {
        let j = i + 2;
        let nestedAsteriskCount = 0;
        while (j < text.length) {
          if (text.substring(j, j + 2) === "**") {
            if (nestedAsteriskCount === 0) break;
            nestedAsteriskCount--;
            j += 2;
          } else {
            j++;
          }
        }
        if (j < text.length) {
          const bold = text.substring(i + 2, j);
          parts.push(new TextRun({ text: bold, bold: true, size: 24 }));
          i = j + 2;
          continue;
        }
      }

      if (
        text.substring(i, i + 1) === "*" &&
        (i === 0 || text.substring(i - 1, i) !== "*") &&
        (i + 1 >= text.length || text.substring(i + 1, i + 2) !== "*")
      ) {
        let j = i + 1;
        while (j < text.length) {
          if (
            text.substring(j, j + 1) === "*" &&
            (j + 1 >= text.length || text.substring(j + 1, j + 2) !== "*")
          ) {
            break;
          }
          j++;
        }
        if (j < text.length) {
          const italic = text.substring(i + 1, j);
          parts.push(new TextRun({ text: italic, italics: true, size: 24 }));
          i = j + 1;
          continue;
        }
      }

      if (text.substring(i, i + 1) === "[") {
        const closeBracket = text.indexOf("]", i);
        const openParen = text.indexOf("(", closeBracket);
        const closeParen = text.indexOf(")", openParen);
        if (
          closeBracket !== -1 &&
          openParen === closeBracket + 1 &&
          closeParen !== -1
        ) {
          const linkText = text.substring(i + 1, closeBracket);
          parts.push(
            new TextRun({
              text: linkText,
              color: "0066CC",
              underline: {},
              size: 24,
            })
          );
          i = closeParen + 1;
          continue;
        }
      }

      let nextIndex = text.length;
      const specialIndices = [
        text.indexOf("`", i),
        text.indexOf("**", i),
        text.indexOf("*", i),
        text.indexOf("[", i),
      ].filter((idx) => idx !== -1);

      if (specialIndices.length > 0) {
        nextIndex = Math.min(...specialIndices);
      }

      if (nextIndex > i) {
        parts.push(
          new TextRun({ text: text.substring(i, nextIndex), size: 24 })
        );
        i = nextIndex;
      } else {
        parts.push(new TextRun({ text: text.substring(i, i + 1), size: 24 }));
        i++;
      }
    }
    return parts;
  };

  lines.forEach((line, lineIndex) => {
    if (line.trim().startsWith("|") && line.trim().endsWith("|")) {
      if (!inTable) {
        inTable = true;
        tableHeaders = line
          .split("|")
          .slice(1, -1)
          .map((cell) => cell.trim());
      } else if (line.match(/\|[-:]+/)) {
        // Skip alignment row
      } else {
        tableRows.push(
          line
            .split("|")
            .slice(1, -1)
            .map((cell) => cell.trim())
        );
      }
      return;
    } else if (inTable) {
      inTable = false;
      children.push(
        new Table({
          rows: [
            new TableRow({
              children: tableHeaders.map(
                (header) =>
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: processInlineFormatting(header),
                        spacing: { before: 120, after: 120 },
                      }),
                    ],
                    borders: {
                      top: {
                        style: BorderStyle.SINGLE,
                        size: 1,
                        color: "D0D0D0",
                      },
                      bottom: {
                        style: BorderStyle.SINGLE,
                        size: 1,
                        color: "D0D0D0",
                      },
                      left: {
                        style: BorderStyle.SINGLE,
                        size: 1,
                        color: "D0D0D0",
                      },
                      right: {
                        style: BorderStyle.SINGLE,
                        size: 1,
                        color: "D0D0D0",
                      },
                    },
                  })
              ),
            }),
            ...tableRows.map(
              (row) =>
                new TableRow({
                  children: row.map(
                    (cell) =>
                      new TableCell({
                        children: [
                          new Paragraph({
                            children: processInlineFormatting(cell),
                            spacing: { before: 120, after: 120 },
                          }),
                        ],
                        borders: {
                          top: {
                            style: BorderStyle.SINGLE,
                            size: 1,
                            color: "D0D0D0",
                          },
                          bottom: {
                            style: BorderStyle.SINGLE,
                            size: 1,
                            color: "D0D0D0",
                          },
                          left: {
                            style: BorderStyle.SINGLE,
                            size: 1,
                            color: "D0D0D0",
                          },
                          right: {
                            style: BorderStyle.SINGLE,
                            size: 1,
                            color: "D0D0D0",
                          },
                        },
                      })
                  ),
                })
            ),
          ],
          width: { size: 100, type: "pct" },
        })
      );
      tableRows = [];
      tableHeaders = [];
    }

    if (line.startsWith("```")) {
      if (!inCodeBlock) {
        inCodeBlock = true;
      } else {
        codeContent.forEach((codeLine) => {
          children.push(
            new Paragraph({
              children: [
                new TextRun({
                  text: codeLine,
                  font: "Courier New",
                  size: 20,
                  color: "1A1A1A",
                }),
              ],
              spacing: { before: 240, after: 240, line: 300 },
              indent: { left: 720 },
              shading: { fill: "F0F0F0" },
              border: {
                top: { style: BorderStyle.SINGLE, size: 1, color: "D0D0D0" },
                bottom: { style: BorderStyle.SINGLE, size: 1, color: "D0D0D0" },
                left: { style: BorderStyle.SINGLE, size: 1, color: "D0D0D0" },
                right: { style: BorderStyle.SINGLE, size: 1, color: "D0D0D0" },
              },
            })
          );
        });
        inCodeBlock = false;
        codeContent = [];
      }
      return;
    }

    if (inCodeBlock) {
      codeContent.push(line);
      return;
    }

    if (
      line.trim() === "---" ||
      line.trim() === "***" ||
      line.trim() === "___"
    ) {
      children.push(
        new Paragraph({
          border: {
            bottom: { style: BorderStyle.SINGLE, size: 1, color: "E0E0E0" },
          },
          spacing: { before: 240, after: 240 },
        })
      );
    } else if (line.startsWith("# ")) {
      children.push(
        new Paragraph({
          children: processInlineFormatting(line.replace("# ", "")),
          heading: HeadingLevel.HEADING_1,
          spacing: { before: 720, after: 360 },
          run: { size: 80 },
        })
      );
    } else if (line.startsWith("## ")) {
      children.push(
        new Paragraph({
          children: processInlineFormatting(line.replace("## ", "")),
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 600, after: 300 },
          run: { size: 60 },
        })
      );
    } else if (line.startsWith("### ")) {
      children.push(
        new Paragraph({
          children: processInlineFormatting(line.replace("### ", "")),
          heading: HeadingLevel.HEADING_3,
          spacing: { before: 480, after: 240 },
          run: { size: 48 },
        })
      );
    } else if (line.startsWith("#### ")) {
      children.push(
        new Paragraph({
          children: processInlineFormatting(line.replace("#### ", "")),
          heading: HeadingLevel.HEADING_4,
          spacing: { before: 400, after: 200 },
          run: { size: 40 },
        })
      );
    } else if (line.startsWith("- ")) {
      children.push(
        new Paragraph({
          children: processInlineFormatting(line.replace("- ", "")),
          bullet: { level: 0 },
          spacing: { before: 120, after: 120 },
          indent: { left: 720, hanging: 360 },
        })
      );
    } else if (line.startsWith("> ")) {
      children.push(
        new Paragraph({
          children: processInlineFormatting(line.replace("> ", "")),
          spacing: { before: 120, after: 120 },
          indent: { left: 720 },
          border: {
            left: { style: BorderStyle.SINGLE, size: 4, color: "E0E0E0" },
          },
        })
      );
    } else if (line.trim() !== "") {
      children.push(
        new Paragraph({
          children: processInlineFormatting(line),
          spacing: { before: 120, after: 120 },
          alignment: AlignmentType.JUSTIFIED,
        })
      );
    } else if (
      line.trim() === "" &&
      lineIndex > 0 &&
      lines[lineIndex - 1].trim() !== ""
    ) {
      children.push(
        new Paragraph({
          spacing: { before: 120, after: 120 },
        })
      );
    }
  });

  return children;
};
