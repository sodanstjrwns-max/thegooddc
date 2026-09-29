import build from '@hono/vite-build/cloudflare-pages'
import devServer from '@hono/vite-dev-server'
import adapter from '@hono/vite-dev-server/cloudflare'
import { defineConfig } from 'vite'
import { execSync } from 'node:child_process'

// 진료 콘텐츠 최종 수정일 = src/data/treatments.ts 마지막 커밋 날짜(빌드 시 상수).
// new Date()로 매일 '오늘'이 찍히던 lastReviewed 대체 (2026-09-29). 얕은 클론·git 없음 → src/lib/content-dates.ts 폴백.
function lastCommitDate(paths: string[]): string {
  try {
    const run = (cmd: string) => execSync(cmd, { stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim()
    if (run('git rev-parse --is-shallow-repository') === 'true') return ''
    return run(`git log -1 --format=%cs -- ${paths.join(' ')}`)
  } catch {
    return ''
  }
}

export default defineConfig({
  define: {
    __TX_CONTENT_DATE__: JSON.stringify(lastCommitDate(['src/data/treatments.ts'])),
  },
  plugins: [
    build(),
    devServer({
      adapter,
      entry: 'src/index.tsx'
    })
  ]
})
