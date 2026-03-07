import { Command } from "commander";
import { MevzuatClient } from "../clients/mevzuat-client.js";

export const articleCommand = new Command("article")
  .description(
    "Retrieve a single article (madde) of a legislation document as Markdown. " +
      "Takes a maddeId from the article tree output. Output: JSON to stdout."
  )
  .argument(
    "<maddeId>",
    "Article ID obtained from the 'maddeId' field in tree output (NOT the article number)"
  )
  .addHelpText(
    "after",
    "\nOutput JSON schema:\n" +
      "  {\n" +
      '    "maddeId": string,            // The requested article ID\n' +
      '    "markdownContent": string,    // Article text converted to Markdown\n' +
      '    "mimeType": string            // Original content type (text/html)\n' +
      "  }\n" +
      "\nExamples:\n" +
      "  $ mevzuat article 67890\n" +
      "  $ mevzuat article 67890 | jq -r '.markdownContent'\n" +
      "  $ mevzuat tree 12345 | jq '.tree[0].children[0].maddeId' | xargs mevzuat article\n"
  )
  .action(async (maddeId: string) => {
    if (!maddeId.trim()) {
      const output = { error: "maddeId must be a non-empty string" };
      process.stdout.write(JSON.stringify(output, null, 2) + "\n");
      process.exitCode = 1;
      return;
    }

    const client = new MevzuatClient();

    try {
      const result = await client.getArticleAsMarkdown(maddeId);
      process.stdout.write(JSON.stringify(result, null, 2) + "\n");
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      const output = { error: message };
      process.stdout.write(JSON.stringify(output, null, 2) + "\n");
      process.exitCode = 1;
    }
  });
