import { Command } from "commander";
import { MevzuatClient } from "../clients/mevzuat-client.js";
import type { TreeOutput } from "../types/mevzuat.js";

export const treeCommand = new Command("tree")
  .description(
    "Retrieve the article tree (table of contents) of a legislation document. " +
      "Returns a nested JSON structure with maddeId values for use with the article command. Output: JSON to stdout."
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
      '    "totalNodes": number,         // Total number of nodes in the tree\n' +
      '    "tree": [{                    // Nested article tree\n' +
      '      "maddeId": string | number, // Use with "mevzuat article <maddeId>"\n' +
      '      "maddeNo": string | number, // Article number\n' +
      '      "title": string,\n' +
      '      "description": string,\n' +
      '      "maddeBaslik": string,      // Article heading\n' +
      '      "gerekceId": string | number, // Use with "mevzuat gerekce <gerekceId>"\n' +
      '      "children": [...]           // Nested child nodes\n' +
      "    }]\n" +
      "  }\n" +
      "\nExamples:\n" +
      "  $ mevzuat tree 12345\n" +
      "  $ mevzuat tree 12345 | jq '.tree[].title'\n" +
      "  $ mevzuat tree 12345 | jq '.tree[0].children[0].maddeId'\n"
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
      const result = await client.getArticleTree(mevzuatId);
      const output: TreeOutput = {
        mevzuatId,
        totalNodes: result.totalNodes,
        tree: result.tree,
      };
      process.stdout.write(JSON.stringify(output, null, 2) + "\n");
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      const output = { error: message };
      process.stdout.write(JSON.stringify(output, null, 2) + "\n");
      process.exitCode = 1;
    }
  });
