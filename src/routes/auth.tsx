import type { FC } from 'hono/jsx'
import { Layout } from '../components/Layout'
import { Breadcrumb } from '../components/ui'
import { CLINIC } from '../data/clinic'
import { TREATMENTS } from '../data/treatments'
import { DOCTORS } from '../data/doctors'
import type { Notice, Column, CaseItem, SiteSettings, Reservation, ResStats } from '../lib/content-store'
import { bodyToText, RES_STATUS_LABEL } from '../lib/content-store'

// 추적 설정 진단 타입 (대시보드/설정 화면 공용)
export type SettingsSource = 'env' | 'kv' | 'seed' | 'none'
export interface SettingsDiag {
  kv: Partial<SiteSettings>
  effective: SiteSettings
  source: Record<keyof SiteSettings, SettingsSource>
}

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

const DASH_CSS = `
.dash-popup{display:flex;align-items:center;gap:16px;flex-wrap:wrap;justify-content:space-between;border-radius:var(--radius-lg);padding:18px 22px;margin-bottom:30px;border:1px solid var(--line)}
.dash-popup.on{background:var(--accent-soft);border-color:color-mix(in oklab,var(--accent) 35%,transparent)}
.dash-popup.off{background:var(--bg-2)}
.dash-popup .dp-left{display:flex;align-items:center;gap:14px;min-width:0}
.dash-popup .dp-ic{width:46px;height:46px;border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:20px;flex-shrink:0}
.dash-popup.on .dp-ic{background:var(--accent);color:#fff}
.dash-popup.off .dp-ic{background:var(--line);color:var(--ink-soft)}
.dash-popup .dp-txt{min-width:0}
.dash-popup .dp-txt b{display:block;font-size:15px;margin-bottom:2px}
.dash-popup .dp-txt span{font-size:13px;color:var(--ink-soft);display:block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:46ch}
.dash-quick{display:flex;gap:10px;flex-wrap:wrap;margin-bottom:34px}
.dash-quick .btn{font-size:13.5px}
.dash-sec-title{font-size:13px;font-weight:800;letter-spacing:.06em;color:var(--ink-faint);text-transform:uppercase;margin:0 0 14px}
`

export const AdminDashboard: FC<{ stats: { members: number; reservations: number; notices: number; columns: number; cases: number }; popup?: Notice | null; diag?: SettingsDiag }> = ({ stats, popup, diag }) => (
  <Layout title="관리자 대시보드" description="관리자 전용" path="/admin/dashboard">
    <style dangerouslySetInnerHTML={{ __html: DASH_CSS + TRACK_CARD_CSS }} />
    <section class="page-hero" style="padding:130px 0 50px"><div class="container ph-inner"><div class="hero-badge"><i class="fa-solid fa-gauge"></i> DASHBOARD</div><h1>관리자 대시보드</h1></div></section>
    <section class="sec">
      <div class="container">
        {/* 팝업 상태 배너 */}
        <div class={`dash-popup ${popup ? 'on' : 'off'}`}>
          <div class="dp-left">
            <div class="dp-ic"><i class="fa-solid fa-window-restore"></i></div>
            <div class="dp-txt">
              {popup
                ? <><b>홈 팝업 노출 중</b><span>“{popup.title}”{popup.popupUntil ? ` · ${popup.popupUntil}까지` : ' · 종료일 없음'}</span></>
                : <><b>현재 홈 팝업 없음</b><span>공지 작성 시 “홈 첫 화면에 팝업으로 띄우기”를 켜면 방문자에게 표시됩니다.</span></>}
            </div>
          </div>
          <a href="/admin/notices" class="btn btn-gold btn-sm"><i class="fa-solid fa-bullhorn"></i> 공지 관리</a>
        </div>

        {/* 추적·분석 연결 상태 */}
        {diag && <TrackStatus diag={diag} />}

        {/* 빠른 작업 */}
        <p class="dash-sec-title">빠른 작업</p>
        <div class="dash-quick">
          <a href="/admin/notices" class="btn btn-gold btn-sm"><i class="fa-solid fa-plus"></i> 공지 작성</a>
          <a href="/admin/columns" class="btn btn-outline btn-sm"><i class="fa-solid fa-pen-nib"></i> 칼럼 작성</a>
          <a href="/admin/cases" class="btn btn-outline btn-sm"><i class="fa-solid fa-images"></i> 케이스 등록</a>
          <a href="/" target="_blank" class="btn btn-ghost btn-sm"><i class="fa-solid fa-arrow-up-right-from-square"></i> 사이트 보기</a>
          <button type="button" id="dash-indexnow" class="btn btn-ghost btn-sm"><i class="fa-solid fa-magnifying-glass"></i> 검색엔진 색인요청</button>
        </div>

        <p class="dash-sec-title">현황</p>
        <div class="stats" style="margin-bottom:40px">
          <div class="stat"><div class="num">{stats.members}</div><div class="lbl">회원</div></div>
          <div class="stat"><div class="num">{stats.reservations}</div><div class="lbl">예약 신청</div></div>
          <div class="stat"><div class="num">{stats.notices}</div><div class="lbl">공지사항</div></div>
          <div class="stat"><div class="num">{stats.columns}</div><div class="lbl">원장 칼럼</div></div>
          <div class="stat"><div class="num">{stats.cases}</div><div class="lbl">비포/애프터</div></div>
        </div>

        <p class="dash-sec-title">관리 메뉴</p>
        <div class="tlist-grid">
          <a href="/admin/reservations" class="tlist-card"><div class="tc-icon"><i class="fa-regular fa-calendar-check"></i></div><h3>예약 운영</h3><p>상태관리·검색·CSV·안내문 복사</p></a>
          <a href="/admin/analytics" class="tlist-card"><div class="tc-icon"><i class="fa-solid fa-chart-pie"></i></div><h3>운영 분석</h3><p>전환율·인기진료·요일/시간대 패턴</p></a>
          <a href="/admin/members" class="tlist-card"><div class="tc-icon"><i class="fa-solid fa-users"></i></div><h3>회원 관리</h3><p>가입 회원 목록 조회</p></a>
          <a href="/admin/cases" class="tlist-card"><div class="tc-icon"><i class="fa-solid fa-images"></i></div><h3>비포/애프터</h3><p>케이스 작성 및 관리</p></a>
          <a href="/admin/columns" class="tlist-card"><div class="tc-icon"><i class="fa-solid fa-pen-nib"></i></div><h3>원장 칼럼</h3><p>칼럼 작성 및 관리</p></a>
          <a href="/admin/notices" class="tlist-card"><div class="tc-icon"><i class="fa-solid fa-bullhorn"></i></div><h3>공지사항 · 팝업</h3><p>공지 작성 및 홈 팝업 설정</p></a>
          <a href="/admin/settings" class="tlist-card"><div class="tc-icon"><i class="fa-solid fa-chart-line"></i></div><h3>추적 · 분석 설정</h3><p>GA4 · 네이버 · 구글 연동</p></a>
          <a href="/api/admin/logout" class="tlist-card"><div class="tc-icon"><i class="fa-solid fa-right-from-bracket"></i></div><h3>로그아웃</h3><p>관리자 세션 종료</p></a>
        </div>
      </div>
    </section>
    <script dangerouslySetInnerHTML={{ __html: `
      var inx=document.getElementById('dash-indexnow');
      if(inx) inx.addEventListener('click', async function(){
        inx.disabled=true; var t=inx.innerHTML; inx.innerHTML='<i class="fa-solid fa-spinner fa-spin"></i> 요청 중...';
        try{ var r=await fetch('/api/admin/indexnow',{method:'POST'}); var j=await r.json(); alert(j.ok?('검색엔진 색인요청 완료'+(j.submitted?(' ('+j.submitted+'개 URL)'):'')):(j.error||'요청 실패')); }
        catch(e){ alert('요청 중 오류가 발생했습니다.'); }
        finally{ inx.disabled=false; inx.innerHTML=t; }
      });
    ` }} />
  </Layout>
)

// ============================================================
// 추적·분석 연결 상태 카드 (대시보드 상단)
// ============================================================
const TRACK_CARD_CSS = `
.track-card{background:var(--card);border:1px solid var(--line);border-radius:var(--radius-lg);padding:20px 24px;margin:18px 0 6px;box-shadow:var(--sh-sm)}
.track-card .tc-head{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:14px;flex-wrap:wrap}
.track-card .tc-head h3{margin:0;font-size:16px;display:flex;align-items:center;gap:8px}
.track-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:12px}
.track-item{border:1px solid var(--line);border-radius:var(--radius-sm);padding:13px 15px;background:var(--bg)}
.track-item .ti-top{display:flex;align-items:center;justify-content:space-between;gap:8px;margin-bottom:6px}
.track-item .ti-name{font-size:13px;font-weight:700;color:var(--ink-2)}
.track-item .ti-val{font-size:12px;color:var(--ink-faint);font-family:ui-monospace,monospace;word-break:break-all}
.ti-dot{width:10px;height:10px;border-radius:50%;flex:0 0 auto}
.ti-on .ti-dot{background:#16a34a;box-shadow:0 0 0 3px color-mix(in oklab,#16a34a 22%,transparent)}
.ti-off .ti-dot{background:#cbd2da}
.ti-badge{font-size:10px;font-weight:700;padding:2px 7px;border-radius:100px;letter-spacing:.02em}
.ti-badge.env{background:#e8f0fe;color:#1a56db}
.ti-badge.kv{background:#e7f8ef;color:#0f7a3d}
.ti-badge.none{background:#f1f3f5;color:#868e96}
`

const SRC_LABEL: Record<SettingsSource, string> = { env: '환경변수', kv: '관리자입력', seed: '코드', none: '미설정' }

const TrackStatus: FC<{ diag: SettingsDiag }> = ({ diag }) => {
  const items: { key: keyof SiteSettings; name: string }[] = [
    { key: 'ga4', name: 'GA4 (방문·전환 분석)' },
    { key: 'gtm', name: 'GTM (태그매니저)' },
    { key: 'naverVerify', name: '네이버 서치어드바이저' },
    { key: 'googleVerify', name: '구글 서치콘솔' },
  ]
  const ga4On = !!diag.effective.ga4
  return (
    <div class="track-card">
      <div class="tc-head">
        <h3><i class="fa-solid fa-chart-line" style="color:var(--accent)"></i> 추적 · 분석 연결 상태</h3>
        <a href="/admin/settings" class="btn btn-gold btn-sm"><i class="fa-solid fa-sliders"></i> 설정 관리</a>
      </div>
      <div class="track-grid">
        {items.map((it) => {
          const val = (diag.effective[it.key] || '').toString()
          const src = diag.source[it.key]
          const on = !!val
          return (
            <div class={`track-item ${on ? 'ti-on' : 'ti-off'}`}>
              <div class="ti-top">
                <span class="ti-name"><span class="ti-dot"></span> {it.name}</span>
                <span class={`ti-badge ${src === 'env' ? 'env' : src === 'kv' || src === 'seed' ? 'kv' : 'none'}`}>{SRC_LABEL[src]}</span>
              </div>
              <div class="ti-val">{on ? (it.key === 'naverVerify' || it.key === 'googleVerify' ? val.slice(0, 14) + '…' : val) : '연결 안 됨'}</div>
            </div>
          )
        })}
      </div>
      {!ga4On && (
        <p style="margin:14px 0 0;font-size:13px;color:var(--ink-soft);line-height:1.6">
          <i class="fa-solid fa-circle-info" style="color:var(--accent)"></i> 아직 방문자 추적이 켜지지 않았습니다. <b>[설정 관리]</b>에서 GA4 측정ID(G-로 시작)를 입력하면 즉시 방문·전화·예약 전환이 수집됩니다.
        </p>
      )}
    </div>
  )
}

// ============================================================
// ADMIN — 추적·분석 설정 페이지
// ============================================================
const SETTINGS_CSS = `
.set-wrap{max-width:760px;margin:0 auto}
.set-card{background:var(--card);border:1px solid var(--line);border-radius:var(--radius-lg);padding:26px 28px;margin-bottom:18px;box-shadow:var(--sh-sm)}
.set-card h2{font-size:18px;margin:0 0 4px}
.set-card .desc{color:var(--ink-soft);font-size:14px;line-height:1.6;margin:0 0 20px}
.set-field{margin-bottom:18px}
.set-field label{display:block;font-size:14px;font-weight:700;color:var(--ink-2);margin-bottom:6px}
.set-field input{width:100%;padding:12px 14px;border:1px solid var(--line);border-radius:var(--radius-sm);font:inherit;background:var(--bg);color:var(--ink);font-family:ui-monospace,monospace}
.set-field .hint{font-size:12.5px;color:var(--ink-faint);margin-top:6px;line-height:1.6}
.set-field .hint a{color:var(--accent-d);text-decoration:underline}
.set-actions{display:flex;gap:10px;align-items:center;flex-wrap:wrap;margin-top:8px}
.set-toast{padding:12px 16px;border-radius:var(--radius-sm);font-weight:600;font-size:14px;margin-bottom:18px}
.set-toast.ok{background:var(--accent-soft);color:var(--accent-d);border:1px solid color-mix(in oklab,var(--accent) 30%,transparent)}
.set-guide{background:var(--bg-2);border:1px solid var(--line);border-radius:var(--radius-sm);padding:16px 18px;font-size:13.5px;line-height:1.75;color:var(--ink-2)}
.set-guide b{color:var(--ink)}
.set-guide ol{margin:8px 0 0;padding-left:20px}
.set-locked{font-size:12px;color:#1a56db;background:#e8f0fe;border-radius:100px;padding:2px 9px;font-weight:700}
`

export const AdminSettingsPage: FC<{ diag: SettingsDiag; ok?: string }> = ({ diag, ok }) => {
  const v = diag.kv // 편집창에는 관리자가 KV에 저장한 값만 표시 (env는 잠금 표시)
  const locked = (k: keyof SiteSettings) => diag.source[k] === 'env'
  return (
    <Layout title="추적 · 분석 설정 | 관리자" description="관리자 전용" path="/admin/settings">
      <style dangerouslySetInnerHTML={{ __html: SETTINGS_CSS }} />
      <section class="page-hero" style="padding:120px 0 40px"><div class="container ph-inner"><div class="hero-badge"><i class="fa-solid fa-chart-line"></i> ANALYTICS</div><h1>추적 · 분석 설정</h1></div></section>
      <section class="sec">
        <div class="container set-wrap">
          <div class="chip-row" style="margin-bottom:24px">
            <a href="/admin/dashboard" class="chip"><i class="fa-solid fa-arrow-left"></i> 대시보드</a>
          </div>
          {ok === 'saved' && <div class="set-toast ok"><i class="fa-solid fa-circle-check"></i> 저장되었습니다. 사이트 전체에 즉시 반영됩니다(새로고침 후 확인).</div>}

          <div class="set-card">
            <h2><i class="fa-solid fa-chart-simple" style="color:var(--accent)"></i> 방문자 · 전환 추적</h2>
            <p class="desc">ID만 입력하면 사이트 전체에 즉시 적용됩니다. 코드 수정·재배포가 필요 없습니다. 전화·예약·카카오·길찾기 클릭이 자동으로 전환 이벤트로 수집됩니다.</p>
            <form method="post" action="/api/admin/settings" class="set-form">
              <div class="set-field">
                <label>GA4 측정 ID {locked('ga4') && <span class="set-locked">환경변수 잠금</span>}</label>
                <input name="ga4" value={v.ga4 || ''} placeholder="G-XXXXXXXXXX" autocomplete="off" />
                <p class="hint"><a href="https://analytics.google.com" target="_blank" rel="noopener">analytics.google.com</a> → 관리 → 데이터 스트림 → ‘G-’로 시작하는 측정 ID. 입력 즉시 방문/전환 추적 시작.</p>
              </div>
              <div class="set-field">
                <label>GTM 컨테이너 ID <span style="font-weight:400;color:var(--ink-faint)">(선택)</span> {locked('gtm') && <span class="set-locked">환경변수 잠금</span>}</label>
                <input name="gtm" value={v.gtm || ''} placeholder="GTM-XXXXXXX" autocomplete="off" />
                <p class="hint">구글 태그매니저를 별도로 쓸 때만 입력하세요. (GA4와 택1 권장)</p>
              </div>
              <div class="set-field">
                <label>네이버 서치어드바이저 소유확인 {locked('naverVerify') && <span class="set-locked">환경변수 잠금</span>}</label>
                <input name="naverVerify" value={v.naverVerify || ''} placeholder="메타태그의 content 값만 붙여넣기" autocomplete="off" />
                <p class="hint"><a href="https://searchadvisor.naver.com" target="_blank" rel="noopener">searchadvisor.naver.com</a> → 사이트 등록 → HTML 태그의 <code>content="..."</code> 값.</p>
              </div>
              <div class="set-field">
                <label>구글 서치콘솔 소유확인 {locked('googleVerify') && <span class="set-locked">환경변수 잠금</span>}</label>
                <input name="googleVerify" value={v.googleVerify || ''} placeholder="메타태그의 content 값만 붙여넣기" autocomplete="off" />
                <p class="hint"><a href="https://search.google.com/search-console" target="_blank" rel="noopener">search.google.com/search-console</a> → HTML 태그 방식의 <code>content="..."</code> 값.</p>
              </div>
              <div class="set-actions">
                <button type="submit" class="btn btn-gold"><i class="fa-solid fa-floppy-disk"></i> 저장</button>
                <a href="/" target="_blank" class="btn btn-ghost btn-sm"><i class="fa-solid fa-arrow-up-right-from-square"></i> 사이트에서 확인</a>
              </div>
            </form>
          </div>

          <div class="set-card">
            <h2><i class="fa-solid fa-circle-question" style="color:var(--accent)"></i> 어떻게 측정되나요?</h2>
            <div class="set-guide">
              <b>페이션트 퍼널 핵심 전환점이 자동 측정됩니다.</b>
              <ol>
                <li><b>전화 클릭</b> → <code>click_phone</code> (헤더·플로팅·푸터 위치 구분)</li>
                <li><b>예약 페이지/버튼</b> → <code>click_reservation</code></li>
                <li><b>예약 폼 제출</b> → <code>reservation_submit</code> + <code>generate_lead</code> (최상위 전환)</li>
                <li><b>카카오 채널</b> → <code>click_kakao</code></li>
                <li><b>길찾기</b> → <code>click_directions</code></li>
              </ol>
              <p style="margin:12px 0 0">개인정보 보호를 위해 <b>Google Consent Mode v2</b>가 적용되어 광고 식별자는 기본 차단, 익명 방문 통계만 수집합니다. (의료광고·개인정보 안전)</p>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  )
}

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
.adm-popup-box{border:1px dashed color-mix(in oklab,var(--accent) 45%,transparent);background:var(--accent-soft);border-radius:var(--radius-sm);padding:14px 16px}
.adm-popup-box .adm-check{color:var(--accent-d)}
@media(max-width:640px){.adm-form .row{grid-template-columns:1fr}}
`

const AdminShell: FC<{ active: 'notices' | 'columns' | 'cases'; title: string; ok?: string; children: any }> = ({ active, title, ok, children }) => {
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
              <a href="/admin/cases" class={`chip ${active === 'cases' ? 'active' : ''}`} style={active === 'cases' ? 'background:var(--accent);color:#fff;border-color:var(--accent)' : ''}><i class="fa-solid fa-images"></i> 비포/애프터</a>
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
        <div class="adm-popup-box">
          <label class="adm-check"><input type="checkbox" name="popup" /> <i class="fa-solid fa-window-restore" style="color:var(--accent)"></i> 홈 첫 화면에 팝업으로 띄우기</label>
          <p class="adm-hint">체크하면 방문자가 홈에 들어올 때 이 공지가 팝업 창으로 표시됩니다. (여러 개를 체크하면 가장 위 항목 1개만 노출)</p>
          <div style="margin-top:10px"><label>팝업 종료일 <span style="font-weight:400;color:var(--ink-faint)">(선택 · 비우면 직접 끌 때까지 계속 노출)</span></label><input type="date" name="popupUntil" /></div>
        </div>
        <div><button type="submit" class="btn btn-gold"><i class="fa-solid fa-check"></i> 등록하기</button></div>
      </form>
    </details>

    {notices.length === 0 && <p style="color:var(--ink-soft)">등록된 공지가 없습니다.</p>}
    {notices.map((n) => (
      <div class="adm-card">
        <div class="adm-meta">{n.pinned && <span class="adm-pin">중요</span>}{n.popup && <span class="adm-pin" style="background:var(--accent-d)"><i class="fa-solid fa-window-restore"></i> 팝업</span>}<span>{n.date}</span>{n.popup && n.popupUntil && <span style="color:var(--accent-d)">팝업 ~{n.popupUntil}</span>}<span style="color:var(--ink-faint)">수정 {n.modified}</span></div>
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
              <div class="adm-popup-box">
                <label class="adm-check"><input type="checkbox" name="popup" checked={n.popup} /> <i class="fa-solid fa-window-restore" style="color:var(--accent)"></i> 홈 첫 화면에 팝업으로 띄우기</label>
                <div style="margin-top:10px"><label>팝업 종료일 <span style="font-weight:400;color:var(--ink-faint)">(선택)</span></label><input type="date" name="popupUntil" value={n.popupUntil || ''} /></div>
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

// ============================================================
// 슈퍼 블로그 에디터: 리치 툴바 + 드래그/붙여넣기 이미지(alt 입력) + 실시간 미리보기 + 글자수
// ============================================================
const EDITOR_CSS = `
.ed-wrap{position:relative}
.ed-toolbar{display:flex;gap:5px;flex-wrap:wrap;align-items:center;padding:8px;background:var(--bg-2);border:1px solid var(--line);border-bottom:none;border-radius:var(--radius-sm) var(--radius-sm) 0 0;position:sticky;top:0;z-index:2}
.ed-btn{padding:6px 11px;font-size:12px;font-weight:700;border:1px solid var(--line);background:var(--card);color:var(--ink-2);border-radius:6px;cursor:pointer;font-family:inherit;display:inline-flex;align-items:center;gap:5px;transition:all .12s}
.ed-btn:hover{background:var(--accent-soft);color:var(--accent-d);border-color:var(--accent)}
.ed-btn.is-on{background:var(--accent);color:#fff;border-color:var(--accent)}
.ed-sep{width:1px;height:20px;background:var(--line);margin:0 3px}
.ed-spacer{flex:1}
.ed-area{border-radius:0 0 var(--radius-sm) var(--radius-sm) !important;border-top:none !important;font-size:14.5px;line-height:1.75}
.ed-area.dragover{border-color:var(--accent) !important;background:var(--accent-soft) !important;outline:2px dashed var(--accent);outline-offset:-4px}
.ed-hint2{font-size:12px;color:var(--ink-faint);margin-top:6px;line-height:1.7}
.ed-hint2 code{background:var(--bg-2);padding:1px 6px;border-radius:4px;font-size:11.5px;color:var(--accent-d)}
.ed-statusbar{display:flex;justify-content:space-between;align-items:center;gap:12px;font-size:12px;color:var(--ink-faint);margin-top:6px;flex-wrap:wrap}
.ed-count b{color:var(--ink-2)}
.ed-uploading{color:var(--accent-d);font-weight:600}
/* 실시간 미리보기 */
.ed-preview-toggle{cursor:pointer;font-weight:700;color:var(--accent-d);background:none;border:none;font-size:12px;display:inline-flex;align-items:center;gap:5px;font-family:inherit}
.ed-preview{display:none;margin-top:14px;border:1px solid var(--line);border-radius:var(--radius-sm);padding:22px 24px;background:var(--card);max-height:520px;overflow-y:auto}
.ed-preview.show{display:block;animation:edfade .2s ease}
@keyframes edfade{from{opacity:0}to{opacity:1}}
.ed-preview h2{font-size:21px;margin:24px 0 10px;line-height:1.4}
.ed-preview h2:first-child{margin-top:0}
.ed-preview h3{font-size:17px;margin:18px 0 8px;color:var(--ink-2)}
.ed-preview p{font-size:15px;line-height:1.8;margin:0 0 14px;color:var(--ink)}
.ed-preview ul{margin:0 0 14px;padding-left:22px}.ed-preview li{margin:4px 0;line-height:1.7}
.ed-preview img{max-width:100%;border-radius:12px;margin:10px 0;display:block}
.ed-preview blockquote{border-left:4px solid var(--accent);background:var(--accent-soft);margin:14px 0;padding:12px 18px;border-radius:0 10px 10px 0;color:var(--ink-2);font-style:italic}
.ed-preview a{color:var(--accent-d);text-decoration:underline}
.ed-preview .ed-prev-empty{color:var(--ink-faint);font-style:italic}
/* 대표이미지 */
.ed-cover{display:flex;gap:14px;align-items:flex-start;flex-wrap:wrap}
.ed-cover-thumb{width:140px;height:90px;border-radius:10px;border:1px solid var(--line);object-fit:cover;background:var(--bg-2);flex-shrink:0}
.ed-cover-thumb.empty{display:flex;align-items:center;justify-content:center;color:var(--ink-faint);font-size:22px}
.ed-cover-ctl{flex:1;min-width:200px;display:grid;gap:8px}
`
const EDITOR_JS = `
(function(){
  // ---------- 마크다운→HTML 간이 렌더 (미리보기용) ----------
  function esc(s){ return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }
  function inline(s){
    s = esc(s);
    s = s.replace(/!\\[(.*?)\\]\\((.*?)\\)/g, ''); // 이미지는 라인 단위로 별도 처리
    s = s.replace(/\\[(.+?)\\]\\((https?:[^)]+)\\)/g, '<a href="$2">$1</a>');
    s = s.replace(/\\*\\*(.+?)\\*\\*/g, '<strong>$1</strong>');
    s = s.replace(/(^|[^*])\\*([^*]+?)\\*(?!\\*)/g, '$1<em>$2</em>');
    return s;
  }
  function renderPreview(text){
    var blocks = text.replace(/\\r\\n/g,'\\n').split(/\\n{2,}/);
    var html = '';
    blocks.forEach(function(blk){
      var lines = blk.split('\\n');
      var firstTrim = (lines[0]||'').trim();
      var richFirst = /^(###\\s|-\\s|!\\[|>\\s)/.test(firstTrim);
      var startIdx = 0;
      // 단락 첫 줄이 마커가 아니면 H2 소제목 취급
      if(lines.length>=2 && !richFirst){ html += '<h2>'+inline(firstTrim)+'</h2>'; startIdx=1; }
      var listBuf=[];
      function flush(){ if(listBuf.length){ html+='<ul>'+listBuf.map(function(li){return '<li>'+inline(li)+'</li>';}).join('')+'</ul>'; listBuf=[]; } }
      for(var i=startIdx;i<lines.length;i++){
        var ln=lines[i].trim();
        if(!ln){ flush(); continue; }
        var img=ln.match(/^!\\[(.*?)\\]\\((.*?)\\)$/);
        if(img){ flush(); html+='<img src="'+img[2]+'" alt="'+esc(img[1])+'">'; continue; }
        if(ln.indexOf('### ')===0){ flush(); html+='<h3>'+inline(ln.slice(4))+'</h3>'; continue; }
        if(ln.indexOf('> ')===0){ flush(); html+='<blockquote>'+inline(ln.slice(2))+'</blockquote>'; continue; }
        if(ln.indexOf('- ')===0){ listBuf.push(ln.slice(2)); continue; }
        flush(); html+='<p>'+inline(ln)+'</p>';
      }
      flush();
    });
    return html || '<p class="ed-prev-empty">본문을 입력하면 여기에 실제 게시 모습이 미리 보입니다.</p>';
  }

  document.querySelectorAll('.ed-wrap').forEach(function(wrap){
    var ta = wrap.querySelector('textarea.ed-area');
    if(!ta) return;
    var bar = wrap.querySelector('.ed-toolbar');
    var preview = wrap.querySelector('.ed-preview');
    var countEl = wrap.querySelector('.ed-count');
    var statusEl = wrap.querySelector('.ed-upstatus');

    function insert(before, after, placeholder){
      var s=ta.selectionStart, e=ta.selectionEnd;
      var sel=ta.value.slice(s,e)||placeholder||'';
      ta.value = ta.value.slice(0,s)+before+sel+(after||'')+ta.value.slice(e);
      ta.focus(); ta.selectionStart=s+before.length; ta.selectionEnd=s+before.length+sel.length;
      sync();
    }
    function sync(){
      if(preview && preview.classList.contains('show')) preview.innerHTML = renderPreview(ta.value);
      if(countEl){ var len=ta.value.length; var words=ta.value.trim()?ta.value.trim().split(/\\s+/).length:0; countEl.innerHTML='<b>'+len+'</b>자 · 약 <b>'+words+'</b>단어'; }
    }

    if(bar) bar.querySelectorAll('.ed-btn').forEach(function(btn){
      btn.addEventListener('click', function(ev){
        ev.preventDefault();
        var cmd=btn.dataset.cmd;
        if(cmd==='h2') insert('\\n\\n','\\n','소제목을 입력하세요');
        else if(cmd==='h3') insert('\\n### ','\\n','작은 소제목');
        else if(cmd==='bold') insert('**','**','강조할 텍스트');
        else if(cmd==='italic') insert('*','*','기울인 텍스트');
        else if(cmd==='list') insert('\\n- ','','목록 항목');
        else if(cmd==='quote') insert('\\n> ','','인용할 문장');
        else if(cmd==='link'){ var url=prompt('링크 주소(URL)를 입력하세요','https://'); if(url) insert('[','](' +url+ ')','링크 텍스트'); }
        else if(cmd==='img'){ wrap.querySelector('.ed-imgfile').click(); }
      });
    });

    // ---------- 이미지 업로드(alt 입력) ----------
    var upCount=0;
    function setStatus(){ if(statusEl) statusEl.textContent = upCount>0 ? ('사진 '+upCount+'장 업로드 중...') : ''; }
    function uploadImages(files, askAlt){
      Array.prototype.forEach.call(files, function(file){
        if(!file.type || file.type.indexOf('image/')!==0) return;
        var alt = '';
        if(askAlt){ alt = (prompt('이 사진의 설명(검색·접근성용 대체텍스트)을 입력하세요\\n예: 디지털 가이드 임플란트 수술 장면', '')||'').trim(); }
        var s=ta.selectionStart;
        var marker='\\n![업로드 중...]('+Date.now()+Math.random()+')\\n';
        ta.value = ta.value.slice(0,s)+marker+ta.value.slice(s);
        upCount++; setStatus(); sync();
        var fd=new FormData(); fd.append('file',file); fd.append('kind','media');
        fetch('/api/admin/upload',{method:'POST',body:fd}).then(function(r){return r.json();}).then(function(j){
          upCount--; setStatus();
          if(j.ok){ ta.value = ta.value.replace(marker, '\\n!['+(alt||'본문 이미지')+']('+j.url+')\\n'); }
          else { ta.value = ta.value.replace(marker,''); alert(j.error||'업로드 실패'); }
          sync();
        }).catch(function(){ upCount--; setStatus(); ta.value=ta.value.replace(marker,''); alert('업로드 중 오류'); sync(); });
      });
    }
    var imgInput = wrap.querySelector('.ed-imgfile');
    if(imgInput) imgInput.addEventListener('change', function(){ uploadImages(imgInput.files, true); imgInput.value=''; });
    // 드래그앤드롭
    ta.addEventListener('dragover', function(e){ e.preventDefault(); ta.classList.add('dragover'); });
    ta.addEventListener('dragleave', function(){ ta.classList.remove('dragover'); });
    ta.addEventListener('drop', function(e){ e.preventDefault(); ta.classList.remove('dragover'); if(e.dataTransfer.files.length) uploadImages(e.dataTransfer.files, true); });
    // 클립보드 붙여넣기 이미지
    ta.addEventListener('paste', function(e){
      var items=(e.clipboardData||{}).items||[];
      var imgs=[];
      for(var i=0;i<items.length;i++){ if(items[i].type && items[i].type.indexOf('image/')===0){ var f=items[i].getAsFile(); if(f) imgs.push(f); } }
      if(imgs.length){ e.preventDefault(); uploadImages(imgs, true); }
    });

    // 글자수/미리보기 동기화
    ta.addEventListener('input', sync);
    var toggle = wrap.querySelector('.ed-preview-toggle');
    if(toggle && preview) toggle.addEventListener('click', function(ev){
      ev.preventDefault();
      preview.classList.toggle('show');
      toggle.innerHTML = preview.classList.contains('show') ? '<i class="fa-solid fa-eye-slash"></i> 미리보기 닫기' : '<i class="fa-solid fa-eye"></i> 실시간 미리보기';
      sync();
    });
    sync();
  });

  // ---------- 대표이미지 업로드 ----------
  document.querySelectorAll('.ed-cover').forEach(function(box){
    var fileInput = box.querySelector('.ed-coverfile');
    var urlInput = box.querySelector('input[name=cover]');
    var thumb = box.querySelector('.ed-cover-thumb');
    var btn = box.querySelector('.ed-cover-btn');
    function setThumb(url){
      if(url){ thumb.style.backgroundImage=''; thumb.classList.remove('empty'); thumb.innerHTML=''; thumb.style.backgroundSize='cover'; thumb.style.backgroundPosition='center'; thumb.style.backgroundImage='url('+url+')'; }
      else { thumb.classList.add('empty'); thumb.style.backgroundImage=''; thumb.innerHTML='<i class="fa-regular fa-image"></i>'; }
    }
    if(urlInput && urlInput.value) setThumb(urlInput.value);
    if(btn && fileInput) btn.addEventListener('click', function(e){ e.preventDefault(); fileInput.click(); });
    if(fileInput) fileInput.addEventListener('change', function(){
      var file=fileInput.files[0]; if(!file) return;
      if(btn){ btn.disabled=true; var ot=btn.innerHTML; btn.innerHTML='<i class="fa-solid fa-spinner fa-spin"></i> 업로드 중'; }
      var fd=new FormData(); fd.append('file',file); fd.append('kind','media');
      fetch('/api/admin/upload',{method:'POST',body:fd}).then(function(r){return r.json();}).then(function(j){
        if(j.ok){ urlInput.value=j.url; setThumb(j.url); } else alert(j.error||'업로드 실패');
      }).catch(function(){ alert('업로드 중 오류'); }).finally(function(){ if(btn){ btn.disabled=false; btn.innerHTML=ot; } fileInput.value=''; });
    });
  });
})();
`

const EditorToolbar: FC = () => (
  <div class="ed-toolbar">
    <button type="button" class="ed-btn" data-cmd="h2" title="소제목(H2)"><i class="fa-solid fa-heading"></i> 소제목</button>
    <button type="button" class="ed-btn" data-cmd="h3" title="작은 소제목(H3)">H3</button>
    <span class="ed-sep" />
    <button type="button" class="ed-btn" data-cmd="bold" title="굵게"><i class="fa-solid fa-bold"></i></button>
    <button type="button" class="ed-btn" data-cmd="italic" title="기울임"><i class="fa-solid fa-italic"></i></button>
    <button type="button" class="ed-btn" data-cmd="list" title="목록"><i class="fa-solid fa-list-ul"></i></button>
    <button type="button" class="ed-btn" data-cmd="quote" title="인용구"><i class="fa-solid fa-quote-right"></i></button>
    <button type="button" class="ed-btn" data-cmd="link" title="링크"><i class="fa-solid fa-link"></i></button>
    <span class="ed-sep" />
    <button type="button" class="ed-btn" data-cmd="img" title="사진 삽입(드래그·붙여넣기 가능)"><i class="fa-solid fa-image"></i> 사진</button>
    <span class="ed-spacer" />
    <button type="button" class="ed-preview-toggle"><i class="fa-solid fa-eye"></i> 실시간 미리보기</button>
  </div>
)

// 대표이미지 업로드 위젯
const CoverField: FC<{ cover?: string; coverAlt?: string }> = ({ cover, coverAlt }) => (
  <div class="ed-cover">
    <div class={`ed-cover-thumb ${cover ? '' : 'empty'}`} style={cover ? `background-image:url(${cover});background-size:cover;background-position:center` : ''}>{cover ? '' : <i class="fa-regular fa-image"></i>}</div>
    <div class="ed-cover-ctl">
      <input type="hidden" name="cover" value={cover || ''} />
      <input type="file" accept="image/*" class="ed-coverfile" style="display:none" />
      <button type="button" class="btn btn-outline btn-sm ed-cover-btn"><i class="fa-solid fa-upload"></i> 대표이미지 업로드</button>
      <input type="text" name="coverAlt" value={coverAlt || ''} placeholder="대표이미지 설명(검색·접근성용 대체텍스트)" />
      <p class="adm-hint">목록 썸네일·카카오/네이버 공유 미리보기·구글 검색 이미지에 사용됩니다. (권장 1200×630)</p>
    </div>
  </div>
)

export const AdminColumnsPage: FC<{ columns: Column[]; ok?: string; views?: Record<string, number> }> = ({ columns, ok, views = {} }) => {
  const treatOpts = TREATMENTS.map((t) => ({ slug: t.slug, name: t.shortName || t.name }))
  return (
    <AdminShell active="columns" title="원장 칼럼 관리" ok={ok}>
      <style dangerouslySetInnerHTML={{ __html: EDITOR_CSS }} />
      {/* 새 칼럼 작성 */}
      <details class="adm-detail" style="margin-bottom:26px">
        <summary><i class="fa-solid fa-plus"></i> 새 칼럼 작성</summary>
        <form class="adm-form" method="post" action="/api/admin/columns/create">
          <div><label>제목</label><input type="text" name="title" required placeholder="예: 디지털 임플란트, 왜 정확할까요?" /></div>
          <div><label>요약(목록·검색·공유 미리보기에 노출 · SEO 핵심)</label><textarea name="excerpt" style="min-height:60px" placeholder="한두 문장으로 요약 (검색결과 설명문으로 쓰입니다)"></textarea></div>
          <div><label>대표이미지</label><CoverField /></div>
          <div class="row">
            <div><label>URL slug(비우면 자동)</label><input type="text" name="slug" placeholder="why-digital-implant" /></div>
            <div><label>날짜</label><input type="date" name="date" /></div>
          </div>
          <div class="row">
            <div><label>작성 의료진</label><select name="author">{DOCTORS.map((d) => <option value={d.slug}>{d.name} {d.title}</option>)}</select></div>
            <div><label>관련 진료</label><select name="related"><option value="">선택 안 함</option>{treatOpts.map((t) => <option value={t.slug}>{t.name}</option>)}</select></div>
          </div>
          <div class="ed-wrap">
            <label>본문</label>
            <EditorToolbar />
            <textarea name="bodyText" class="ed-area" style="min-height:280px" placeholder={'소제목\n본문 내용...\n\n다음 소제목\n다음 단락...'}></textarea>
            <div class="ed-statusbar"><span class="ed-count"></span><span class="ed-upstatus ed-uploading"></span></div>
            <div class="ed-preview"></div>
            <p class="ed-hint2">빈 줄로 단락 구분 · 단락 첫 줄 = 소제목(H2) · <code>### 텍스트</code> = H3 · <code>**굵게**</code> · <code>*기울임*</code> · <code>- 목록</code> · <code>&gt; 인용구</code> · <code>[링크](url)</code> · 사진은 <b>툴바·드래그·붙여넣기</b>로 업로드(설명 입력 시 SEO 자동 반영)</p>
          </div>
          <div><button type="submit" class="btn btn-gold"><i class="fa-solid fa-check"></i> 발행하기</button></div>
        </form>
      </details>

      {columns.length === 0 && <p style="color:var(--ink-soft)">등록된 칼럼이 없습니다.</p>}
      {columns.map((c) => (
        <div class="adm-card">
          <div class="adm-meta"><span>{c.date}</span><span style="color:var(--ink-faint)">/column/{c.slug}</span><span style="color:var(--accent-d);font-weight:700"><i class="fa-regular fa-eye"></i> 조회 {(views[`column:${c.slug}`] || 0).toLocaleString()}</span></div>
          <h3><a href={`/column/${c.slug}`} target="_blank" style="color:var(--ink)">{c.title} <i class="fa-solid fa-arrow-up-right-from-square" style="font-size:11px;color:var(--ink-faint)"></i></a></h3>
          <p class="adm-body-prev">{c.excerpt}</p>
          <div class="adm-actions">
            <details class="adm-detail" style="flex:1">
              <summary><i class="fa-solid fa-pen"></i> 수정</summary>
              <form class="adm-form" method="post" action="/api/admin/columns/update">
                <input type="hidden" name="id" value={c.id} />
                <div><label>제목</label><input type="text" name="title" value={c.title} required /></div>
                <div><label>요약</label><textarea name="excerpt" style="min-height:60px">{c.excerpt}</textarea></div>
                <div><label>대표이미지</label><CoverField cover={c.cover} coverAlt={c.coverAlt} /></div>
                <div class="row">
                  <div><label>URL slug</label><input type="text" name="slug" value={c.slug} /></div>
                  <div><label>날짜</label><input type="date" name="date" value={c.date} /></div>
                </div>
                <div class="row">
                  <div><label>작성 의료진</label><select name="author">{DOCTORS.map((d) => <option value={d.slug} selected={d.slug === c.author}>{d.name} {d.title}</option>)}</select></div>
                  <div><label>관련 진료</label><select name="related"><option value="" selected={!c.related}>선택 안 함</option>{treatOpts.map((t) => <option value={t.slug} selected={t.slug === c.related}>{t.name}</option>)}</select></div>
                </div>
                <div class="ed-wrap"><label>본문</label><EditorToolbar /><textarea name="bodyText" class="ed-area" style="min-height:260px">{bodyToText(c.body)}</textarea><div class="ed-statusbar"><span class="ed-count"></span><span class="ed-upstatus ed-uploading"></span></div><div class="ed-preview"></div><p class="ed-hint2">빈 줄 = 단락 구분 · 첫 줄 = 소제목 · <code>### / ** / * / - / &gt; / [링크](url)</code> · 사진 드래그·붙여넣기 지원</p></div>
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
      <script dangerouslySetInnerHTML={{ __html: EDITOR_JS }}></script>
    </AdminShell>
  )
}

// ============================================================
// ADMIN — 비포/애프터 케이스 관리 (사진 + 의료법 게이팅)
// ============================================================
const PhotoUpload: FC<{ name: string; label: string; kind: 'before' | 'after'; current?: string }> = ({ name, label, kind, current }) => (
  <div class="pu-box" data-name={name} data-kind={kind}>
    <label>{label} {kind === 'after' && <span style="font-size:11px;color:var(--accent-d);font-weight:700">(로그인 게이팅)</span>}</label>
    <input type="hidden" name={name} value={current || ''} />
    <div class="pu-drop">
      {current ? <img src={`/files/${current}`} alt="업로드된 사진" /> : <span class="pu-hint"><i class="fa-solid fa-image"></i> 클릭 또는 드래그하여 업로드</span>}
    </div>
    <input type="file" accept="image/*" class="pu-file" style="display:none" />
  </div>
)

const CASE_ADMIN_JS = `
// 사진 업로드 (클릭/드래그앤드롭 → R2)
document.querySelectorAll('.pu-box').forEach((box) => {
  const drop = box.querySelector('.pu-drop');
  const fileInput = box.querySelector('.pu-file');
  const hidden = box.querySelector('input[type=hidden]');
  const kind = box.dataset.kind === 'after' ? 'after' : 'media';
  const upload = async (file) => {
    if (!file || !file.type.startsWith('image/')) return alert('이미지 파일만 업로드할 수 있습니다.');
    drop.innerHTML = '<span class="pu-hint"><i class="fa-solid fa-spinner fa-spin"></i> 업로드 중...</span>';
    const fd = new FormData(); fd.append('file', file); fd.append('kind', kind);
    try {
      const res = await fetch('/api/admin/upload', { method: 'POST', body: fd });
      const j = await res.json();
      if (j.ok) { hidden.value = j.key; drop.innerHTML = '<img src="/files/' + j.key + '" alt="업로드된 사진">'; }
      else { alert(j.error || '업로드 실패'); drop.innerHTML = '<span class="pu-hint"><i class="fa-solid fa-image"></i> 클릭 또는 드래그하여 업로드</span>'; }
    } catch { alert('업로드 중 오류'); drop.innerHTML = '<span class="pu-hint"><i class="fa-solid fa-image"></i> 클릭 또는 드래그하여 업로드</span>'; }
  };
  drop.addEventListener('click', () => fileInput.click());
  fileInput.addEventListener('change', () => upload(fileInput.files[0]));
  drop.addEventListener('dragover', (e) => { e.preventDefault(); drop.classList.add('over'); });
  drop.addEventListener('dragleave', () => drop.classList.remove('over'));
  drop.addEventListener('drop', (e) => { e.preventDefault(); drop.classList.remove('over'); upload(e.dataTransfer.files[0]); });
});
// 지역 주소 자동완성
document.querySelectorAll('input[data-region-ac]').forEach((input) => {
  const wrap = document.createElement('div'); wrap.className = 'rg-ac';
  input.parentNode.insertBefore(wrap, input.nextSibling);
  let timer;
  input.addEventListener('input', () => {
    clearTimeout(timer);
    const q = input.value.trim();
    if (q.length < 1) { wrap.innerHTML = ''; return; }
    timer = setTimeout(async () => {
      try {
        const res = await fetch('/api/regions?q=' + encodeURIComponent(q));
        const j = await res.json();
        wrap.innerHTML = (j.results || []).map((r) => '<div class="rg-item">' + r + '</div>').join('');
        wrap.querySelectorAll('.rg-item').forEach((it) => it.addEventListener('click', () => { input.value = it.textContent; wrap.innerHTML = ''; }));
      } catch {}
    }, 180);
  });
  document.addEventListener('click', (e) => { if (!wrap.contains(e.target) && e.target !== input) wrap.innerHTML = ''; });
});
`

const CASE_ADMIN_CSS = `
.pu-box label{display:block;margin-bottom:5px}
.pu-drop{border:2px dashed var(--line);border-radius:var(--radius);min-height:96px;display:grid;place-items:center;cursor:pointer;background:var(--bg);transition:all .18s;overflow:hidden;padding:6px}
.pu-drop.over{border-color:var(--accent);background:var(--accent-soft)}
.pu-drop img{max-width:100%;max-height:140px;border-radius:6px;display:block}
.pu-hint{color:var(--ink-faint);font-size:13px;font-weight:600}
.pu-grid{display:grid;grid-template-columns:1fr 1fr;gap:14px}
@media(max-width:640px){.pu-grid{grid-template-columns:1fr}}
.rg-ac{position:relative;z-index:30}
.rg-item{padding:9px 13px;font-size:13px;cursor:pointer;background:var(--card);border:1px solid var(--line);border-top:none;color:var(--ink-2)}
.rg-item:first-child{border-top:1px solid var(--line);border-radius:0 0 0 0}
.rg-item:last-child{border-radius:0 0 8px 8px}
.rg-item:hover{background:var(--accent-soft);color:var(--accent-d)}
`

export const AdminCasesPage: FC<{ cases: CaseItem[]; ok?: string }> = ({ cases, ok }) => {
  const treatOpts = TREATMENTS.map((t) => ({ slug: t.slug, name: t.shortName || t.name }))
  const treatName = (slug: string) => treatOpts.find((t) => t.slug === slug)?.name || '미지정'
  return (
    <AdminShell active="cases" title="비포/애프터 케이스 관리" ok={ok}>
      <style dangerouslySetInnerHTML={{ __html: CASE_ADMIN_CSS }} />
      <div class="adm-toast" style="background:var(--bg-2);color:var(--ink-soft);border-color:var(--line)">
        <i class="fa-solid fa-circle-info"></i> 사진 4장(파노라마 전/후, 구내 전/후)을 업로드할 수 있습니다. 업로드하지 않은 사진은 사이트에 표시되지 않으며, <strong>애프터 사진은 의료법에 따라 로그인 회원에게만</strong> 보입니다.
      </div>
      {/* 새 케이스 작성 */}
      <details class="adm-detail" style="margin-bottom:26px">
        <summary><i class="fa-solid fa-plus"></i> 새 케이스 작성</summary>
        <form class="adm-form" method="post" action="/api/admin/cases/create">
          <div><label>제목</label><input type="text" name="title" required placeholder="예: 디지털 가이드 임플란트 케이스" /></div>
          <div class="row">
            <div><label>진료 분야</label><select name="category"><option value="">선택 안 함</option>{treatOpts.map((t) => <option value={t.slug}>{t.name}</option>)}</select></div>
            <div><label>담당 의료진</label><select name="doctor">{DOCTORS.map((d) => <option value={d.slug}>{d.name} {d.title}</option>)}</select></div>
          </div>
          <div class="row">
            <div><label>연령대</label><input type="text" name="age" placeholder="예: 50대" /></div>
            <div><label>성별</label><input type="text" name="gender" placeholder="예: 남성" /></div>
          </div>
          <div class="row">
            <div><label>거주 지역</label><input type="text" name="area" placeholder="예: 명지 → 부산 강서구 명지동 자동완성" data-region-ac autocomplete="off" /></div>
            <div><label>치료 기간</label><input type="text" name="period" placeholder="예: 약 3개월" /></div>
          </div>
          <div><label>케이스 설명</label><textarea name="desc" placeholder="치료 내용을 간단히 설명하세요"></textarea></div>
          <div class="pu-grid">
            <PhotoUpload name="photoPanoBefore" label="파노라마 사진 (전)" kind="before" />
            <PhotoUpload name="photoPanoAfter" label="파노라마 사진 (후)" kind="after" />
            <PhotoUpload name="photoOralBefore" label="구내 사진 (전)" kind="before" />
            <PhotoUpload name="photoOralAfter" label="구내 사진 (후)" kind="after" />
          </div>
          <div><button type="submit" class="btn btn-gold"><i class="fa-solid fa-check"></i> 등록하기</button></div>
        </form>
      </details>

      {cases.length === 0 && <p style="color:var(--ink-soft)">등록된 케이스가 없습니다.</p>}
      {cases.map((cs) => (
        <div class="adm-card">
          <div class="adm-meta">
            <span class="adm-pin" style="background:var(--accent-2,var(--accent))">{treatName(cs.category)}</span>
            <span>{cs.age} {cs.gender}</span>
            {cs.area && <span style="color:var(--ink-faint)">{cs.area}</span>}
            {cs.period && <span style="color:var(--ink-faint)">{cs.period}</span>}
          </div>
          <h3>{cs.title}</h3>
          <p class="adm-body-prev">{cs.desc}</p>
          <div class="adm-actions">
            <details class="adm-detail" style="flex:1">
              <summary><i class="fa-solid fa-pen"></i> 수정</summary>
              <form class="adm-form" method="post" action="/api/admin/cases/update">
                <input type="hidden" name="id" value={cs.id} />
                <div><label>제목</label><input type="text" name="title" value={cs.title} required /></div>
                <div class="row">
                  <div><label>진료 분야</label><select name="category"><option value="" selected={!cs.category}>선택 안 함</option>{treatOpts.map((t) => <option value={t.slug} selected={t.slug === cs.category}>{t.name}</option>)}</select></div>
                  <div><label>담당 의료진</label><select name="doctor">{DOCTORS.map((d) => <option value={d.slug} selected={d.slug === cs.doctor}>{d.name} {d.title}</option>)}</select></div>
                </div>
                <div class="row">
                  <div><label>연령대</label><input type="text" name="age" value={cs.age} /></div>
                  <div><label>성별</label><input type="text" name="gender" value={cs.gender} /></div>
                </div>
                <div class="row">
                  <div><label>거주 지역</label><input type="text" name="area" value={cs.area} data-region-ac autocomplete="off" /></div>
                  <div><label>치료 기간</label><input type="text" name="period" value={cs.period} /></div>
                </div>
                <div><label>케이스 설명</label><textarea name="desc">{cs.desc}</textarea></div>
                <div class="pu-grid">
                  <PhotoUpload name="photoPanoBefore" label="파노라마 (전)" kind="before" current={cs.photoPanoBefore} />
                  <PhotoUpload name="photoPanoAfter" label="파노라마 (후)" kind="after" current={cs.photoPanoAfter} />
                  <PhotoUpload name="photoOralBefore" label="구내 (전)" kind="before" current={cs.photoOralBefore} />
                  <PhotoUpload name="photoOralAfter" label="구내 (후)" kind="after" current={cs.photoOralAfter} />
                </div>
                <div><button type="submit" class="btn btn-gold btn-sm"><i class="fa-solid fa-floppy-disk"></i> 저장</button></div>
              </form>
            </details>
            <form method="post" action="/api/admin/cases/delete" onsubmit="return confirm('이 케이스를 삭제할까요?')">
              <input type="hidden" name="id" value={cs.id} />
              <button type="submit" class="btn btn-danger btn-sm"><i class="fa-solid fa-trash"></i> 삭제</button>
            </form>
          </div>
        </div>
      ))}
      <script dangerouslySetInnerHTML={{ __html: CASE_ADMIN_JS }}></script>
    </AdminShell>
  )
}

// ============================================================
// ADMIN — 회원 목록 (섹션 7)
// ============================================================
export const AdminMembersPage: FC<{ members: { name: string; email: string; phone: string; marketing: boolean; createdAt: number }[] }> = ({ members }) => (
  <Layout title="회원 관리 | 관리자" description="관리자 전용" path="/admin/members">
    <style dangerouslySetInnerHTML={{ __html: ADMIN_CSS + `
.mem-table{width:100%;border-collapse:collapse;background:var(--card);border:1px solid var(--line);border-radius:var(--radius-lg);overflow:hidden;font-size:14px}
.mem-table th{background:var(--bg-2);text-align:left;padding:12px 16px;font-size:13px;color:var(--ink-2);border-bottom:1px solid var(--line)}
.mem-table td{padding:12px 16px;border-bottom:1px solid var(--line);color:var(--ink-2)}
.mem-table tr:last-child td{border-bottom:none}
.mk-badge{font-size:11px;font-weight:700;padding:3px 10px;border-radius:100px}
.mk-yes{background:var(--accent-soft);color:var(--accent-d)}
.mk-no{background:var(--bg-2);color:var(--ink-faint)}
@media(max-width:720px){.mem-table th:nth-child(4),.mem-table td:nth-child(4){display:none}}
` }} />
    <section class="page-hero" style="padding:120px 0 40px"><div class="container ph-inner"><div class="hero-badge"><i class="fa-solid fa-users"></i> ADMIN</div><h1>회원 관리</h1></div></section>
    <section class="sec">
      <div class="container adm-wrap">
        <div class="adm-bar">
          <div class="chip-row">
            <a href="/admin/dashboard" class="chip"><i class="fa-solid fa-arrow-left"></i> 대시보드</a>
            <span class="chip" style="background:var(--accent);color:#fff;border-color:var(--accent)"><i class="fa-solid fa-users"></i> 회원 {members.length}명</span>
          </div>
        </div>
        {members.length === 0 ? (
          <p style="color:var(--ink-soft)">가입한 회원이 없습니다.</p>
        ) : (
          <table class="mem-table">
            <thead><tr><th>이름</th><th>이메일</th><th>연락처</th><th>마케팅 수신</th><th>가입일</th></tr></thead>
            <tbody>
              {members.map((m) => (
                <tr>
                  <td style="font-weight:700;color:var(--ink)">{m.name}</td>
                  <td>{m.email}</td>
                  <td>{m.phone}</td>
                  <td>{m.marketing ? <span class="mk-badge mk-yes">동의</span> : <span class="mk-badge mk-no">미동의</span>}</td>
                  <td>{m.createdAt ? new Date(m.createdAt).toISOString().slice(0, 10) : '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        <p class="adm-hint" style="margin-top:14px"><i class="fa-solid fa-shield-halved"></i> 회원 개인정보는 개인정보처리방침에 따라 관리되며, 비밀번호는 해시 처리되어 열람할 수 없습니다.</p>
      </div>
    </section>
  </Layout>
)

// ============================================================
// ADMIN — 예약 목록
// ============================================================
const RES_CSS = `
.res-stats{display:grid;grid-template-columns:repeat(auto-fit,minmax(120px,1fr));gap:12px;margin-bottom:22px}
.res-stat{background:var(--card);border:1px solid var(--line);border-radius:var(--radius);padding:16px 18px;box-shadow:var(--sh-sm)}
.res-stat .n{font-size:28px;font-weight:800;line-height:1;color:var(--ink)}
.res-stat .l{font-size:12.5px;color:var(--ink-soft);margin-top:6px;font-weight:600}
.res-stat.hot .n{color:var(--accent-d)}
.res-toolbar{display:flex;gap:10px;flex-wrap:wrap;align-items:center;margin-bottom:18px}
.res-toolbar input[type=search]{flex:1;min-width:180px;padding:10px 14px;border:1px solid var(--line);border-radius:var(--radius-sm);font:inherit;background:var(--bg);color:var(--ink)}
.res-filters{display:flex;gap:6px;flex-wrap:wrap;margin-bottom:18px}
.res-fbtn{padding:7px 14px;border:1px solid var(--line);background:var(--card);border-radius:100px;font-size:13px;font-weight:700;color:var(--ink-2);cursor:pointer}
.res-fbtn.on{background:var(--accent);color:#fff;border-color:var(--accent)}
.res-card{background:var(--card);border:1px solid var(--line);border-left:4px solid var(--line-2);border-radius:var(--radius);padding:18px 20px;margin-bottom:12px;box-shadow:var(--sh-sm)}
.res-card[data-status=new]{border-left-color:#e8a33d}
.res-card[data-status=confirmed]{border-left-color:#1E6FB8}
.res-card[data-status=done]{border-left-color:#16a34a}
.res-card[data-status=canceled]{border-left-color:#cbd2da;opacity:.7}
.res-top{display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap;margin-bottom:8px}
.res-name{font-size:17px;font-weight:800;margin:0}
.res-name a{color:var(--accent-d)}
.res-badge{font-size:11px;font-weight:800;padding:3px 11px;border-radius:100px;letter-spacing:.02em}
.res-badge.new{background:#fdf0d9;color:#a96a13}
.res-badge.confirmed{background:#e3eefb;color:#1a56db}
.res-badge.done{background:#e7f8ef;color:#0f7a3d}
.res-badge.canceled{background:#f1f3f5;color:#868e96}
.res-info{font-size:14px;color:var(--ink-2);line-height:1.7;margin:0 0 12px}
.res-info .meta{color:var(--ink-faint);font-size:12.5px}
.res-actions{display:flex;gap:7px;flex-wrap:wrap;align-items:center}
.res-actions select{padding:7px 10px;border:1px solid var(--line);border-radius:var(--radius-sm);font:inherit;font-size:13px;background:var(--bg);color:var(--ink)}
.res-mini{padding:7px 12px;font-size:12.5px;border-radius:var(--radius-sm);border:1px solid var(--line);background:var(--card);color:var(--ink-2);cursor:pointer;font-weight:600;text-decoration:none;display:inline-flex;align-items:center;gap:5px}
.res-mini:hover{border-color:var(--accent);color:var(--accent-d)}
.res-mini.danger:hover{border-color:#d9534f;color:#c0392b}
.res-empty{text-align:center;color:var(--ink-soft);padding:40px 0}
.res-hide{display:none!important}
`

export const AdminReservationsPage: FC<{ items: Reservation[]; stats: ResStats }> = ({ items, stats }) => {
  const fmt = (t: number) => t ? new Date(t).toISOString().slice(0, 16).replace('T', ' ') : '-'
  return (
    <Layout title="예약 관리 | 관리자" description="관리자 전용" path="/admin/reservations">
      <style dangerouslySetInnerHTML={{ __html: ADMIN_CSS + RES_CSS }} />
      <section class="page-hero" style="padding:120px 0 40px"><div class="container ph-inner"><div class="hero-badge"><i class="fa-regular fa-calendar-check"></i> ADMIN</div><h1>예약 운영</h1></div></section>
      <section class="sec">
        <div class="container adm-wrap">
          <div class="adm-bar">
            <div class="chip-row">
              <a href="/admin/dashboard" class="chip"><i class="fa-solid fa-arrow-left"></i> 대시보드</a>
              <a href="/admin/analytics" class="chip"><i class="fa-solid fa-chart-pie"></i> 운영 분석</a>
            </div>
            <div class="chip-row">
              <a href="/api/admin/reservations/export" class="btn btn-outline btn-sm"><i class="fa-solid fa-file-csv"></i> CSV 내보내기</a>
            </div>
          </div>

          {/* 운영 요약 */}
          <div class="res-stats">
            <div class="res-stat hot"><div class="n">{stats.today}</div><div class="l">오늘 접수</div></div>
            <div class="res-stat"><div class="n">{stats.byStatus.new || 0}</div><div class="l">신규 대기</div></div>
            <div class="res-stat"><div class="n">{stats.byStatus.confirmed || 0}</div><div class="l">확정</div></div>
            <div class="res-stat"><div class="n">{stats.byStatus.done || 0}</div><div class="l">완료</div></div>
            <div class="res-stat"><div class="n">{stats.last7}</div><div class="l">최근 7일</div></div>
            <div class="res-stat"><div class="n">{stats.total}</div><div class="l">전체</div></div>
          </div>

          {items.length === 0 ? (
            <p class="res-empty"><i class="fa-regular fa-calendar-xmark" style="font-size:32px;opacity:.3;display:block;margin-bottom:10px"></i>접수된 예약 신청이 없습니다.</p>
          ) : (
            <>
              <div class="res-toolbar">
                <input type="search" id="res-search" placeholder="이름·연락처·진료명 검색…" autocomplete="off" />
              </div>
              <div class="res-filters" id="res-filters">
                <button type="button" class="res-fbtn on" data-f="all">전체 {items.length}</button>
                <button type="button" class="res-fbtn" data-f="new">신규 {stats.byStatus.new || 0}</button>
                <button type="button" class="res-fbtn" data-f="confirmed">확정 {stats.byStatus.confirmed || 0}</button>
                <button type="button" class="res-fbtn" data-f="done">완료 {stats.byStatus.done || 0}</button>
                <button type="button" class="res-fbtn" data-f="canceled">취소 {stats.byStatus.canceled || 0}</button>
              </div>

              <div id="res-list">
                {items.map((r) => {
                  const hay = `${r.name} ${r.phone} ${r.treatment || ''} ${r.message || ''}`.toLowerCase()
                  return (
                    <div class="res-card" data-status={r.status} data-hay={hay}>
                      <div class="res-top">
                        <h3 class="res-name">{r.name} <span style="font-weight:400;font-size:14px;color:var(--ink-soft)">· <a href={`tel:${(r.phone || '').replace(/[^0-9]/g, '')}`}>{r.phone}</a></span></h3>
                        <span class={`res-badge ${r.status}`}>{RES_STATUS_LABEL[r.status] || r.status}</span>
                      </div>
                      <p class="res-info">
                        희망 진료: <b>{r.treatment || '-'}</b> · 희망 날짜: <b>{r.date || '-'}</b>{r.timeSlot ? <> · 시간대: <b>{r.timeSlot}</b></> : ''}<br />
                        {r.message && <>문의: {r.message}<br /></>}
                        <span class="meta">접수: {fmt(r.createdAt)}</span>
                      </p>
                      <div class="res-actions">
                        <form method="post" action="/api/admin/reservations/update" style="display:inline-flex;gap:7px;align-items:center">
                          <input type="hidden" name="key" value={r.key} />
                          <select name="status" onchange="this.form.submit()">
                            {(['new', 'confirmed', 'done', 'canceled'] as const).map((s) => (
                              <option value={s} selected={r.status === s}>{RES_STATUS_LABEL[s]}</option>
                            ))}
                          </select>
                        </form>
                        <button type="button" class="res-mini res-copy"
                          data-msg={`[더착한치과] ${r.name}님, 안녕하세요. 신청해 주신 ${r.treatment || '상담'} 예약${r.date ? ` (희망일: ${r.date})` : ''} 관련하여 연락드립니다.`}>
                          <i class="fa-solid fa-comment"></i> 안내문 복사
                        </button>
                        <form method="post" action="/api/admin/reservations/delete" style="display:inline" onsubmit="return confirm('이 예약을 삭제할까요?')">
                          <input type="hidden" name="key" value={r.key} />
                          <button type="submit" class="res-mini danger"><i class="fa-solid fa-trash"></i> 삭제</button>
                        </form>
                      </div>
                    </div>
                  )
                })}
              </div>
              <p class="res-empty res-hide" id="res-noresult">검색 결과가 없습니다.</p>
            </>
          )}
        </div>
      </section>
      <script dangerouslySetInnerHTML={{ __html: `
        (function(){
          var search=document.getElementById('res-search');
          var filters=document.getElementById('res-filters');
          var cards=Array.prototype.slice.call(document.querySelectorAll('.res-card'));
          var noResult=document.getElementById('res-noresult');
          var curFilter='all';
          function apply(){
            var q=(search&&search.value||'').trim().toLowerCase();
            var shown=0;
            cards.forEach(function(c){
              var okF = curFilter==='all' || c.getAttribute('data-status')===curFilter;
              var okQ = !q || (c.getAttribute('data-hay')||'').indexOf(q)>-1;
              var vis = okF && okQ;
              c.classList.toggle('res-hide', !vis);
              if(vis) shown++;
            });
            if(noResult) noResult.classList.toggle('res-hide', shown>0);
          }
          if(search) search.addEventListener('input', apply);
          if(filters) filters.addEventListener('click', function(e){
            var b=e.target.closest('.res-fbtn'); if(!b) return;
            curFilter=b.getAttribute('data-f');
            filters.querySelectorAll('.res-fbtn').forEach(function(x){x.classList.toggle('on',x===b);});
            apply();
          });
          document.addEventListener('click', function(e){
            var b=e.target.closest('.res-copy'); if(!b) return;
            var msg=b.getAttribute('data-msg')||'';
            navigator.clipboard.writeText(msg).then(function(){
              var t=b.innerHTML; b.innerHTML='<i class="fa-solid fa-check"></i> 복사됨';
              setTimeout(function(){b.innerHTML=t;},1400);
            });
          });
        })();
      ` }} />
    </Layout>
  )
}

// ============================================================
// ADMIN — 운영 분석 (예약 데이터 기반 인사이트)
// 페이션트 퍼널: 어떤 진료가 인기인지, 언제 문의가 몰리는지 → 의사결정
// ============================================================
const ANALYTICS_CSS = `
.an-grid{display:grid;grid-template-columns:1fr 1fr;gap:18px;margin-bottom:18px}
@media(max-width:760px){.an-grid{grid-template-columns:1fr}}
.an-card{background:var(--card);border:1px solid var(--line);border-radius:var(--radius-lg);padding:22px 24px;box-shadow:var(--sh-sm)}
.an-card h3{font-size:15px;margin:0 0 16px;display:flex;align-items:center;gap:8px}
.an-card h3 i{color:var(--accent)}
.funnel-step{display:flex;align-items:center;gap:12px;margin-bottom:10px}
.funnel-bar{flex:1;height:34px;border-radius:8px;background:var(--bg-2);position:relative;overflow:hidden}
.funnel-fill{position:absolute;inset:0;background:linear-gradient(90deg,var(--accent),var(--accent-d));border-radius:8px;display:flex;align-items:center;padding-left:12px;color:#fff;font-weight:700;font-size:13px}
.funnel-lbl{width:88px;font-size:13px;font-weight:700;color:var(--ink-2)}
.funnel-val{width:54px;text-align:right;font-weight:800;font-size:15px}
.conv-rate{text-align:center;padding:18px;background:var(--accent-soft);border-radius:var(--radius);margin-top:6px}
.conv-rate .big{font-size:34px;font-weight:900;color:var(--accent-d);line-height:1}
.conv-rate .cap{font-size:13px;color:var(--ink-soft);margin-top:6px}
.bar-row{display:flex;align-items:center;gap:10px;margin-bottom:9px}
.bar-row .bl{width:96px;font-size:13px;color:var(--ink-2);font-weight:600;text-align:right;flex:0 0 auto}
.bar-track{flex:1;height:22px;background:var(--bg-2);border-radius:6px;overflow:hidden}
.bar-in{height:100%;background:var(--accent);border-radius:6px;min-width:2px}
.bar-row .bn{width:34px;font-size:13px;font-weight:700;color:var(--ink);flex:0 0 auto}
.hour-grid{display:grid;grid-template-columns:repeat(12,1fr);gap:3px;align-items:end;height:120px}
.hour-bar{background:var(--accent);border-radius:3px 3px 0 0;min-height:2px;position:relative}
.hour-bar.peak{background:var(--accent-d)}
.hour-axis{display:grid;grid-template-columns:repeat(12,1fr);gap:3px;margin-top:5px;font-size:9px;color:var(--ink-faint);text-align:center}
.an-note{font-size:13px;color:var(--ink-soft);line-height:1.7;margin:14px 0 0;padding:12px 14px;background:var(--bg-2);border-radius:var(--radius-sm)}
.an-empty{text-align:center;color:var(--ink-soft);padding:30px 0}
`

export const AdminAnalyticsPage: FC<{ stats: ResStats }> = ({ stats }) => {
  const wk = ['일', '월', '화', '수', '목', '금', '토']
  const maxTreat = Math.max(1, ...stats.byTreatment.map((t) => t.count))
  const maxWk = Math.max(1, ...stats.byWeekday)
  const peakWk = stats.byWeekday.indexOf(maxWk)
  // 퍼널: 전체 접수 → 확정 → 완료
  const total = stats.total
  const confirmed = (stats.byStatus.confirmed || 0) + (stats.byStatus.done || 0)
  const done = stats.byStatus.done || 0
  const confRate = total > 0 ? Math.round((confirmed / total) * 100) : 0
  const pct = (n: number) => total > 0 ? Math.max(4, Math.round((n / total) * 100)) : 0
  // 시간대: 2시간 단위 12구간으로 압축
  const hour12 = Array.from({ length: 12 }, (_, i) => stats.byHour[i * 2] + stats.byHour[i * 2 + 1])
  const maxHour12 = Math.max(1, ...hour12)
  const peak12 = hour12.indexOf(maxHour12)

  return (
    <Layout title="운영 분석 | 관리자" description="관리자 전용" path="/admin/analytics">
      <style dangerouslySetInnerHTML={{ __html: ADMIN_CSS + ANALYTICS_CSS }} />
      <section class="page-hero" style="padding:120px 0 40px"><div class="container ph-inner"><div class="hero-badge"><i class="fa-solid fa-chart-pie"></i> ANALYTICS</div><h1>운영 분석</h1></div></section>
      <section class="sec">
        <div class="container adm-wrap">
          <div class="chip-row" style="margin-bottom:24px">
            <a href="/admin/dashboard" class="chip"><i class="fa-solid fa-arrow-left"></i> 대시보드</a>
            <a href="/admin/reservations" class="chip"><i class="fa-regular fa-calendar-check"></i> 예약 운영</a>
          </div>

          {total === 0 ? (
            <p class="an-empty"><i class="fa-solid fa-chart-line" style="font-size:32px;opacity:.3;display:block;margin-bottom:10px"></i>분석할 예약 데이터가 아직 없습니다. 예약이 접수되면 자동으로 인사이트가 생성됩니다.</p>
          ) : (
            <>
              <div class="an-grid">
                {/* 전환 퍼널 */}
                <div class="an-card">
                  <h3><i class="fa-solid fa-filter"></i> 예약 전환 퍼널</h3>
                  <div class="funnel-step"><span class="funnel-lbl">접수</span><div class="funnel-bar"><div class="funnel-fill" style="width:100%">{total}건</div></div></div>
                  <div class="funnel-step"><span class="funnel-lbl">확정+완료</span><div class="funnel-bar"><div class="funnel-fill" style={`width:${pct(confirmed)}%`}>{confirmed}건</div></div></div>
                  <div class="funnel-step"><span class="funnel-lbl">완료</span><div class="funnel-bar"><div class="funnel-fill" style={`width:${pct(done)}%`}>{done}건</div></div></div>
                  <div class="conv-rate"><div class="big">{confRate}%</div><div class="cap">접수 → 확정 전환율</div></div>
                </div>

                {/* 인기 진료 */}
                <div class="an-card">
                  <h3><i class="fa-solid fa-ranking-star"></i> 인기 희망 진료 TOP</h3>
                  {stats.byTreatment.slice(0, 7).map((t) => (
                    <div class="bar-row">
                      <span class="bl">{t.name || '기타'}</span>
                      <div class="bar-track"><div class="bar-in" style={`width:${Math.round((t.count / maxTreat) * 100)}%`}></div></div>
                      <span class="bn">{t.count}</span>
                    </div>
                  ))}
                  <p class="an-note"><i class="fa-solid fa-lightbulb" style="color:var(--accent)"></i> 가장 문의가 많은 진료에 콘텐츠·상담 역량을 집중하세요.</p>
                </div>
              </div>

              <div class="an-grid">
                {/* 요일별 */}
                <div class="an-card">
                  <h3><i class="fa-solid fa-calendar-week"></i> 요일별 문의 분포</h3>
                  {wk.map((d, i) => (
                    <div class="bar-row">
                      <span class="bl" style="width:40px">{d}</span>
                      <div class="bar-track"><div class="bar-in" style={`width:${Math.round((stats.byWeekday[i] / maxWk) * 100)}%${i === peakWk ? ';background:var(--accent-d)' : ''}`}></div></div>
                      <span class="bn">{stats.byWeekday[i]}</span>
                    </div>
                  ))}
                  <p class="an-note"><i class="fa-solid fa-lightbulb" style="color:var(--accent)"></i> <b>{wk[peakWk]}요일</b>에 문의가 가장 많습니다. 데스크 인력·상담 준비를 강화하세요.</p>
                </div>

                {/* 시간대별 */}
                <div class="an-card">
                  <h3><i class="fa-solid fa-clock"></i> 시간대별 문의 분포</h3>
                  <div class="hour-grid">
                    {hour12.map((v, i) => (
                      <div class={`hour-bar ${i === peak12 ? 'peak' : ''}`} style={`height:${Math.round((v / maxHour12) * 100)}%`} title={`${i * 2}-${i * 2 + 2}시: ${v}건`}></div>
                    ))}
                  </div>
                  <div class="hour-axis">
                    {Array.from({ length: 12 }, (_, i) => <span>{i * 2}</span>)}
                  </div>
                  <p class="an-note"><i class="fa-solid fa-lightbulb" style="color:var(--accent)"></i> <b>{peak12 * 2}~{peak12 * 2 + 2}시</b>에 문의가 몰립니다. 야간진료(월·수 20시) 홍보 타이밍 참고.</p>
                </div>
              </div>

              <div class="an-card">
                <h3><i class="fa-solid fa-circle-info"></i> GA4 연동 안내</h3>
                <p style="font-size:14px;color:var(--ink-2);line-height:1.7;margin:0">
                  이 분석은 <b>예약 신청 데이터</b> 기반입니다. 전화 클릭·페이지 방문 등 <b>유입 단계 전환</b>은
                  <a href="/admin/settings" style="color:var(--accent-d);text-decoration:underline"> 설정에서 GA4를 연결</a>하면
                  Google Analytics에서 정밀하게 측정됩니다. (전화·예약·카카오·길찾기 자동 추적)
                </p>
              </div>
            </>
          )}
        </div>
      </section>
    </Layout>
  )
}
