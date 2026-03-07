import { Command } from "commander";
import { MevzuatClient } from "../clients/mevzuat-client.js";
import {
  isValidMevzuatTur,
  ALL_MEVZUAT_TYPES,
  MEVZUAT_TYPE_DESCRIPTIONS,
  type MevzuatTur,
} from "../enums/legislation-types.js";
import type {
  MevzuatSearchData,
  MevzuatSearchRequest,
  SearchOutput,
} from "../types/mevzuat.js";

export const searchCommand = new Command("search")
  .description(
    "Search Turkish legislation (laws, decrees, regulations) via Bedesten API. " +
      "Returns paginated results sorted by Official Gazette date (newest first). Output: JSON to stdout."
  )
  .argument(
    "[phrase]",
    "Full-text content search using Solr syntax. Supported operators:\n" +
      '  Simple:          ticaret                     (single term)\n' +
      '  Implicit OR:     yatırımcı tazmin            (space-separated terms)\n' +
      '  Exact phrase:    "\\"katma değer vergisi\\""    (quoted exact match)\n' +
      '  Required (+):    +yatırımcı +tazmin          (both required)\n' +
      '  Prohibited (-):  yatırımcı -kurum            (exclude term)\n' +
      '  Mixed:           +yatırımcı -kurum +tazmin   (required + excluded)\n' +
      '  Wildcard (*):    yatırım*                    (trailing wildcard)\n' +
      '  Leading (*):     *ımcı                       (leading wildcard)\n' +
      '  Single char (?): yatırımc?                   (single char wildcard)\n' +
      '  Fuzzy (~):       yatırımcı~                  (approximate match)\n' +
      '  Fuzzy (~N):      yatırımcı~2                 (edit distance N)\n' +
      '  Proximity (~N):  "\\"yatırımcı tazmin\\"~5"     (within N words)\n' +
      '  Boost (^N):      yatırımcı^2 tazmin          (boost term weight)\n' +
      '  Grouping ():     (yatırımcı müşteri) tazmin  (group terms)\n' +
      "  NOT supported:   AND, OR, NOT keywords, range [TO] queries.\n" +
      "  Can be omitted if --title is provided."
  )
  .option(
    "-t, --types <types...>",
    "Legislation type filter. Values:\n" +
      ALL_MEVZUAT_TYPES.map((t) => `  ${t.padEnd(16)} - ${MEVZUAT_TYPE_DESCRIPTIONS[t]}`).join(
        "\n"
      ) +
      "\n  (default: all types)"
  )
  .option(
    "-n, --number <number>",
    "Legislation number filter (mevzuatNo)"
  )
  .option("-p, --page <number>", "Page number, 1-indexed (default: 1)", "1")
  .option("--page-size <number>", "Results per page, max 20 (default: 20)", "20")
  .option("--date-start <date>", "Official Gazette date range start (YYYY-MM-DD)")
  .option("--date-end <date>", "Official Gazette date range end (YYYY-MM-DD)")
  .option("--gazette-number <number>", "Official Gazette number filter")
  .option(
    "--title <title>",
    "Filter by legislation title (mevzuatAdi). Limited Solr support:\n" +
      "  Supported:     simple terms, * wildcard, ? single char\n" +
      '  Space means:   AND (all words required, unlike phrase which is OR)\n' +
      "  NOT supported: quotes, +required, -prohibited, fuzzy~, proximity,\n" +
      "                 boost^, leading *wildcard\n" +
      "  Use --exact for exact title phrase matching (tamCumle)."
  )
  .option(
    "--exact",
    "Exact phrase matching (tamCumle). Works with --title for exact title match.",
    false
  )
  .addHelpText(
    "after",
    "\nOutput JSON schema:\n" +
      "  {\n" +
      '    "documents": [{\n' +
      '      "mevzuatId": string,           // Use with "mevzuat doc <id>" or "mevzuat tree <id>"\n' +
      '      "mevzuatNo": string | number,  // Legislation number\n' +
      '      "mevzuatAdi": string,          // Legislation title\n' +
      '      "mevzuatTur": {                // Legislation type info\n' +
      '        "id": number,\n' +
      '        "name": string,\n' +
      '        "description": string\n' +
      "      },\n" +
      '      "gerekceId": string | null,    // Use with "mevzuat gerekce <id>"\n' +
      '      "resmiGazeteTarihi": string,   // Official Gazette date\n' +
      '      "resmiGazeteSayisi": string    // Official Gazette number\n' +
      "    }],\n" +
      '    "totalRecords": number,\n' +
      '    "requestedPage": number,\n' +
      '    "pageSize": number,\n' +
      '    "filteredTypes": string[]         // Types used in search\n' +
      "  }\n" +
      "\nExamples:\n" +
      '  $ mevzuat search "ceza kanunu" -t KANUN\n' +
      '  $ mevzuat search "vergi" -t KANUN KHK --page 2\n' +
      '  $ mevzuat search "yatırımcı~" -t KANUN              # fuzzy search\n' +
      '  $ mevzuat search "yatırım*" -t KANUN                # wildcard\n' +
      '  $ mevzuat search \'"yatırımcı tazmin"~5\' -t KANUN    # proximity\n' +
      '  $ mevzuat search --title "ticaret" -t KANUN          # title-only search\n' +
      '  $ mevzuat search --title "türk ticaret kanunu" --exact  # exact title\n' +
      '  $ mevzuat search "ticaret" -n 6102 -t KANUN          # with law number\n' +
      "  $ mevzuat search \"ceza\" | jq '.documents[0].mevzuatId'\n"
  )
  .action(async (phrase: string | undefined, opts) => {
    if (!phrase && !opts.title) {
      const output = {
        error:
          "At least one of <phrase> or --title must be provided.",
      };
      process.stdout.write(JSON.stringify(output, null, 2) + "\n");
      process.exitCode = 1;
      return;
    }

    const pageNumber = parseInt(opts.page, 10);
    const pageSize = parseInt(opts.pageSize, 10);
    const types: MevzuatTur[] | undefined = opts.types;

    if (types) {
      for (const t of types) {
        if (!isValidMevzuatTur(t)) {
          const output = {
            error: `Invalid legislation type: ${t}. Valid types: ${ALL_MEVZUAT_TYPES.join(", ")}`,
          };
          process.stdout.write(JSON.stringify(output, null, 2) + "\n");
          process.exitCode = 1;
          return;
        }
      }
    }

    const searchData: MevzuatSearchData = {
      pageSize,
      pageNumber,
      sortFields: ["RESMI_GAZETE_TARIHI"],
      sortDirection: "desc",
    };

    if (phrase) searchData.phrase = phrase;
    if (types) searchData.mevzuatTurList = types;
    if (opts.number) searchData.mevzuatNo = opts.number;
    if (opts.title) searchData.mevzuatAdi = opts.title;
    if (opts.exact) searchData.tamCumle = true;
    if (opts.dateStart) {
      searchData.resmiGazeteTarihiStart = `${opts.dateStart}T00:00:00.000Z`;
    }
    if (opts.dateEnd) {
      searchData.resmiGazeteTarihiEnd = `${opts.dateEnd}T23:59:59.999Z`;
    }
    if (opts.gazetteNumber) searchData.resmiGazeteSayisi = opts.gazetteNumber;

    const request: MevzuatSearchRequest = {
      data: searchData,
      applicationName: "UyapMevzuat",
      paging: true,
    };

    const client = new MevzuatClient();

    try {
      const response = await client.searchDocuments(request);

      const output: SearchOutput = {
        documents: response.data?.mevzuatList ?? [],
        totalRecords: response.data?.total ?? 0,
        requestedPage: pageNumber,
        pageSize,
        filteredTypes: types,
      };

      if (response.metadata?.FMTY === "ERROR") {
        output.error = response.metadata.FMTE ?? "API returned an error";
        process.exitCode = 1;
      } else if (!response.data) {
        output.error = "No data returned from Bedesten API";
        process.exitCode = 1;
      }

      process.stdout.write(JSON.stringify(output, null, 2) + "\n");
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      const output = { error: message };
      process.stdout.write(JSON.stringify(output, null, 2) + "\n");
      process.exitCode = 1;
    }
  });
