// Builds the sample PDFs in public/pdf/ (MPdfViewer's page and the Drive example) from the HTML files here:
// headless Chromium prints each one (with an outline from its headings, and working links), and qpdf encrypts
// the lease. All the text is written for these samples. Run: node scripts/sample-pdfs/build.mjs
import { execFileSync } from 'node:child_process'
import { mkdirSync, rmSync } from 'node:fs'
import { join } from 'node:path'

const here = new URL('.', import.meta.url).pathname
const out = join(here, '../../public/pdf')
mkdirSync(out, { recursive: true })

const chromium = process.env.CHROMIUM ?? 'chromium'
for (const name of ['pocket-gardens', 'invoice', 'lease']) {
  execFileSync(chromium, [
    '--headless',
    '--disable-gpu',
    '--no-pdf-header-footer',
    '--generate-pdf-document-outline',
    `--print-to-pdf=${join(out, `${name}.pdf`)}`,
    `file://${join(here, `${name}.html`)}`,
  ], { stdio: 'inherit' })
}

// The lease opens with the password "m3ui"
const plain = join(out, 'lease.pdf')
const locked = join(out, 'lease-protected.pdf')
execFileSync('qpdf', ['--encrypt', 'm3ui', 'm3ui-owner', '256', '--', plain, locked], { stdio: 'inherit' })
rmSync(plain)
console.log('Done:', out)
