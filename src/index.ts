import { Command } from "commander";
import { searchCommand } from "./commands/search.js";
import { docCommand } from "./commands/doc.js";
import { articleCommand } from "./commands/article.js";
import { treeCommand } from "./commands/tree.js";
import { gerekceCommand } from "./commands/gerekce.js";

const program = new Command()
  .name("mevzuat")
  .description(
    "CLI tool for Turkish legislation (mevzuat.gov.tr). " +
      "All commands output JSON to stdout for programmatic use. " +
      "Pipe output to jq for filtering. No authentication required."
  )
  .version("0.1.0")
  .addCommand(searchCommand)
  .addCommand(docCommand)
  .addCommand(articleCommand)
  .addCommand(treeCommand)
  .addCommand(gerekceCommand);

program.parse();
