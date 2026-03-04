# 직결 랜딩 — 태스크 메모

> 지금까지 한 일, 완료 상황, 앞으로 할 일을 정리한 문서입니다.  
> (마지막 업데이트: 2026-02-28)

---

## 1. 완료한 작업

### 1.1 토스 스타일 통일
| 항목 | 상태 | 내용 |
|------|------|------|
| 디자인 토큰 | ✅ | `globals.css`에 `--toss-primary`, `--toss-text-*`, `--toss-border`, `--toss-bg-*`, `--toss-radius` 등 추가 |
| 타이포/색상 | ✅ | `page.tsx`의 `STYLES` 객체로 heroTitle, sectionTitle, cardTitle, body, label, caption, box, input, select, btnPrimary/Secondary 통일 |
| themeColor | ✅ | `layout.tsx`에서 metadata가 아닌 **viewport**로 이동 |

### 1.2 레이아웃·정렬·간격
| 항목 | 상태 | 내용 |
|------|------|------|
| 가운데 정렬 | ✅ | 루트 `flex flex-col items-center`, 메인 `max-w-md mx-auto`, 섹션별 `text-center` / `w-full` 적용 |
| 위아래 간격 균등화 | ✅ | 메인 내부 `space-y-12 sm:space-y-14` 한 번만 사용, 폼 섹션 `pt-2`·푸터 `pt-6` 제거 |

### 1.3 모바일 최적화
| 항목 | 상태 | 내용 |
|------|------|------|
| 가로 패딩 | ✅ | `px-4 min-[400px]:px-5 sm:px-6`로 구간별 균등 적용 |
| 터치 영역 | ✅ | 고객사/사장님 탭 `min-h-[44px]`, input/select `min-h-[48px]`, `[font-size:16px]`(iOS 줌 방지) |
| 세이프 영역 | ✅ | `globals.css`에 `.safe-area-top`, `.main-content-offset` 추가 (노치/다이내믹 아일랜드 대응) |
| 가로 스크롤 방지 | ✅ | 루트 `overflow-x-hidden` |
| 하단 여백 | ✅ | `paddingBottom: max(5rem, env(safe-area-inset-bottom))` 유지 |

### 1.4 코드·문서
| 항목 | 상태 | 내용 |
|------|------|------|
| 린트 | ✅ | `page.tsx`, `layout.tsx`, `globals.css` 기준 오류 없음 |
| PROJECT_STRUCTURE.md | ⚠️ | 존재하나, **실제 UI 구조와 일부 불일치** (아래 “앞으로 할 일” 참고) |

---

## 2. 완료 상황 요약

- **디자인**: 토스 스타일로 통일됨.
- **레이아웃**: 전체 가운데 정렬, 섹션 간격 균등 적용됨.
- **모바일**: 패딩·터치·세이프 영역·overflow 처리 적용됨.
- **기능**: 사전등록 폼(고객사/사장님), Supabase 저장, 성공 화면, 공유하기 동작함.

---

## 3. 앞으로 할 일

### 3.1 필수/권장
| 우선순위 | 내용 | 비고 |
|----------|------|------|
| 1 | **카카오 오픈채팅 URL** | `page.tsx`의 `KAKAO_OPEN_CHAT_URL`이 `"https://open.kakao.com/o/임시링크"` → 실제 링크로 교체 |
| 2 | **metadata description** | `layout.tsx`의 `description: ""` 채우기 (SEO·공유 미리보기용) |
| 3 | **PROJECT_STRUCTURE.md 수정** | 현재 실제 UI(히어로, 고충 박스, 쓰리 스텝, 공정한 장터, 폼, 성공 화면, 푸터)에 맞게 4.2절 구조·설명 갱신 |

### 3.2 선택
| 항목 | 내용 |
|------|------|
| 분석/모니터링 | Vercel Analytics, Supabase 대시보드 등으로 접속·제출 수 확인 |
| 테스트 | 실제 기기에서 세이프 영역·터치 영역·스크롤 확인 |
| 접근성 | 폼 라벨·버튼 `aria-*` 점검, 키보드 포커스 등 |

---

## 4. 참고

- **실제 화면 구조**: `app/page.tsx` 한 파일에 히어로 → 고충 공감(한 박스) → 쓰리 스텝 → 공정한 장터 → 폼(또는 성공) → 푸터.
- **스타일**: `STYLES` 객체 + `globals.css` 토큰/유틸만 사용.
- **환경 변수**: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` 필요.
