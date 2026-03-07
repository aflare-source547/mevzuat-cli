import { Command } from "commander";
import { MevzuatClient } from "../clients/mevzuat-client.js";

export const gerekceCommand = new Command("gerekce")
  .description(
    "Retrieve the rationale (gerekce) of a legislation document as Markdown. " +
      "Takes a gerekceId from search results or tree output. Output: JSON to stdout."
  )
  .argument(
    "<gerekceId>",
    "Gerekce ID obtained from the 'gerekceId' field in search results or tree output"
  )
  .addHelpText(
    "after",
    "\nOutput JSON schema:\n" +
      "  {\n" +
      '    "gerekceId": string,          // The requested gerekce ID\n' +
      '    "mevzuatId": string,          // Parent legislation document ID\n' +
      '    "markdownContent": string,    // Rationale text converted to Markdown\n' +
      '    "mimeType": string            // Original content type (text/html)\n' +
      "  }\n" +
      "\nExamples:\n" +
      "  $ mevzuat gerekce 99999\n" +
      "  $ mevzuat gerekce 99999 | jq -r '.markdownContent'\n" +
      "  $ mevzuat search \"ceza\" | jq -r '.documents[0].gerekceId' | xargs mevzuat gerekce\n"
  )
  .action(async (gerekceId: string) => {
    if (!gerekceId.trim()) {
      const output = { error: "gerekceId must be a non-empty string" };
      process.stdout.write(JSON.stringify(output, null, 2) + "\n");
      process.exitCode = 1;
      return;
    }

    const client = new MevzuatClient();

    try {
      const result = await client.getGerekce(gerekceId);
      process.stdout.write(JSON.stringify(result, null, 2) + "\n");
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      const output = { error: message };
      process.stdout.write(JSON.stringify(output, null, 2) + "\n");
      process.exitCode = 1;
    }
  });
