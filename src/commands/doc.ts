import { Command } from "commander";
import { MevzuatClient } from "../clients/mevzuat-client.js";

export const docCommand = new Command("doc")
  .description(
    "Retrieve full text of a legislation document as Markdown. " +
      "Takes a mevzuatId from search results, fetches the document from Bedesten API, " +
      "decodes base64 content, converts HTML to Markdown. Output: JSON to stdout."
  )
  .argument(
    "<mevzuatId>",
    "Legislation document ID obtained from the 'mevzuatId' field in search results"
  )
  .addHelpText(
    "after",
    "\nOutput JSON schema:\n" +
      "  {\n" +
      '    "mevzuatId": string,          // The requested document ID\n' +
      '    "markdownContent": string,    // Full legislation text converted to Markdown\n' +
      '    "mimeType": string            // Original content type (text/html)\n' +
      "  }\n" +
      "\nExamples:\n" +
      "  $ mevzuat doc 12345\n" +
      "  $ mevzuat doc 12345 | jq -r '.markdownContent'\n" +
      "  $ mevzuat search \"ceza\" -t KANUN | jq -r '.documents[0].mevzuatId' | xargs mevzuat doc\n"
  )
  .action(async (mevzuatId: string) => {
    if (!mevzuatId.trim()) {
      const output = { error: "mevzuatId must be a non-empty string" };
      process.stdout.write(JSON.stringify(output, null, 2) + "\n");
      process.exitCode = 1;
      return;
    }

    const client = new MevzuatClient();

    try {
      const result = await client.getDocumentAsMarkdown(mevzuatId);
      process.stdout.write(JSON.stringify(result, null, 2) + "\n");
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      const output = { error: message };
      process.stdout.write(JSON.stringify(output, null, 2) + "\n");
      process.exitCode = 1;
    }
  });
