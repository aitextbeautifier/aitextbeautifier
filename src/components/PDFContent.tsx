import {
  Document as PDFDocument,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
  Link,
} from "@react-pdf/renderer";

// Register fonts
Font.register({
  family: "Helvetica",
  src: "https://fonts.cdnfonts.com/s/29136/Helvetica.woff",
});

Font.register({
  family: "Courier",
  src: "https://fonts.cdnfonts.com/s/595/CourierPrime-Regular.ttf",
});

// Updated styles
const styles = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    padding: 40,
    fontSize: 12,
    lineHeight: 1.6,
    color: "#333333",
  },
  section: {
    marginBottom: 20,
  },
  paragraph: {
    marginBottom: 12,
    textAlign: "justify",
    fontSize: 12,
  },
  heading1: {
    fontSize: 40,
    fontWeight: "bold",
    marginBottom: 24,
    marginTop: 36,
    color: "#111111",
  },
  heading2: {
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 20,
    marginTop: 28,
    color: "#111111",
  },
  heading3: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    marginTop: 24,
    color: "#111111",
  },
  heading4: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 14,
    marginTop: 20,
    color: "#111111",
  },
  code: {
    fontFamily: "Courier",
    backgroundColor: "#f0f0f0",
    padding: 16,
    margin: "12 0",
    borderRadius: 4,
    fontSize: 9,
    lineHeight: 1.5,
    color: "#1a1a1a",
    border: "1 solid #d0d0d0",
  },
  inlineCode: {
    fontFamily: "Courier",
    backgroundColor: "#f0f0f0",
    padding: "3 6",
    fontSize: 11,
    color: "#1a1a1a",
    borderRadius: 3,
  },
  bold: { fontWeight: "bold" },
  italic: { fontStyle: "italic" },
  listItem: {
    marginBottom: 8,
    paddingLeft: 20,
    flexDirection: "row",
  },
  bullet: {
    marginRight: 8,
    fontSize: 12,
  },
  link: {
    color: "#0066cc",
    textDecoration: "underline",
  },
  blockquote: {
    borderLeft: "4 solid #e0e0e0",
    paddingLeft: 16,
    marginLeft: 0,
    color: "#666",
    fontStyle: "italic",
  },
  hr: {
    borderBottom: "1 solid #e0e0e0",
    margin: "10 0",
  },
  table: {
    border: "1 solid #d0d0d0",
    margin: "12 0",
  },
  tableRow: {
    flexDirection: "row",
  },
  tableCell: {
    border: "1 solid #d0d0d0",
    padding: 8,
    flex: 1,
  },
});

interface PDFContentProps {
  content: string;
}

export const PDFContent = ({ content }: PDFContentProps) => {
  if (!content) return null;

  const parseInlineContent = (text: string) => {
    if (!text) return [];

    const elements = [];
    let currentIndex = 0;

    while (currentIndex < text.length) {
      if (text.substr(currentIndex, 1) === "`") {
        const endCodeIndex = text.indexOf("`", currentIndex + 1);
        if (endCodeIndex !== -1) {
          const codeContent = text.substring(currentIndex + 1, endCodeIndex);
          elements.push(
            <Text key={`code-${currentIndex}`} style={styles.inlineCode}>
              {codeContent}
            </Text>
          );
          currentIndex = endCodeIndex + 1;
          continue;
        }
      }

      if (text.substr(currentIndex, 2) === "**") {
        let endBoldIndex = -1;
        let nestLevel = 1;
        let searchIndex = currentIndex + 2;

        while (searchIndex < text.length - 1 && nestLevel > 0) {
          if (text.substr(searchIndex, 2) === "**") {
            nestLevel--;
            if (nestLevel === 0) endBoldIndex = searchIndex;
            searchIndex += 2;
          } else {
            searchIndex++;
          }
        }

        if (endBoldIndex !== -1) {
          const boldContent = text.substring(currentIndex + 2, endBoldIndex);
          elements.push(
            <Text key={`bold-${currentIndex}`} style={styles.bold}>
              {parseInlineContent(boldContent)}
            </Text>
          );
          currentIndex = endBoldIndex + 2;
          continue;
        }
      }

      if (
        text.substr(currentIndex, 1) === "*" &&
        (currentIndex === 0 || text.substr(currentIndex - 1, 1) !== "*") &&
        (currentIndex + 1 >= text.length ||
          text.substr(currentIndex + 1, 1) !== "*")
      ) {
        let endItalicIndex = -1;
        let searchIndex = currentIndex + 1;

        while (searchIndex < text.length) {
          if (
            text.substr(searchIndex, 1) === "*" &&
            (searchIndex + 1 >= text.length ||
              text.substr(searchIndex + 1, 1) !== "*")
          ) {
            endItalicIndex = searchIndex;
            break;
          }
          searchIndex++;
        }

        if (endItalicIndex !== -1) {
          const italicContent = text.substring(
            currentIndex + 1,
            endItalicIndex
          );
          elements.push(
            <Text key={`italic-${currentIndex}`} style={styles.italic}>
              {parseInlineContent(italicContent)}
            </Text>
          );
          currentIndex = endItalicIndex + 1;
          continue;
        }
      }

      if (text.substr(currentIndex, 1) === "[") {
        const closeBracket = text.indexOf("]", currentIndex);
        const openParen = text.indexOf("(", closeBracket);
        const closeParen = text.indexOf(")", openParen);

        if (
          closeBracket !== -1 &&
          openParen === closeBracket + 1 &&
          closeParen !== -1
        ) {
          const linkText = text.substring(currentIndex + 1, closeBracket);
          const url = text.substring(openParen + 1, closeParen);
          elements.push(
            <Link key={`link-${currentIndex}`} src={url} style={styles.link}>
              {linkText}
            </Link>
          );
          currentIndex = closeParen + 1;
          continue;
        }
      }

      const nextCode = text.indexOf("`", currentIndex);
      const nextBold = text.indexOf("**", currentIndex);
      const nextItalic = text.indexOf("*", currentIndex);
      const nextLink = text.indexOf("[", currentIndex);

      const indices = [nextCode, nextBold, nextItalic, nextLink].filter(
        (idx) => idx !== -1
      );

      const nextSpecialChar =
        indices.length > 0 ? Math.min(...indices) : text.length;

      if (nextSpecialChar > currentIndex) {
        elements.push(
          <Text key={`text-${currentIndex}`}>
            {text.substring(currentIndex, nextSpecialChar)}
          </Text>
        );
        currentIndex = nextSpecialChar;
      } else {
        elements.push(
          <Text key={`text-${currentIndex}`}>
            {text.substring(currentIndex)}
          </Text>
        );
        break;
      }
    }
    return elements;
  };

  const convertToElements = (text: string) => {
    const lines = text.split("\n");
    const elements = [];
    let codeBlock = "";
    let inCode = false;
    let inTable = false;
    let tableHeaders: string[] = [];
    let tableRows: string[][] = [];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

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
        continue;
      } else if (inTable) {
        inTable = false;
        elements.push(
          <View key={`table-${i}`} style={styles.table}>
            <View style={styles.tableRow}>
              {tableHeaders.map((header, idx) => (
                <Text key={`th-${idx}`} style={styles.tableCell}>
                  {parseInlineContent(header)}
                </Text>
              ))}
            </View>
            {tableRows.map((row, rowIdx) => (
              <View key={`tr-${rowIdx}`} style={styles.tableRow}>
                {row.map((cell, cellIdx) => (
                  <Text key={`td-${cellIdx}`} style={styles.tableCell}>
                    {parseInlineContent(cell)}
                  </Text>
                ))}
              </View>
            ))}
          </View>
        );
        tableRows = [];
        tableHeaders = [];
      }

      if (line.startsWith("```")) {
        if (inCode) {
          elements.push(
            <View key={`code-block-${i}`} style={styles.code}>
              <Text>{codeBlock}</Text>
            </View>
          );
          codeBlock = "";
          inCode = false;
        } else {
          inCode = true;
        }
        continue;
      }

      if (inCode) {
        codeBlock += line + "\n";
        continue;
      }

      if (
        line.trim() === "---" ||
        line.trim() === "***" ||
        line.trim() === "___"
      ) {
        elements.push(<View key={`hr-${i}`} style={styles.hr} />);
      } else if (line.startsWith("# ")) {
        elements.push(
          <Text key={`h1-${i}`} style={styles.heading1}>
            {parseInlineContent(line.slice(2))}
          </Text>
        );
      } else if (line.startsWith("## ")) {
        elements.push(
          <Text key={`h2-${i}`} style={styles.heading2}>
            {parseInlineContent(line.slice(3))}
          </Text>
        );
      } else if (line.startsWith("### ")) {
        elements.push(
          <Text key={`h3-${i}`} style={styles.heading3}>
            {parseInlineContent(line.slice(4))}
          </Text>
        );
      } else if (line.startsWith("#### ")) {
        elements.push(
          <Text key={`h4-${i}`} style={styles.heading4}>
            {parseInlineContent(line.slice(5))}
          </Text>
        );
      } else if (line.startsWith("- ")) {
        elements.push(
          <View key={`list-${i}`} style={styles.listItem}>
            <Text style={styles.bullet}>•</Text>
            <Text style={styles.paragraph}>
              {parseInlineContent(line.slice(2))}
            </Text>
          </View>
        );
      } else if (line.startsWith("> ")) {
        elements.push(
          <View key={`blockquote-${i}`} style={styles.blockquote}>
            <Text style={styles.paragraph}>
              {parseInlineContent(line.slice(2))}
            </Text>
          </View>
        );
      } else if (line.trim()) {
        elements.push(
          <Text key={`p-${i}`} style={styles.paragraph}>
            {parseInlineContent(line)}
          </Text>
        );
      } else if (i > 0 && lines[i - 1].trim()) {
        elements.push(<View key={`space-${i}`} style={{ marginBottom: 12 }} />);
      }
    }
    return elements;
  };

  return (
    <PDFDocument>
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>{convertToElements(content)}</View>
      </Page>
    </PDFDocument>
  );
};
