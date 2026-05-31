# Agent Instructions for a-done

## Development
- Start dev server: `npm run dev` (or pnpm/yarn/bun dev)
- The app entrypoint is `app/page.tsx`
- Tailwind CSS is configured; no additional setup needed

## Linting
- Run ESLint: `npm run lint`
- Uses `eslint-config-next` with Next.js recommended rules

## Building
- Build for production: `npm run build`
- Outputs to `.next` directory
- Start production server: `npm run start`

## Type Checking
- Type checking occurs during dev and build via Next.js and TypeScript
- For standalone type check: `npx tsc --noEmit`

## Notes
- Lockfile is `package-lock.json` (npm), but project supports npm, yarn, pnpm, bun
- `pnpm-workspace.yaml` present but repository is a single package
- No test framework configured in package.json
