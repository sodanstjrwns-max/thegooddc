import type { FC } from 'hono/jsx'
import { Layout } from '../components/Layout'
import { Breadcrumb } from '../components/ui'
import { CLINIC } from '../data/clinic'

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

export const AdminDashboard: FC<{ stats: { members: number; reservations: number; cases: number; columns: number } }> = ({ stats }) => (
  <Layout title="관리자 대시보드" description="관리자 전용" path="/admin/dashboard">
    <section class="page-hero" style="padding:130px 0 50px"><div class="container ph-inner"><div class="hero-badge"><i class="fa-solid fa-gauge"></i> DASHBOARD</div><h1>관리자 대시보드</h1></div></section>
    <section class="sec">
      <div class="container">
        <div class="stats" style="margin-bottom:40px">
          <div class="stat"><div class="num">{stats.members}</div><div class="lbl">회원</div></div>
          <div class="stat"><div class="num">{stats.reservations}</div><div class="lbl">예약 신청</div></div>
          <div class="stat"><div class="num">{stats.cases}</div><div class="lbl">비포/애프터</div></div>
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
