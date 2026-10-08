// ============================================================
// SEO / JSON-LD 스키마 헬퍼 (§G)
// ============================================================
import { CLINIC } from '../data/clinic'

const BASE = `https://${CLINIC.domain}`
// 병원 엔티티 @id 단일화 (2026-09-29): #dentist·#organization·#medicalclinic 3개 → #medicalclinic 하나
export const CLINIC_ID = `${BASE}/#medicalclinic`
// 공식 채널 (src/data/clinic.ts sns 에 있는 값만): 네이버 플레이스(예약 링크 주석의 36398883)·카카오 채널
const NAVER_PLACE = 'https://map.naver.com/p/entry/place/36398883'
const SAME_AS = [NAVER_PLACE, CLINIC.sns?.kakao, CLINIC.sns?.instagram, CLINIC.sns?.blog, CLINIC.sns?.youtube].filter((u): u is string => !!u)

export interface SeoMeta {
  title: string
  description: string
  path: string // canonical path
  ogImage?: string
  keywords?: string[]
  type?: 'website' | 'article'
}

export function canonical(path: string) {
  return `${BASE}${path === '/' ? '' : path}`
}

// LocalBusiness + Dentist 스키마 (전역)
export function dentistSchema() {
  const streetAddress = CLINIC.address.replace(/^부산\s*강서구\s*/, '').trim()
  return {
    '@context': 'https://schema.org',
    '@type': 'Dentist',
    '@id': `${BASE}/#dentist`,
    name: CLINIC.name,
    alternateName: CLINIC.nameEn,
    description: CLINIC.philosophy.mission,
    url: BASE,
    telephone: CLINIC.phone,
    email: CLINIC.email,
    image: `${BASE}/images/og-default.jpg`,
    logo: `${BASE}/images/logo.png`,
    priceRange: '₩₩',
    address: {
      '@type': 'PostalAddress',
      streetAddress,
      addressLocality: CLINIC.addressLocality,
      addressRegion: CLINIC.addressRegion,
      postalCode: CLINIC.postalCode,
      addressCountry: 'KR',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: CLINIC.geo.lat,
      longitude: CLINIC.geo.lng,
    },
    openingHoursSpecification: CLINIC.hours
      .filter((h) => !h.closed)
      .map((h) => ({
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: dayToSchema(h.day),
        opens: h.time.split(' - ')[0],
        closes: h.time.split(' - ')[1],
      })),
    medicalSpecialty: 'Dentistry',
  }
}

function dayToSchema(day: string) {
  const map: Record<string, string> = {
    월: 'Monday', 화: 'Tuesday', 수: 'Wednesday', 목: 'Thursday',
    금: 'Friday', 토: 'Saturday', 일: 'Sunday',
  }
  return map[day] || day
}

// Organization
export function organizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'MedicalOrganization',
    '@id': `${BASE}/#organization`,
    name: CLINIC.name,
    url: BASE,
    logo: `${BASE}/images/logo.png`,
    telephone: CLINIC.phone,
    address: {
      '@type': 'PostalAddress',
      addressLocality: CLINIC.addressLocality,
      addressRegion: CLINIC.addressRegion,
      addressCountry: 'KR',
    },
  }
}

// Person (의료진)
export function personSchema(doctor: { name: string; license: string; career: string[]; slug: string; photo?: string }) {
  // 사진 주소는 데이터(doctor.photo)를 신뢰 — slug로 파일명을 추측하면 404가 난다
  const img = doctor.photo
    ? doctor.photo.startsWith('http')
      ? doctor.photo
      : `${BASE}${doctor.photo}`
    : `${BASE}/images/og-default.jpg`
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': `${BASE}/doctors/${doctor.slug}/#person`,
    name: doctor.name,
    jobTitle: doctor.license,
    worksFor: { '@id': CLINIC_ID },
    url: `${BASE}/doctors/${doctor.slug}`,
    description: doctor.career.join(', '),
    image: img,
  }
}

// MedicalProcedure (시술)
export function procedureSchema(t: { name: string; slug: string; summary: string }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'MedicalProcedure',
    name: t.name,
    description: t.summary,
    url: `${BASE}/treatments/${t.slug}`,
    procedureType: 'https://schema.org/SurgicalProcedure',
  }
}

// FAQPage
export function faqSchema(faqs: { q: string; a: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  }
}

// BreadcrumbList
export function breadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: canonical(item.path),
    })),
  }
}

// Article / MedicalWebPage (칼럼)
export function articleSchema(a: {
  title: string; description: string; slug: string
  // 원장 저자 근거가 없으면(후기·이야기 게시판·대행사 시드, lib/authorship.ts) 비워 둔다 → 병원 발행
  datePublished: string; dateModified: string; authorSlug?: string; authorName?: string
  image?: string; wordCount?: number; section?: string
}) {
  const img = a.image ? (/^https?:\/\//.test(a.image) ? a.image : canonical(a.image)) : `${BASE}/images/og-default.jpg`
  const schema: any = {
    '@context': 'https://schema.org',
    '@type': 'MedicalWebPage',
    headline: a.title,
    description: a.description,
    url: `${BASE}/column/${a.slug}`,
    mainEntityOfPage: { '@type': 'WebPage', '@id': `${BASE}/column/${a.slug}` },
    image: { '@type': 'ImageObject', url: img, width: 1200, height: 630 },
    datePublished: a.datePublished,
    dateModified: a.dateModified,
    ...(a.authorSlug && a.authorName
      ? {
          author: { '@type': 'Person', '@id': `${BASE}/doctors/${a.authorSlug}/#person`, name: a.authorName, url: `${BASE}/doctors/${a.authorSlug}` },
          reviewedBy: { '@type': 'Person', '@id': `${BASE}/doctors/${a.authorSlug}/#person`, name: a.authorName },
        }
      : { author: { '@id': CLINIC_ID } }),
    publisher: { '@id': CLINIC_ID },
    inLanguage: 'ko-KR',
  }
  if (a.wordCount) schema.wordCount = a.wordCount
  if (a.section) schema.articleSection = a.section
  return schema
}

// BlogPosting (칼럼 본문 엔티티, 2026-09-29) — 날짜는 저장된 글 데이터(date/modified) 고정값
export function blogPostingSchema(a: {
  title: string; description: string; path: string
  datePublished: string; dateModified: string; authorSlug: string; authorName: string
  image?: string; wordCount?: number; section?: string
}) {
  const url = `${BASE}${a.path}`
  const img = a.image ? (/^https?:\/\//.test(a.image) ? a.image : canonical(a.image)) : `${BASE}/images/og-default.jpg`
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    '@id': `${url}#article`,
    headline: a.title,
    description: a.description,
    url,
    mainEntityOfPage: url,
    image: { '@type': 'ImageObject', url: img },
    datePublished: a.datePublished,
    dateModified: a.dateModified || a.datePublished,
    author: { '@type': 'Person', '@id': `${BASE}/doctors/${a.authorSlug}/#person`, name: a.authorName, url: `${BASE}/doctors/${a.authorSlug}` },
    publisher: { '@id': CLINIC_ID },
    isPartOf: { '@id': `${BASE}/#website` },
    inLanguage: 'ko-KR',
    ...(a.wordCount ? { wordCount: a.wordCount } : {}),
    ...(a.section ? { articleSection: a.section } : {}),
  }
}

// City / AdministrativeArea (지역 SEO)
export function citySchema(area: { name: string; fullName: string }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'City',
    name: area.fullName,
  }
}

// SpeakableSpecification (음성검색)
// 셀렉터는 페이지 실제 DOM 에 있는 것만 넘길 것 (2026-09-29 — 홈 등 .aeo-answer 없는 페이지 교정)
export function speakableSchema(selectors: string[] = ['h1', '.aeo-answer']) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    speakable: {
      '@type': 'SpeakableSpecification',
      cssSelector: selectors,
    },
  }
}

// ============================================================
// 🚀 SEO·AEO 슈퍼머신 확장 스키마
// ============================================================

// WebSite + SearchAction (사이트링크 검색창 / 사이트 식별)
export function webSiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${BASE}/#website`,
    url: BASE,
    name: CLINIC.name,
    alternateName: CLINIC.nameEn,
    inLanguage: 'ko-KR',
    publisher: { '@id': CLINIC_ID },
    potentialAction: {
      '@type': 'SearchAction',
      target: { '@type': 'EntryPoint', urlTemplate: `${BASE}/encyclopedia?cat={search_term_string}` },
      'query-input': 'required name=search_term_string',
    },
  }
}

// MedicalClinic — 가장 강력한 의료기관 스키마 (Dentist 보강)
// 진료과목·결제수단·언어·지역서비스를 명시해 로컬/의료 검색에 최적화
export function medicalClinicSchema() {
  const streetAddress = CLINIC.address.replace(/^부산\s*강서구\s*/, '').trim()
  return {
    '@context': 'https://schema.org',
    '@type': ['MedicalClinic', 'Dentist'],
    '@id': CLINIC_ID,
    name: CLINIC.name,
    alternateName: CLINIC.nameEn,
    description: CLINIC.philosophy?.mission,
    url: BASE,
    telephone: CLINIC.phone,
    email: CLINIC.email,
    image: `${BASE}/images/og-default.jpg`,
    logo: `${BASE}/images/logo.png`,
    priceRange: '₩₩',
    currenciesAccepted: 'KRW',
    paymentAccepted: '현금, 신용카드, 계좌이체',
    availableLanguage: ['Korean'],
    medicalSpecialty: 'Dentistry',
    address: {
      '@type': 'PostalAddress',
      streetAddress,
      addressLocality: CLINIC.addressLocality,
      addressRegion: CLINIC.addressRegion,
      postalCode: CLINIC.postalCode,
      addressCountry: 'KR',
    },
    geo: { '@type': 'GeoCoordinates', latitude: CLINIC.geo.lat, longitude: CLINIC.geo.lng },
    hasMap: NAVER_PLACE,
    sameAs: SAME_AS,
    founder: { '@type': 'Person', name: CLINIC.director },
    foundingDate: CLINIC.openedDate,
    areaServed: ['부산 강서구 명지', '부산 강서구', '부산광역시', '경남 김해', '경남 창원'].map((n) => ({
      '@type': 'City',
      name: n,
    })),
    openingHoursSpecification: (CLINIC.hours || [])
      .filter((h: any) => !h.closed)
      .map((h: any) => ({
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: dayToSchema(h.day),
        opens: h.time.split(' - ')[0],
        closes: h.time.split(' - ')[1],
      })),
    availableService: (CLINIC as any).coreServiceNames || undefined,
  }
}

// AggregateRating — 별점 리치스니펫 (실제 수치 확보 전까지 호출처에서 주입)
export function aggregateRatingSchema(rating: { value: number; count: number; best?: number }) {
  return {
    '@type': 'AggregateRating',
    ratingValue: rating.value,
    reviewCount: rating.count,
    bestRating: rating.best ?? 5,
    worstRating: 1,
  }
}

// Review — 개별 후기 스키마 (환자 동의·실제 후기 확보 시)
export function reviewSchema(review: { author: string; rating: number; body: string; date?: string }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Review',
    itemReviewed: { '@id': CLINIC_ID },
    author: { '@type': 'Person', name: review.author },
    reviewRating: { '@type': 'Rating', ratingValue: review.rating, bestRating: 5, worstRating: 1 },
    reviewBody: review.body,
    datePublished: review.date,
  }
}

// HowTo — 시술/관리 단계 안내 (리치스니펫 + AI 단계형 답변)
export function howToSchema(howto: {
  name: string
  description: string
  steps: { name: string; text: string }[]
  totalTime?: string
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: howto.name,
    description: howto.description,
    totalTime: howto.totalTime,
    step: howto.steps.map((s, i) => ({
      '@type': 'HowToStep',
      position: i + 1,
      name: s.name,
      text: s.text,
    })),
  }
}

// QAPage — 질의응답형 페이지 (FAQPage와 구분, 단일 핵심 질문 강조)
export function qaPageSchema(qa: { question: string; answer: string; author?: string }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'QAPage',
    mainEntity: {
      '@type': 'Question',
      name: qa.question,
      answerCount: 1,
      acceptedAnswer: {
        '@type': 'Answer',
        text: qa.answer,
        author: { '@type': 'Organization', name: CLINIC.name },
      },
    },
  }
}

// ImageObject — 대표 이미지 (이미지 검색 최적화)
export function imageObjectSchema(img: { url: string; caption: string; width?: number; height?: number }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ImageObject',
    contentUrl: canonical(img.url),
    url: canonical(img.url),
    caption: img.caption,
    width: img.width ?? 1200,
    height: img.height ?? 630,
    representativeOfPage: true,
  }
}

// MedicalProcedure 강화판 — 적응증·준비·결과를 담아 AI가 깊게 인용
export function procedureRichSchema(t: {
  name: string
  slug: string
  summary: string
  bodyLocation?: string
  preparation?: string
  followup?: string
  howPerformed?: string
  indications?: string[] // 적응증 — MedicalIndication
  status?: string // 회복·관리 안내
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'MedicalProcedure',
    '@id': `${BASE}/treatments/${t.slug}/#procedure`,
    name: t.name,
    description: t.summary,
    url: `${BASE}/treatments/${t.slug}`,
    procedureType: 'https://schema.org/TherapeuticProcedure',
    bodyLocation: t.bodyLocation || '구강',
    preparation: t.preparation,
    followup: t.followup || t.status,
    howPerformed: t.howPerformed,
    ...(t.indications && t.indications.length
      ? { indication: t.indications.map((i) => ({ '@type': 'MedicalIndication', name: i })) }
      : {}),
    provider: { '@id': CLINIC_ID },
  }
}

// DefinedTerm 강화판 (백과사전 — 용어집 소속 명시)
export function definedTermSchema(term: { slug: string; term: string; def: string; category: string }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'DefinedTerm',
    '@id': `${BASE}/encyclopedia/${term.slug}/#term`,
    name: term.term,
    description: term.def,
    inDefinedTermSet: {
      '@type': 'DefinedTermSet',
      '@id': `${BASE}/encyclopedia/#glossary`,
      name: `${CLINIC.name} 치과 용어 백과사전`,
      url: `${BASE}/encyclopedia`,
    },
    termCode: term.category,
  }
}

// ============================================================
// 🏎️ 부가티급 지역 SEO 전용 스키마
// ============================================================

// City 강화판 — 지역명 + 행정 전체명 + (가능하면) 좌표·소속 지역
export function cityRichSchema(area: {
  name: string
  fullName: string
  region?: string
  landmarks?: string[]
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'City',
    name: area.fullName,
    alternateName: area.name,
    ...(area.region ? { containedInPlace: { '@type': 'AdministrativeArea', name: `${area.region}권` } } : {}),
    ...(area.landmarks && area.landmarks.length
      ? { containsPlace: area.landmarks.map((l) => ({ '@type': 'LandmarksOrHistoricalBuildings', name: l })) }
      : {}),
  }
}

// 지역 허브(랜딩) 전용 LocalBusiness — 해당 지역을 명시적으로 서비스 대상으로 선언
// 본원 #medicalclinic을 areaServed=특정 지역으로 좁혀 "이 지역 치과" 신호를 강화
export function areaLocalBusinessSchema(area: {
  slug: string
  name: string
  fullName: string
  desc: string
  distance?: string
  transit?: string
  geo?: { lat: number; lng: number }
}) {
  // (2026-09-29) 지역마다 별도 병원 엔티티(#localclinic)를 만들지 않고, 본원 CLINIC_ID 에 이 지역 areaServed 만 덧붙인다.
  return {
    '@context': 'https://schema.org',
    '@type': ['MedicalClinic', 'Dentist'],
    '@id': CLINIC_ID,
    name: CLINIC.name,
    url: BASE,
    areaServed: [
      { '@type': 'City', name: area.fullName, alternateName: area.name },
      ...(area.geo
        ? [{
            '@type': 'GeoCircle',
            geoMidpoint: { '@type': 'GeoCoordinates', latitude: area.geo.lat, longitude: area.geo.lng },
            geoRadius: '5000',
          }]
        : []),
    ],
  }
}

// GeoCircle 서비스 반경 — "본원 좌표 중심 N km" 서비스 영역 (로컬 검색 강화)
export function serviceAreaSchema(radiusKm = 20) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    serviceType: '치과 진료 (임플란트·교정·심미치료)',
    provider: { '@id': CLINIC_ID },
    areaServed: {
      '@type': 'GeoCircle',
      geoMidpoint: { '@type': 'GeoCoordinates', latitude: CLINIC.geo.lat, longitude: CLINIC.geo.lng },
      geoRadius: String(radiusKm * 1000), // meters
    },
  }
}

// CollectionPage — 지역 허브가 여러 진료를 묶는 컬렉션임을 명시
export function collectionPageSchema(opts: { name: string; path: string; description: string; items: { name: string; url: string }[] }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: opts.name,
    url: `${BASE}${opts.path}`,
    description: opts.description,
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: opts.items.length,
      itemListElement: opts.items.map((it, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: it.name,
        url: `${BASE}${it.url}`,
      })),
    },
  }
}

// ============================================================
// 🏎️ 부가티급 진료 상세 전용 강화 스키마
// ============================================================

// MedicalWebPage — 의료 콘텐츠 신뢰 신호(작성·검토 주체, 검토일). 구글 의료 E-E-A-T 친화.
export function medicalWebPageSchema(opts: {
  name: string
  path: string
  description: string
  about?: string // 다루는 시술/주제명
  aboutId?: string // MedicalProcedure @id
  lastReviewed: string // YYYY-MM-DD (고정값 필수 — 화면 '최종 검토'와 동일)
  doctorSlug?: string
  doctorName?: string
  doctorTitle?: string
  speakable?: string[]
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'MedicalWebPage',
    '@id': `${BASE}${opts.path}/#medicalwebpage`,
    name: opts.name,
    url: `${BASE}${opts.path}`,
    description: opts.description,
    inLanguage: 'ko-KR',
    lastReviewed: opts.lastReviewed,
    dateModified: opts.lastReviewed,
    ...(opts.aboutId
      ? { about: { '@id': opts.aboutId } }
      : opts.about ? { about: { '@type': 'MedicalProcedure', name: opts.about } } : {}),
    ...(opts.doctorName
      ? {
          reviewedBy: {
            '@type': ['Person', 'Physician'],
            ...(opts.doctorSlug ? { '@id': `${BASE}/doctors/${opts.doctorSlug}/#person` } : {}),
            name: opts.doctorName,
            ...(opts.doctorTitle ? { jobTitle: opts.doctorTitle } : {}),
            medicalSpecialty: 'Dentistry',
          },
        }
      : {}),
    ...(opts.speakable ? { speakable: { '@type': 'SpeakableSpecification', cssSelector: opts.speakable } } : {}),
    publisher: { '@id': CLINIC_ID },
    isPartOf: { '@id': `${BASE}/#website` },
  }
}

// ItemList — 세부 진료(subProcedures)를 구조화 목록으로 노출(리치 결과 후보)
export function itemListSchema(opts: { name: string; path: string; items: { name: string; description?: string }[] }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: opts.name,
    url: `${BASE}${opts.path}`,
    numberOfItems: opts.items.length,
    itemListElement: opts.items.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: it.name,
      ...(it.description ? { description: it.description } : {}),
    })),
  }
}
