# tab-shepherd

> Browser extension that groups and suspends idle tabs based on configurable inactivity rules

## Installation

```bash
npm install
npm run build
```

Then load the `dist/` folder as an unpacked extension in your browser's extension settings.

## Usage

Once installed, tab-shepherd runs automatically in the background. Configure rules via the extension popup:

```json
{
  "inactivityThreshold": 30,
  "suspendAfter": 60,
  "groupByDomain": true,
  "whitelist": ["github.com", "localhost"]
}
```

- **inactivityThreshold** – minutes before a tab is considered idle
- **suspendAfter** – minutes before an idle tab is suspended
- **groupByDomain** – automatically group tabs by their domain
- **whitelist** – domains that should never be suspended

Suspended tabs are replaced with a lightweight placeholder page and restored instantly on click.

## Development

```bash
npm run dev      # watch mode
npm run test     # run tests
npm run lint     # lint source files
```

## Contributing

Pull requests are welcome. Please open an issue first to discuss any major changes.

## License

[MIT](LICENSE)