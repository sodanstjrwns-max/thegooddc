// 정적 에셋 캐시 버스팅용 버전 문자열.
// Cloudflare가 /static/style.css 에 immutable 1년 캐시를 걸기 때문에,
// CSS/JS를 수정하면 이 값을 올려서 새 URL로 인식시켜야 갱신됩니다.
export const ASSET_VERSION = '20260622d'
