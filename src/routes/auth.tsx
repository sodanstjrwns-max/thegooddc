import type { FC } from 'hono/jsx'
import { Layout } from '../components/Layout'
import { Breadcrumb } from '../components/ui'
import { CLINIC } from '../data/clinic'
import { TREATMENTS } from '../data/treatments'
import { DOCTORS } from '../data/doctors'
import type { Notice, Column } from '../lib/content-store'
import { bodyToText } from '../lib/content-store'

const AuthShell: FC<{ title: string; children: any }> = ({ title, children }) => (
  <section class="sec">
    <div class="container">
      <div class="form-card reveal">
        <h2 class="section-title" style="font-size:28px;text-align:center;margin-bottom:8px">{title}</h2>
        {children}
      </div>
    </div>
  </section>
)

export const LoginPage: FC = () => (
  <Layout title={`로그인 | ${CLINIC.name}`} description="더착한치과 회원 로그인" path="/auth/login">
    <section class="page-hero" style="padding:140px 0 50px"><div class="container ph-inner"><div class="hero-badge"><i class="fa-solid fa-right-to-bracket"></i> LOGIN</div><h1>로그인</h1></div></section>
    <Breadcrumb items={[{ name: '홈', path: '/' }, { name: '로그인', path: '/auth/login' }]} />
    <AuthShell title="회원 로그인">
      <p style="text-align:center;color:var(--ink-soft);margin-bottom:24px">로그인하시면 진료 후 사진과 마이페이지를 이용하실 수 있습니다.</p>
      <form id="login-form">
        <div class="field"><label>이메일</label><input name="email" type="email" required placeholder="example@email.com" /></div>
        <div class="field"><label>비밀번호</label><input name="password" type="password" required /></div>
        <button type="submit" class="btn btn-primary" style="width:100%;justify-content:center"><i class="fa-solid fa-right-to-bracket"></i> 로그인</button>
        <p id="login-result" style="text-align:center;margin-top:14px;font-weight:700"></p>
      </form>
      <div style="text-align:center;margin:20px 0;color:var(--ink-soft);font-size:14px">또는</div>
      <a href="/api/auth/google" class="btn btn-outline" style="width:100%;justify-content:center"><i class="fa-brands fa-google"></i> Google로 로그인</a>
      <p style="text-align:center;margin-top:22px;font-size:14px;color:var(--ink-soft)">계정이 없으신가요? <a href="/auth/register" style="color:var(--brand);font-weight:700">회원가입</a></p>
    </AuthShell>
    <script dangerouslySetInnerHTML={{ __html: `
      document.getElementById('login-form').addEventListener('submit', async (e) => {
        e.preventDefault(); const r = document.getElementById('login-result');
        const data = Object.fromEntries(new FormData(e.target));
        const res = await fetch('/api/auth/login', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(data) });
        const j = await res.json();
        if (j.ok) { r.style.color='var(--brand)'; r.textContent='로그인 성공! 이동합니다...'; setTimeout(()=>location.href='/auth/mypage', 700); }
        else { r.style.color='#c0392b'; r.textContent = j.error || '로그인 정보를 확인해 주세요.'; }
      });
    `}}></script>
  </Layout>
)

export const RegisterPage: FC = () => (
  <Layout title={`회원가입 | ${CLINIC.name}`} description="더착한치과 회원가입" path="/auth/register">
    <section class="page-hero" style="padding:140px 0 50px"><div class="container ph-inner"><div class="hero-badge"><i class="fa-solid fa-user-plus"></i> JOIN</div><h1>회원가입</h1></div></section>
    <Breadcrumb items={[{ name: '홈', path: '/' }, { name: '회원가입', path: '/auth/register' }]} />
    <AuthShell title="회원가입">
      <form id="register-form">
        <div class="field"><label>이름 *</label><input name="name" required /></div>
        <div class="field"><label>이메일 *</label><input name="email" type="email" required placeholder="example@email.com" /></div>
        <div class="field"><label>전화번호 *</label><input name="phone" type="tel" required placeholder="010-0000-0000" /></div>
        <div class="field"><label>비밀번호 *</label><input name="password" type="password" required minlength={6} /></div>
        <div class="field checkbox-row"><input type="checkbox" required id="ag1" /><label for="ag1" style="font-weight:400">[필수] 개인정보 수집·이용에 동의합니다.</label></div>
        <div class="field checkbox-row"><input type="checkbox" id="ag2" name="marketing" /><label for="ag2" style="font-weight:400">[선택] 마케팅 정보 수신에 동의합니다.</label></div>
        <button type="submit" class="btn btn-primary" style="width:100%;justify-content:center"><i class="fa-solid fa-user-plus"></i> 가입하기</button>
        <p id="register-result" style="text-align:center;margin-top:14px;font-weight:700"></p>
      </form>
      <p style="text-align:center;margin-top:22px;font-size:14px;color:var(--ink-soft)">이미 회원이신가요? <a href="/auth/login" style="color:var(--brand);font-weight:700">로그인</a></p>
    </AuthShell>
    <script dangerouslySetInnerHTML={{ __html: `
      document.getElementById('register-form').addEventListener('submit', async (e) => {
        e.preventDefault(); const r = document.getElementById('register-result');
        const data = Object.fromEntries(new FormData(e.target));
        const res = await fetch('/api/auth/register', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(data) });
        const j = await res.json();
        if (j.ok) { r.style.color='var(--brand)'; r.textContent='가입 완료! 로그인 페이지로 이동합니다...'; setTimeout(()=>location.href='/auth/login', 900); }
        else { r.style.color='#c0392b'; r.textContent = j.error || '가입 중 오류가 발생했습니다.'; }
      });
    `}}></script>
  </Layout>
)

export const MyPage: FC<{ user?: { name: string; email: string } }> = ({ user }) => (
  <Layout title={`마이페이지 | ${CLINIC.name}`} description="더착한치과 마이페이지" path="/auth/mypage">
    <section class="page-hero" style="padding:140px 0 50px"><div class="container ph-inner"><div class="hero-badge"><i class="fa-solid fa-user"></i> MY PAGE</div><h1>{user ? `${user.name}님, 반갑습니다` : '마이페이지'}</h1></div></section>
    <Breadcrumb items={[{ name: '홈', path: '/' }, { name: '마이페이지', path: '/auth/mypage' }]} />
    <section class="sec">
      <div class="container" style="max-width:720px">
        {user ? (
          <>
            <div class="card" style="padding:32px;margin-bottom:20px">
              <h3 style="margin-bottom:16px">회원 정보</h3>
              <p style="color:var(--ink-soft)"><strong>이름:</strong> {user.name}</p>
              <p style="color:var(--ink-soft)"><strong>이메일:</strong> {user.email}</p>
            </div>
            <div class="chip-row">
              <a href="/cases" class="chip"><i class="fa-solid fa-images"></i> 비포/애프터 (전체 열람)</a>
              <a href="/reservation" class="chip"><i class="fa-regular fa-calendar-check"></i> 진료 예약</a>
              <a href="/api/auth/logout" class="chip"><i class="fa-solid fa-right-from-bracket"></i> 로그아웃</a>
            </div>
          </>
        ) : (
          <div class="aeo-answer" style="text-align:center">로그인이 필요합니다. <a href="/auth/login" style="color:var(--brand);font-weight:700">로그인하기</a></div>
        )}
      </div>
    </section>
  </Layout>
)

// ===== 관리자 =====
export const AdminLoginPage: FC = () => (
  <Layout title="관리자 로그인" description="관리자 전용" path="/admin">
    <section class="page-hero" style="padding:140px 0 50px"><div class="container ph-inner"><div class="hero-badge"><i class="fa-solid fa-lock"></i> ADMIN</div><h1>관리자 로그인</h1></div></section>
    <AuthShell title="관리자 인증">
      <form id="admin-form">
        <div class="field"><label>관리자 비밀번호</label><input name="password" type="password" required /></div>
        <button type="submit" class="btn btn-primary" style="width:100%;justify-content:center"><i class="fa-solid fa-lock"></i> 로그인</button>
        <p id="admin-result" style="text-align:center;margin-top:14px;font-weight:700"></p>
      </form>
    </AuthShell>
    <script dangerouslySetInnerHTML={{ __html: `
      document.getElementById('admin-form').addEventListener('submit', async (e) => {
        e.preventDefault(); const r = document.getElementById('admin-result');
        const data = Object.fromEntries(new FormData(e.target));
        const res = await fetch('/api/admin/login', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(data) });
        const j = await res.json();
        if (j.ok) { location.href='/admin/dashboard'; }
        else { r.style.color='#c0392b'; r.textContent = j.error || '비밀번호가 올바르지 않습니다.'; }
      });
    `}}></script>
  </Layout>
)

export const AdminDashboard: FC<{ stats: { members: number; reservations: number; notices: number; columns: number } }> = ({ stats }) => (
  <Layout title="관리자 대시보드" description="관리자 전용" path="/admin/dashboard">
    <section class="page-hero" style="padding:130px 0 50px"><div class="container ph-inner"><div class="hero-badge"><i class="fa-solid fa-gauge"></i> DASHBOARD</div><h1>관리자 대시보드</h1></div></section>
    <section class="sec">
      <div class="container">
        <div class="stats" style="margin-bottom:40px">
          <div class="stat"><div class="num">{stats.members}</div><div class="lbl">회원</div></div>
          <div class="stat"><div class="num">{stats.reservations}</div><div class="lbl">예약 신청</div></div>
          <div class="stat"><div class="num">{stats.notices}</div><div class="lbl">공지사항</div></div>
          <div class="stat"><div class="num">{stats.columns}</div><div class="lbl">원장 칼럼</div></div>
        </div>
        <div class="tlist-grid">
          <a href="/admin/reservations" class="tlist-card"><div class="tc-icon"><i class="fa-regular fa-calendar-check"></i></div><h3>예약 관리</h3><p>예약 목록 조회 및 상태 변경</p></a>
          <a href="/admin/members" class="tlist-card"><div class="tc-icon"><i class="fa-solid fa-users"></i></div><h3>회원 관리</h3><p>가입 회원 목록 조회</p></a>
          <a href="/admin/cases" class="tlist-card"><div class="tc-icon"><i class="fa-solid fa-images"></i></div><h3>비포/애프터</h3><p>케이스 작성 및 관리</p></a>
          <a href="/admin/columns" class="tlist-card"><div class="tc-icon"><i class="fa-solid fa-pen-nib"></i></div><h3>원장 칼럼</h3><p>칼럼 작성 및 관리</p></a>
          <a href="/admin/notices" class="tlist-card"><div class="tc-icon"><i class="fa-solid fa-bullhorn"></i></div><h3>공지사항</h3><p>공지 작성 및 관리</p></a>
          <a href="/api/admin/logout" class="tlist-card"><div class="tc-icon"><i class="fa-solid fa-right-from-bracket"></i></div><h3>로그아웃</h3><p>관리자 세션 종료</p></a>
        </div>
      </div>
    </section>
  </Layout>
)

// ============================================================
// ADMIN — 콘텐츠 관리 (공지 / 칼럼)
// ============================================================
const ADMIN_CSS = `
.adm-wrap{max-width:920px;margin:0 auto}
.adm-bar{display:flex;align-items:center;justify-content:space-between;gap:16px;margin-bottom:24px;flex-wrap:wrap}
.adm-toast{background:var(--accent-soft);color:var(--accent-d);border:1px solid color-mix(in oklab,var(--accent) 30%,transparent);padding:12px 18px;border-radius:var(--radius);font-weight:600;font-size:14px;margin-bottom:22px}
.adm-card{background:var(--card);border:1px solid var(--line);border-radius:var(--radius-lg);padding:24px 26px;margin-bottom:16px;box-shadow:var(--sh-sm)}
.adm-card h3{font-size:18px;margin:0 0 6px;line-height:1.4}
.adm-meta{color:var(--ink-soft);font-size:13px;margin-bottom:10px;display:flex;align-items:center;gap:10px;flex-wrap:wrap}
.adm-pin{background:var(--accent);color:#fff;font-size:11px;font-weight:700;padding:2px 9px;border-radius:100px}
.adm-body-prev{color:var(--ink-soft);font-size:14px;line-height:1.65;margin:0 0 14px;white-space:pre-line}
.adm-actions{display:flex;gap:8px;flex-wrap:wrap}
.adm-form{display:grid;gap:14px}
.adm-form label{font-size:13px;font-weight:700;color:var(--ink-2);display:block;margin-bottom:5px}
.adm-form input[type=text],.adm-form input[type=date],.adm-form textarea,.adm-form select{width:100%;padding:11px 13px;border:1px solid var(--line);border-radius:var(--radius-sm);font:inherit;background:var(--bg);color:var(--ink)}
.adm-form textarea{min-height:120px;line-height:1.6;resize:vertical}
.adm-form .row{display:grid;grid-template-columns:1fr 1fr;gap:14px}
.adm-check{display:flex;align-items:center;gap:8px;font-size:14px;font-weight:600;color:var(--ink-2)}
.adm-check input{width:18px;height:18px}
.btn-sm{padding:8px 14px;font-size:13px;border-radius:var(--radius-sm)}
.btn-danger{background:#fff;color:#b23b3b;border:1px solid #e7c4c4}
.btn-danger:hover{background:#fbeaea}
.adm-detail{border:1px solid var(--line);border-radius:var(--radius);overflow:hidden}
.adm-detail summary{cursor:pointer;padding:12px 16px;background:var(--bg-2);font-weight:700;font-size:14px;list-style:none}
.adm-detail summary::-webkit-details-marker{display:none}
.adm-detail[open] summary{border-bottom:1px solid var(--line)}
.adm-detail .adm-form{padding:18px 16px}
.adm-hint{font-size:12px;color:var(--ink-faint);margin-top:4px}
@media(max-width:640px){.adm-form .row{grid-template-columns:1fr}}
`

const AdminShell: FC<{ active: 'notices' | 'columns'; title: string; ok?: string; children: any }> = ({ active, title, ok, children }) => {
  const okMsg: Record<string, string> = { created: '새 항목이 등록되었습니다.', updated: '수정사항이 저장되었습니다.', deleted: '항목이 삭제되었습니다.' }
  return (
    <Layout title={`${title} | 관리자`} description="관리자 전용" path="/admin/dashboard">
      <style dangerouslySetInnerHTML={{ __html: ADMIN_CSS }} />
      <section class="page-hero" style="padding:120px 0 40px"><div class="container ph-inner"><div class="hero-badge"><i class="fa-solid fa-pen-to-square"></i> ADMIN</div><h1>{title}</h1></div></section>
      <section class="sec">
        <div class="container adm-wrap">
          <div class="adm-bar">
            <div class="chip-row">
              <a href="/admin/dashboard" class="chip"><i class="fa-solid fa-arrow-left"></i> 대시보드</a>
              <a href="/admin/notices" class={`chip ${active === 'notices' ? 'active' : ''}`} style={active === 'notices' ? 'background:var(--accent);color:#fff;border-color:var(--accent)' : ''}><i class="fa-solid fa-bullhorn"></i> 공지사항</a>
              <a href="/admin/columns" class={`chip ${active === 'columns' ? 'active' : ''}`} style={active === 'columns' ? 'background:var(--accent);color:#fff;border-color:var(--accent)' : ''}><i class="fa-solid fa-pen-nib"></i> 원장 칼럼</a>
            </div>
          </div>
          {ok && okMsg[ok] && <div class="adm-toast"><i class="fa-solid fa-circle-check"></i> {okMsg[ok]}</div>}
          {children}
        </div>
      </section>
    </Layout>
  )
}

export const AdminNoticesPage: FC<{ notices: Notice[]; ok?: string }> = ({ notices, ok }) => (
  <AdminShell active="notices" title="공지사항 관리" ok={ok}>
    {/* 새 공지 작성 */}
    <details class="adm-detail" style="margin-bottom:26px">
      <summary><i class="fa-solid fa-plus"></i> 새 공지 작성</summary>
      <form class="adm-form" method="post" action="/api/admin/notices/create">
        <div><label>제목</label><input type="text" name="title" required placeholder="예: 6월 휴진 안내" /></div>
        <div><label>내용</label><textarea name="body" required placeholder="공지 내용을 입력하세요"></textarea></div>
        <div class="row">
          <div><label>날짜</label><input type="date" name="date" /></div>
          <div style="display:flex;align-items:flex-end"><label class="adm-check"><input type="checkbox" name="pinned" /> 상단 고정(중요)</label></div>
        </div>
        <div><button type="submit" class="btn btn-gold"><i class="fa-solid fa-check"></i> 등록하기</button></div>
      </form>
    </details>

    {notices.length === 0 && <p style="color:var(--ink-soft)">등록된 공지가 없습니다.</p>}
    {notices.map((n) => (
      <div class="adm-card">
        <div class="adm-meta">{n.pinned && <span class="adm-pin">중요</span>}<span>{n.date}</span><span style="color:var(--ink-faint)">수정 {n.modified}</span></div>
        <h3>{n.title}</h3>
        <p class="adm-body-prev">{n.body}</p>
        <div class="adm-actions">
          <details class="adm-detail" style="flex:1">
            <summary><i class="fa-solid fa-pen"></i> 수정</summary>
            <form class="adm-form" method="post" action="/api/admin/notices/update">
              <input type="hidden" name="id" value={n.id} />
              <div><label>제목</label><input type="text" name="title" value={n.title} required /></div>
              <div><label>내용</label><textarea name="body" required>{n.body}</textarea></div>
              <div class="row">
                <div><label>날짜</label><input type="date" name="date" value={n.date} /></div>
                <div style="display:flex;align-items:flex-end"><label class="adm-check"><input type="checkbox" name="pinned" checked={n.pinned} /> 상단 고정</label></div>
              </div>
              <div><button type="submit" class="btn btn-gold btn-sm"><i class="fa-solid fa-floppy-disk"></i> 저장</button></div>
            </form>
          </details>
          <form method="post" action="/api/admin/notices/delete" onsubmit="return confirm('이 공지를 삭제할까요?')">
            <input type="hidden" name="id" value={n.id} />
            <button type="submit" class="btn btn-danger btn-sm"><i class="fa-solid fa-trash"></i> 삭제</button>
          </form>
        </div>
      </div>
    ))}
  </AdminShell>
)

export const AdminColumnsPage: FC<{ columns: Column[]; ok?: string }> = ({ columns, ok }) => {
  const treatOpts = TREATMENTS.map((t) => ({ slug: t.slug, name: t.shortName || t.name }))
  return (
    <AdminShell active="columns" title="원장 칼럼 관리" ok={ok}>
      {/* 새 칼럼 작성 */}
      <details class="adm-detail" style="margin-bottom:26px">
        <summary><i class="fa-solid fa-plus"></i> 새 칼럼 작성</summary>
        <form class="adm-form" method="post" action="/api/admin/columns/create">
          <div><label>제목</label><input type="text" name="title" required placeholder="예: 디지털 임플란트, 왜 정확할까요?" /></div>
          <div><label>요약(목록·검색에 노출)</label><textarea name="excerpt" style="min-height:60px" placeholder="한두 문장으로 요약"></textarea></div>
          <div class="row">
            <div><label>URL slug(비우면 자동)</label><input type="text" name="slug" placeholder="why-digital-implant" /></div>
            <div><label>날짜</label><input type="date" name="date" /></div>
          </div>
          <div class="row">
            <div><label>작성 의료진</label><select name="author">{DOCTORS.map((d) => <option value={d.slug}>{d.name} {d.title}</option>)}</select></div>
            <div><label>관련 진료</label><select name="related"><option value="">선택 안 함</option>{treatOpts.map((t) => <option value={t.slug}>{t.name}</option>)}</select></div>
          </div>
          <div>
            <label>본문</label>
            <textarea name="bodyText" style="min-height:200px" placeholder={'소제목\n본문 내용...\n\n다음 소제목\n다음 단락...'}></textarea>
            <p class="adm-hint">빈 줄로 단락을 구분합니다. 각 단락의 첫 줄은 소제목, 나머지는 본문이 됩니다.</p>
          </div>
          <div><button type="submit" class="btn btn-gold"><i class="fa-solid fa-check"></i> 발행하기</button></div>
        </form>
      </details>

      {columns.length === 0 && <p style="color:var(--ink-soft)">등록된 칼럼이 없습니다.</p>}
      {columns.map((c) => (
        <div class="adm-card">
          <div class="adm-meta"><span>{c.date}</span><span style="color:var(--ink-faint)">/column/{c.slug}</span></div>
          <h3><a href={`/column/${c.slug}`} target="_blank" style="color:var(--ink)">{c.title} <i class="fa-solid fa-arrow-up-right-from-square" style="font-size:11px;color:var(--ink-faint)"></i></a></h3>
          <p class="adm-body-prev">{c.excerpt}</p>
          <div class="adm-actions">
            <details class="adm-detail" style="flex:1">
              <summary><i class="fa-solid fa-pen"></i> 수정</summary>
              <form class="adm-form" method="post" action="/api/admin/columns/update">
                <input type="hidden" name="id" value={c.id} />
                <div><label>제목</label><input type="text" name="title" value={c.title} required /></div>
                <div><label>요약</label><textarea name="excerpt" style="min-height:60px">{c.excerpt}</textarea></div>
                <div class="row">
                  <div><label>URL slug</label><input type="text" name="slug" value={c.slug} /></div>
                  <div><label>날짜</label><input type="date" name="date" value={c.date} /></div>
                </div>
                <div class="row">
                  <div><label>작성 의료진</label><select name="author">{DOCTORS.map((d) => <option value={d.slug} selected={d.slug === c.author}>{d.name} {d.title}</option>)}</select></div>
                  <div><label>관련 진료</label><select name="related"><option value="" selected={!c.related}>선택 안 함</option>{treatOpts.map((t) => <option value={t.slug} selected={t.slug === c.related}>{t.name}</option>)}</select></div>
                </div>
                <div><label>본문</label><textarea name="bodyText" style="min-height:200px">{bodyToText(c.body)}</textarea><p class="adm-hint">빈 줄로 단락 구분 · 각 단락 첫 줄=소제목</p></div>
                <div><button type="submit" class="btn btn-gold btn-sm"><i class="fa-solid fa-floppy-disk"></i> 저장</button></div>
              </form>
            </details>
            <form method="post" action="/api/admin/columns/delete" onsubmit="return confirm('이 칼럼을 삭제할까요?')">
              <input type="hidden" name="id" value={c.id} />
              <button type="submit" class="btn btn-danger btn-sm"><i class="fa-solid fa-trash"></i> 삭제</button>
            </form>
          </div>
        </div>
      ))}
    </AdminShell>
  )
}
