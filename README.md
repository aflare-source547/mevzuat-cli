# mevzuat-cli

CLI tool for Turkish legislation (mevzuat.gov.tr). Designed for AI agents and programmatic use.

All commands output JSON to stdout. No authentication required.

## Install

```bash
npm install -g @saidsrc/mevzuat
```

## Commands

### search — Search legislation

```bash
# Content search (phrase)
mevzuat search "ceza kanunu" -t KANUN
mevzuat search "vergi" -t KANUN KHK --page 2

# Title-only search (no phrase needed)
mevzuat search --title "ticaret" -t KANUN
mevzuat search --title "türk ticaret kanunu" --exact

# Combined
mevzuat search "ticaret" -n 6102 -t KANUN
mevzuat search "vergi" --title "gelir" -t KANUN
```

At least one of `<phrase>` or `--title` must be provided.

#### Phrase search (Solr syntax)

The `phrase` argument searches document content using Solr syntax:

| Operator | Syntax | Description |
|----------|--------|-------------|
| Simple | `ticaret` | Single term |
| Implicit OR | `yatırımcı tazmin` | Space-separated terms |
| Exact phrase | `"katma değer vergisi"` | Quoted exact match |
| Required (+) | `+yatırımcı +tazmin` | Both terms required |
| Prohibited (-) | `yatırımcı -kurum` | Exclude term |
| Mixed | `+yatırımcı -kurum +tazmin` | Required + excluded |
| Wildcard (*) | `yatırım*` | Trailing wildcard |
| Leading wildcard | `*ımcı` | Leading wildcard |
| Single char (?) | `yatırımc?` | Single character wildcard |
| Fuzzy (~) | `yatırımcı~` | Approximate match |
| Fuzzy (~N) | `yatırımcı~2` | Edit distance N |
| Proximity (~N) | `"yatırımcı tazmin"~5` | Within N words |
| Boost (^N) | `yatırımcı^2 tazmin` | Boost term weight |
| Grouping () | `(yatırımcı müşteri) tazmin` | Group terms |

**Not supported in phrase:** `AND`, `OR`, `NOT` keywords, range `[TO]` queries.

#### Title search (--title)

The `--title` option searches the legislation name (`mevzuatAdi`). It has limited operator support:

| Feature | Supported |
|---------|-----------|
| Simple terms | Yes |
| Space-separated | Yes (implicit AND — all words required) |
| Wildcard `*` | Yes |
| Single char `?` | Yes |
| Exact match (`--exact`) | Yes (use `--exact` flag, not quotes) |
| Quotes, +, -, ~, ^, leading * | No |

**Important:** Space means AND in title (all words required), but implicit OR in phrase.

#### Options

- `-t, --types <types...>` — Filter by legislation type
- `-n, --number <number>` — Legislation number filter
- `-p, --page <number>` — Page number (default: 1)
- `--page-size <number>` — Results per page, max 20 (default: 20)
- `--date-start <date>` — Official Gazette date range start (YYYY-MM-DD)
- `--date-end <date>` — Official Gazette date range end (YYYY-MM-DD)
- `--gazette-number <number>` — Official Gazette number filter
- `--title <title>` — Filter by legislation title
- `--exact` — Exact phrase matching (tamCumle), works with `--title` for exact title match

**Note:** `--date-start` and `--date-end` must be used together for date filtering to work.

### doc — Full document as Markdown

```bash
mevzuat doc <mevzuatId>
mevzuat doc 103228 | jq -r '.markdownContent'
```

### article — Single article by maddeId

```bash
mevzuat article <maddeId>
mevzuat article 1272772 | jq -r '.markdownContent'
```

The `maddeId` comes from tree output, not the article number.

### tree — Article tree / table of contents

```bash
mevzuat tree <mevzuatId>
mevzuat tree 103228 | jq '.tree[].title'
mevzuat tree 103228 | jq '[.tree[] | {maddeId, maddeNo, title}]'
```

### gerekce — Law rationale

```bash
mevzuat gerekce <gerekceId>
mevzuat gerekce 1563 | jq -r '.markdownContent'
```

The `gerekceId` comes from search results or tree output.

## Typical Workflow

```bash
# 1. Search for a law
mevzuat search "ceza kanunu" -t KANUN

# 2. Get table of contents
mevzuat tree <mevzuatId>

# 3. Read specific article
mevzuat article <maddeId>

# 4. Read full document
mevzuat doc <mevzuatId>

# 5. Read law rationale
mevzuat gerekce <gerekceId>

# Pipe-friendly
mevzuat search "vergi" | jq '.documents[0].mevzuatId' | xargs mevzuat doc
```

## Legislation Types

| Code | Description |
|------|-------------|
| KANUN | Kanun (Laws) |
| CB_KARARNAME | Cumhurbaskanligi Kararnamesi (Presidential Decrees) |
| YONETMELIK | Bakanlar Kurulu Yonetmelikleri (Council of Ministers Regulations) |
| CB_YONETMELIK | Cumhurbaskanligi Yonetmeligi (Presidential Regulations) |
| CB_KARAR | Cumhurbaskanligi Karari (Presidential Decisions) |
| CB_GENELGE | Cumhurbaskanligi Genelgesi (Presidential Circulars) |
| KHK | Kanun Hukmunde Kararname (Decree Laws) |
| TUZUK | Tuzuk (Statutes) |
| KKY | Kurum ve Kurulus Yonetmelikleri (Institutional Regulations) |
| UY | Universite Yonetmelikleri (University Regulations) |
| TEBLIGLER | Tebligler (Communiques) |
| MULGA | Mulga Kanunlar (Repealed Laws) |

## License

MIT
