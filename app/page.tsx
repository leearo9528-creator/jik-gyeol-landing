"use client";

import { useState, useCallback, useRef } from "react";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase: SupabaseClient | null =
  supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

const PHONE_REGEX = /^01[0-9]-?[0-9]{3,4}-?[0-9]{4}$/;
const KAKAO_OPEN_CHAT_URL = "https://open.kakao.com/o/임시링크";

function formatPhoneNumber(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  if (digits.length <= 3) return digits;
  if (digits.length <= 7) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
}

type UserType = "고객사" | "사장님";

const FORM_CONFIG: Record<
  UserType,
  {
    nameLabel: string;
    namePlaceholder: string;
    categoryLabel: string;
    categoryOptions: { value: string; label: string }[];
    phoneLabel: string;
    phonePlaceholder: string;
    regionLabel: string;
    regionOptions: { value: string; label: string }[];
  }
> = {
  고객사: {
    nameLabel: "기업/관공서/기관명",
    namePlaceholder: "예) (주)○○그룹, △△시청",
    categoryLabel: "필요한 서비스",
    categoryOptions: [
      { value: "푸드트럭 섭외", label: "푸드트럭 섭외" },
      { value: "케이터링", label: "케이터링" },
      { value: "플리마켓 셀러 모집", label: "플리마켓 셀러 모집" },
      { value: "기타", label: "기타" },
    ],
    phoneLabel: "담당자 연락처",
    phonePlaceholder: "010-0000-0000",
    regionLabel: "행사 예정 지역",
    regionOptions: [
      { value: "미정", label: "미정" },
      { value: "서울", label: "서울" },
      { value: "경기", label: "경기" },
      { value: "인천", label: "인천" },
      { value: "강원", label: "강원" },
      { value: "충남", label: "충남" },
      { value: "충북", label: "충북" },
      { value: "경남", label: "경남" },
      { value: "경북", label: "경북" },
      { value: "전남", label: "전남" },
      { value: "전북", label: "전북" },
      { value: "제주", label: "제주" },
    ],
  },
  사장님: {
    nameLabel: "상호명 및 대표자명",
    namePlaceholder: "예) 맛있는 닭꼬치 · 홍길동",
    categoryLabel: "제공 서비스",
    categoryOptions: [
      { value: "푸드트럭", label: "푸드트럭" },
      { value: "공방 출강", label: "공방 출강" },
      { value: "플리마켓 셀러", label: "플리마켓 셀러" },
      { value: "기타", label: "기타" },
    ],
    phoneLabel: "대표 연락처",
    phonePlaceholder: "010-0000-0000",
    regionLabel: "주 활동 지역",
    regionOptions: [
      { value: "전국구(지역상관없음)", label: "전국구(지역상관없음)" },
      { value: "서울", label: "서울" },
      { value: "경기", label: "경기" },
      { value: "인천", label: "인천" },
      { value: "강원", label: "강원" },
      { value: "충남", label: "충남" },
      { value: "충북", label: "충북" },
      { value: "경남", label: "경남" },
      { value: "경북", label: "경북" },
      { value: "전남", label: "전남" },
      { value: "전북", label: "전북" },
      { value: "제주", label: "제주" },
    ],
  },
};

/* 토스 스타일 통일: 글꼴·색상·크기 */
const STYLES = {
  /* 타이포 */
  heroTitle:
    "text-[20px] min-[375px]:text-[22px] sm:text-[26px] font-bold leading-[1.5] tracking-[-0.06em] break-keep text-[#191F28]",
  sectionTitle:
    "text-[20px] sm:text-[22px] font-bold text-[#191F28] break-keep leading-[1.4]",
  cardTitle: "text-[18px] sm:text-[20px] font-bold text-[#191F28] break-keep leading-[1.45]",
  body: "text-[15px] sm:text-[16px] font-medium leading-[1.65] break-keep text-[#191F28]",
  bodySecondary: "text-[15px] sm:text-[16px] font-medium leading-[1.65] break-keep text-[#4E5968]",
  bodySmall: "text-[14px] sm:text-[15px] font-medium leading-[1.6] break-keep text-[#4E5968]",
  label: "text-[14px] font-semibold text-[#8B95A1] mb-2 ml-1 block",
  caption: "text-[13px] sm:text-[14px] font-bold text-[#3182F6] break-keep",
  /* 카드/박스 */
  box: "w-full rounded-[20px] p-6 sm:p-7 border border-[#E8ECF4] shadow-sm",
  boxGray: "w-full rounded-[20px] p-6 sm:p-7 bg-[#F7F9FC] border border-[#E8ECF4] shadow-sm",
  boxWhite: "w-full rounded-[20px] p-6 sm:p-7 bg-white border border-[#E8ECF4] shadow-sm",
  /* 폼 */
  input:
    "w-full min-h-[48px] h-[58px] px-5 rounded-[16px] bg-[#F2F4F6] border-none outline-none focus:bg-[#E8F4FF] focus:ring-2 focus:ring-[#3182F6]/20 transition-all font-semibold text-[16px] placeholder:text-[#B0B8C1] [font-size:16px]",
  select:
    "w-full min-h-[48px] h-[58px] px-5 rounded-[16px] bg-[#F2F4F6] border-none outline-none focus:bg-[#E8F4FF] transition-all font-semibold text-[16px] appearance-none cursor-pointer [font-size:16px]",
  btnPrimary:
    "w-full h-[64px] bg-[#3182F6] hover:bg-[#1B64DA] text-white font-bold text-[17px] sm:text-[18px] rounded-[20px] shadow-sm active:scale-[0.98] transition-all disabled:opacity-50",
  btnSecondary:
    "w-full py-4 px-4 bg-[#3182F6] hover:bg-[#1B64DA] text-white font-bold text-[15px] sm:text-[16px] rounded-[18px] active:scale-[0.97] transition-all",
} as const;

export default function LandingPage() {
  const formSectionRef = useRef<HTMLDivElement>(null);
  const [userType, setUserType] = useState<UserType>("고객사");
  const defaultConfig = FORM_CONFIG["고객사"];
  const [formData, setFormData] = useState({
    business_name: "",
    category: defaultConfig.categoryOptions[0]?.value ?? "",
    phone_number: "",
    region: defaultConfig.regionOptions[0]?.value ?? "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const config = FORM_CONFIG[userType];

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      const nextValue = name === "phone_number" ? formatPhoneNumber(value) : value;
      setFormData((prev) => ({ ...prev, [name]: nextValue }));
    },
    []
  );

  const handleUserTypeChange = useCallback((type: UserType) => {
    setUserType(type);
    const nextConfig = FORM_CONFIG[type];
    setFormData((prev) => ({
      ...prev,
      category: nextConfig.categoryOptions[0]?.value ?? "",
      region: nextConfig.regionOptions[0]?.value ?? "",
    }));
  }, []);

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      const phone = formData.phone_number.replace(/\s/g, "");
      if (!PHONE_REGEX.test(phone)) {
        alert("연락처를 올바르게 입력해 주세요. (예: 010-1234-5678)");
        return;
      }

      if (!supabase) {
        alert("서비스 설정이 완료되지 않았습니다. 잠시 후 다시 시도해 주세요.");
        return;
      }

      setIsSubmitting(true);
      try {
        const { error } = await supabase.from("sellers").insert([
          {
            ...formData,
            phone_number: phone,
            user_type: userType,
          },
        ]);
        if (error) {
          if (process.env.NODE_ENV === "development") console.error("Supabase insert error:", error);
          alert("앗, 일시적인 오류가 발생했습니다. 다시 시도해 주세요!");
        } else {
          setIsSuccess(true);
        }
      } finally {
        setIsSubmitting(false);
      }
    },
    [formData, userType]
  );

  const handleShare = useCallback(async () => {
    const url = window.location.href;
    const shareData = {
      title: "직결 - 행사 매칭 플랫폼",
      url,
    };

    const copyToClipboard = async () => {
      try {
        await navigator.clipboard.writeText(url);
        alert("주소가 복사되었습니다. 단톡방에 붙여넣어 주세요!");
      } catch {
        alert("주소 복사에 실패했습니다. 주소를 직접 복사해 주세요.");
      }
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await copyToClipboard();
      }
    } catch (err) {
      const isAbort = err instanceof Error && (err as Error).name === "AbortError";
      if (isAbort) return;
      await copyToClipboard();
    }
  }, []);

  const categoryValue = formData.category || (config.categoryOptions[0]?.value ?? "");
  const regionValue = formData.region || (config.regionOptions[0]?.value ?? "");

  const contentPadding = "px-4 min-[400px]:px-5 sm:px-6";

  return (
    <div className="min-h-screen min-h-[100dvh] bg-[#F9FAFB] text-[#191F28] font-sans antialiased tracking-[-0.05em] flex flex-col items-center overflow-x-hidden">
      <header className="fixed top-0 left-0 right-0 z-50 w-full bg-white/90 backdrop-blur-xl border-b border-[#F2F4F6] safe-area-top">
        <div className={`max-w-md w-full mx-auto ${contentPadding} py-4 sm:py-5 flex flex-col justify-center items-center gap-1 text-center`}>
          <div className="flex items-end justify-center gap-1.5 flex-wrap">
            <h1 className="text-[22px] font-bold tracking-[-0.06em] text-[#191F28] leading-none">
              직결<span className="text-[#3182F6]">.</span>
            </h1>
            <span className="text-[12px] sm:text-[13px] font-medium text-[#8B95A1] tracking-[-0.02em] leading-none break-keep">
              가장 투명하고 빠른 다이렉트 매칭 플랫폼,
            </span>
          </div>
        </div>
      </header>

      <main
        className={`w-full max-w-md mx-auto ${contentPadding} main-content-offset pb-20 sm:pb-24 flex flex-col items-center`}
        style={{ paddingBottom: "max(5rem, env(safe-area-inset-bottom))" }}
      >
        <div className="w-full flex flex-col items-center space-y-12 sm:space-y-14">
        {/* 히어로 섹션 */}
        <section className="w-full space-y-5 text-center">
          <h2 className={STYLES.heroTitle}>
            <span className="text-[#3182F6]">불필요한 마진</span>은 걷어내고,
            <br />
            <span className="text-[#3182F6]">파트너의 가치</span>는 높였습니다.
          </h2>
          <p className={STYLES.bodySecondary}>
            행사 담당자와 검증된 파트너가
            <br />
            직접 만나는 가장 투명한 방법, <span className="text-[#3182F6] font-bold text-[18px] sm:text-[20px]">직결</span>.
          </p>
        </section>

        {/* 고충 공감 섹션 (위 여백 절반으로 축소) */}
        <section className="w-full space-y-4 -mt-6 sm:-mt-7">
          <div className="space-y-4">
            {/* 한 박스: 담당자 고민 → 파트너 고민 → 직결 답 (순서) */}
            <div className={`${STYLES.boxGray} text-center space-y-5`}>
              <div>
                <p className={`${STYLES.caption} mb-3`}>🏢 행사 담당자의 고민</p>
                <p className={`${STYLES.body} whitespace-normal`}>
                  행사 예산에 맞는 업체를 찾고 견적을 비교하는 일, 그동안 얼마나 많은 리소스를 쓰셨나요?
                  <br />
                  대행사에 맡겨도 소통은 느리고 결과물은 아쉬웠던 경험, 이제는 끝낼 때가 됐습니다.
                  <br />
                  공고 하나만 올리세요. 검증된 파트너들이 제안하는 맞춤 견적을 앉아서 받아볼 수 있습니다.
                </p>
              </div>
              <div className="pt-2 border-t border-[#E8ECF4]">
                <p className={`${STYLES.caption} mb-3`}>🧑‍🍳 행사 파트너의 고민</p>
                <p className={`${STYLES.body} whitespace-normal`}>
                  매일 공고 찾으러 다니는 시간, 아깝지 않으셨나요?
                  <br />
                  나에게 꼭 맞는 행사를 찾기 위해 쏟았던 불필요한 에너지를 줄여보세요. 직결에서는 내 조건에 맞는 공고만 쏙쏙 골라 투명하게 입찰할 수 있습니다.
                </p>
              </div>
              <div className="pt-2 border-t border-[#E8ECF4]">
                <p className={`${STYLES.caption} mb-3`}>✨ 직결이 답합니다</p>
                <p className={`${STYLES.body} whitespace-normal`}>
                  주최사는 공고 하나로 견적을 받고,
                  <br />
                  파트너는 조건에 맞는 공고만 골라 입찰합니다.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 쓰리 스텝: 공고 등록 → 견적 비교 → 직결 진행 */}
        <section className="w-full space-y-0">
          <h3 className={`${STYLES.sectionTitle} text-center mb-5 sm:mb-6`}>직결의 시스템</h3>
          <div className={`${STYLES.boxWhite} text-left`}>
            <p className="text-[12px] font-bold text-[#3182F6] mb-2 break-keep">Step 1</p>
            <p className="text-[16px] sm:text-[17px] font-bold text-[#191F28] mb-2 break-keep">📝 공고 등록</p>
            <p className="text-[14px] font-bold text-[#191F28] mb-1.5 break-keep">행사 조건, 딱 한 번만 입력하세요.</p>
            <p className={STYLES.bodySmall}>장소·시간·예산만 적으면 끝.<br />카페·오픈채팅에 반복 올릴 필요 없어요.</p>
          </div>
          <div className="flex justify-center py-1" aria-hidden>
            <span className="text-2xl text-[#3182F6]">↓</span>
          </div>
          <div className={`${STYLES.boxWhite} text-left`}>
            <p className="text-[12px] font-bold text-[#3182F6] mb-2 break-keep">Step 2</p>
            <p className="text-[16px] sm:text-[17px] font-bold text-[#191F28] mb-2 break-keep">📋 견적 비교</p>
            <p className="text-[14px] font-bold text-[#191F28] mb-1.5 break-keep">앉아서 투명한 견적을 받아보세요.</p>
            <p className={STYLES.bodySmall}>검증된 파트너가 직접 견적 제안.<br />가격·서비스를 한눈에 비교하고 딱 맞는 파트너만 고르면 됩니다.</p>
          </div>
          <div className="flex justify-center py-1" aria-hidden>
            <span className="text-2xl text-[#3182F6]">↓</span>
          </div>
          <div className={`${STYLES.boxWhite} text-left`}>
            <p className="text-[12px] font-bold text-[#3182F6] mb-2 break-keep">Step 3</p>
            <p className="text-[16px] sm:text-[17px] font-bold text-[#191F28] mb-2 break-keep">🤝 직결 및 진행</p>
            <p className="text-[14px] font-bold text-[#191F28] mb-1.5 break-keep">중간 마진 없이, 파트너와 직접 만나세요.</p>
            <p className={STYLES.bodySmall}>견적 선택 시 파트너와 즉시 연결.<br />대행 수수료 없이 투명하게 행사를 마무리하세요.</p>
          </div>
        </section>

        {/* 공정한 장터 / 투명한 정보 섹션 (고충 박스와 글꼴·색상 통일) */}
        <section className={`w-full ${STYLES.boxGray} text-center space-y-5`}>
          <div>
            <h3 className={STYLES.cardTitle}>부르는 게 값이었던 시장, 직결이 바꿉니다</h3>
            <p className={`${STYLES.caption} mb-3 mt-1`}>정보가 독점되면 시장은 병듭니다</p>
            <p className="text-[14px] sm:text-[15px] font-medium leading-[1.65] break-keep text-[#191F28] whitespace-normal text-left">
              우리는 불투명한 정보 독점을 해결합니다. 직결은 단순히 연결만 하는 대행사가 아닙니다. 정보가 한쪽으로 쏠려 부르는 게 값이었던 &apos;깜깜이 시장&apos;을 누구나 참여할 수 있는 &apos;투명한 장터&apos;로 바꿉니다. 우리는 건강한 매칭 생태계를 유지하기 위한 최소한의 시스템 운영만 고민합니다.
            </p>
          </div>
        </section>

        {/* 해결책 & 액션 유도 + 폼 섹션 */}
        <div ref={formSectionRef} className="w-full scroll-mt-6 space-y-6">
          <section className="w-full text-center space-y-3 sm:space-y-4">
            <h3 className={STYLES.sectionTitle}>
              빠르고 투명한 1:1 다이렉트 매칭 <span className="text-[#3182F6]">직결</span>.
            </h3>
            <p className={STYLES.bodySecondary}>
              가장 좋은 파트너와 행사 일정은 빠르게 마감됩니다.
            <br />
            지금 바로 사전등록하고 혜택을 선점하세요.
            </p>
          </section>
          {isSuccess ? (
            <div className="bg-white p-8 sm:p-10 rounded-[24px] text-center border border-[#E8ECF4] shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">
              <div className="text-5xl" aria-hidden>🎉</div>
              <h2 className={STYLES.sectionTitle}>사전등록이 완료되었어요 🎉</h2>
              <p className={STYLES.bodySecondary}>
                사전등록 혜택이 적용되었습니다.
                <br />
                런칭 즉시 1순위로 매칭 소식을 보내드릴게요.
              </p>
              <div className="space-y-3 pt-1">
                <a
                  href={KAKAO_OPEN_CHAT_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full bg-[#FEE500] hover:bg-[#FADA0A] text-[#191F28] font-bold py-4 px-4 rounded-[18px] active:scale-[0.97] transition-all text-[15px] sm:text-[16px] leading-tight break-keep text-center"
                  aria-label="실시간 행사 정보 카톡방 열기"
                >
                  💬 실시간 행사 정보, 카톡방에서 먼저 받기
                </a>
                <button
                  type="button"
                  onClick={handleShare}
                  className={STYLES.btnSecondary}
                  aria-label="주변 사장님·담당자에게 공유하기"
                >
                  주변 사장님·담당자에게 공유하기
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* 사용자 유형 선택 탭 (Segmented Control) */}
              <div className="relative p-1.5 rounded-[14px] bg-[#F2F4F6]">
                <div
                  className="absolute top-1.5 bottom-1.5 w-[calc(50%-3px)] rounded-[11px] bg-white shadow-sm transition-all duration-200 ease-out left-1.5"
                  style={{ transform: userType === "사장님" ? "translateX(100%)" : "translateX(0)" }}
                  aria-hidden
                />
                <div className="relative grid grid-cols-2 gap-1">
                  <button
                    type="button"
                    onClick={() => handleUserTypeChange("고객사")}
                    className="relative z-10 min-h-[44px] py-3.5 sm:py-3.5 px-4 rounded-[11px] text-[14px] font-bold transition-colors duration-200"
                    style={{
                      color: userType === "고객사" ? "#191F28" : "#8B95A1",
                    }}
                  >
                    나는 행사 주최자입니다<br />
                    <span className="text-[12px] font-semibold opacity-90">(고객사)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleUserTypeChange("사장님")}
                    className="relative z-10 min-h-[44px] py-3.5 sm:py-3.5 px-4 rounded-[11px] text-[14px] font-bold transition-colors duration-200"
                    style={{
                      color: userType === "사장님" ? "#191F28" : "#8B95A1",
                    }}
                  >
                    나는 행사 파트너입니다<br />
                    <span className="text-[12px] font-semibold opacity-90">(사장님)</span>
                  </button>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-6">
                  <div>
                    <label htmlFor="business_name" className={STYLES.label}>
                      {config.nameLabel}
                    </label>
                    <input
                      id="business_name"
                      type="text"
                      name="business_name"
                      required
                      value={formData.business_name}
                      onChange={handleChange}
                      placeholder={config.namePlaceholder}
                      autoComplete="organization"
                      className={STYLES.input}
                    />
                  </div>

                  <div>
                    <label htmlFor="category" className={STYLES.label}>
                      {config.categoryLabel}
                    </label>
                    <div className="relative">
                      <select
                        id="category"
                        name="category"
                        value={categoryValue}
                        onChange={handleChange}
                        className={STYLES.select}
                      >
                        {config.categoryOptions.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                      <div
                        className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-[#8B95A1]"
                        aria-hidden
                      >
                        ▼
                      </div>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="phone_number" className={STYLES.label}>
                      {config.phoneLabel}
                    </label>
                    <input
                      id="phone_number"
                      type="tel"
                      name="phone_number"
                      required
                      value={formData.phone_number}
                      onChange={handleChange}
                      placeholder={config.phonePlaceholder}
                      autoComplete="tel"
                      inputMode="numeric"
                      className={STYLES.input}
                    />
                  </div>

                  <div>
                    <label htmlFor="region" className={STYLES.label}>
                      {config.regionLabel}
                    </label>
                    <div className="relative">
                      <select
                        id="region"
                        name="region"
                        value={regionValue}
                        onChange={handleChange}
                        className={STYLES.select}
                      >
                        {config.regionOptions.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                      <div
                        className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-[#8B95A1]"
                        aria-hidden
                      >
                        ▼
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  aria-busy={isSubmitting}
                  className={`${STYLES.btnPrimary} mt-2`}
                >
                  {isSubmitting ? "전송 중..." : "사전등록하기 🚀"}
                </button>
              </form>
            </div>
          )}
        </div>

        <p className="text-center text-[#8B95A1] text-[13px] font-medium tracking-widest uppercase">
          © 2026 직결. All rights reserved.
        </p>
        </div>
      </main>
    </div>
  );
}
