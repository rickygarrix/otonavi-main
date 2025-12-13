"use client"

import { useCallback } from "react"
import AreaSelector from "@/components/filters/AreaSelector"
import AchievementSelector from "@/components/filters/AchievementSelector"
import GenericSelector from "@/components/filters/GenericSelector"
import DrinkSelector from "@/components/filters/DrinkSelector"
import { RegionKey } from "@/app/page"

// ==============================
// 型
// ==============================
type AchievementFilter = {
  hasAward: boolean
  hasMedia: boolean
}

type GenericConfig = {
  title: string
  table: string
  section: string
  columns?: 2 | 3
  onChange: (v: string[]) => void
}

type SectionBlock = {
  key: string
  items: GenericConfig[]
  renderBefore?: () => React.ReactNode
}

type Props = {
  clearKey: number

  setPrefectureIds: (v: string[]) => void
  setAreaIds: (v: string[]) => void

  setStoreTypeKeys: (v: string[]) => void
  setEventTrendKeys: (v: string[]) => void
  setRuleKeys: (v: string[]) => void
  setAchievementFilter: (v: AchievementFilter) => void

  setBaggageKeys: (v: string[]) => void
  setSecurityKeys: (v: string[]) => void
  setToiletKeys: (v: string[]) => void
  setSizeKey: (v: string[]) => void
  setFloorKeys: (v: string[]) => void
  setSeatTypeKeys: (v: string[]) => void
  setSmokingKeys: (v: string[]) => void
  setEnvironmentKeys: (v: string[]) => void
  setOtherKeys: (v: string[]) => void

  setPriceRangeKeys: (v: string[]) => void
  setPricingSystemKeys: (v: string[]) => void
  setDiscountKeys: (v: string[]) => void
  setVipKeys: (v: string[]) => void
  setPaymentMethodKeys: (v: string[]) => void

  setSoundKeys: (v: string[]) => void
  setLightingKeys: (v: string[]) => void
  setProductionKeys: (v: string[]) => void

  setDrinkKeys: (v: string[]) => void
  setFoodKeys: (v: string[]) => void
  setServiceKeys: (v: string[]) => void

  setCustomerKeys: (v: string[]) => void
  setAtmosphereKeys: (v: string[]) => void
  setHospitalityKeys: (v: string[]) => void

  regionRefs: Record<RegionKey, React.RefObject<HTMLDivElement | null>>
  areaRefs: React.MutableRefObject<Record<string, HTMLDivElement | null>>
  drinkCategoryRefs: React.MutableRefObject<Record<string, HTMLDivElement | null>>
  achievementRefs: React.MutableRefObject<Record<string, HTMLDivElement | null>>
  genericSectionRefs: React.MutableRefObject<Record<string, HTMLDivElement | null>>
}

// ==============================
// Component
// ==============================
export default function HomeFilterSections(props: Props) {
  const {
    clearKey,

    setPrefectureIds,
    setAreaIds,

    setStoreTypeKeys,
    setEventTrendKeys,
    setRuleKeys,
    setAchievementFilter,

    setBaggageKeys,
    setSecurityKeys,
    setToiletKeys,
    setSizeKey,
    setFloorKeys,
    setSeatTypeKeys,
    setSmokingKeys,
    setEnvironmentKeys,
    setOtherKeys,

    setPriceRangeKeys,
    setPricingSystemKeys,
    setDiscountKeys,
    setVipKeys,
    setPaymentMethodKeys,

    setSoundKeys,
    setLightingKeys,
    setProductionKeys,

    setDrinkKeys,
    setFoodKeys,
    setServiceKeys,

    setCustomerKeys,
    setAtmosphereKeys,
    setHospitalityKeys,

    regionRefs,
    areaRefs,
    drinkCategoryRefs,
    achievementRefs,
    genericSectionRefs,
  } = props

  // ============================
  // セクションref登録
  // ============================
  const register = useCallback(
    (key: string) => (el: HTMLDivElement | null) => {
      genericSectionRefs.current[key] = el
    },
    [genericSectionRefs]
  )

  // ============================
  // AreaSelector onChange
  // ============================
  const handleAreaChange = useCallback(
    (prefIds: string[], areaIds: string[]) => {
      setPrefectureIds(prefIds)
      setAreaIds(areaIds)
    },
    [setPrefectureIds, setAreaIds]
  )

  // ============================
  // セクション定義（表示順の真実）
  // ============================
  const GENERIC_SECTIONS: SectionBlock[] = [
    {
      key: "店舗",
      renderBefore: () => (
        <>
          <AreaSelector
            clearKey={clearKey}
            onChange={handleAreaChange}
            regionRefs={regionRefs}
            areaRefs={areaRefs}
          />

          <AchievementSelector
            clearKey={clearKey}
            onChange={setAchievementFilter}
            achievementRefs={achievementRefs}
          />
        </>
      ),
      items: [
        { title: "店舗タイプ", table: "store_types", section: "店舗タイプ", columns: 3, onChange: setStoreTypeKeys },
        { title: "イベントの傾向", table: "event_trend_definitions", section: "イベントの傾向", columns: 3, onChange: setEventTrendKeys },
        { title: "ルール / マナー", table: "rule_definitions", section: "ルール / マナー", columns: 3, onChange: setRuleKeys },
      ],
    },
    {
      key: "設備",
      items: [
        { title: "荷物預かり", table: "baggage_definitions", section: "荷物預かり", columns: 3, onChange: setBaggageKeys },
        { title: "セキュリティ", table: "security_definitions", section: "セキュリティ", columns: 3, onChange: setSecurityKeys },
        { title: "トイレ", table: "toilet_definitions", section: "トイレ", columns: 3, onChange: setToiletKeys },
        { title: "広さ", table: "size_definitions", section: "広さ", columns: 3, onChange: setSizeKey },
        { title: "フロアの位置", table: "floor_definitions", section: "フロアの位置", columns: 3, onChange: setFloorKeys },
        { title: "座席タイプ", table: "seat_type_definitions", section: "座席タイプ", columns: 3, onChange: setSeatTypeKeys },
        { title: "喫煙", table: "smoking_definitions", section: "喫煙", columns: 3, onChange: setSmokingKeys },
        { title: "周辺環境", table: "environment_definitions", section: "周辺環境", columns: 3, onChange: setEnvironmentKeys },
        { title: "その他", table: "other_definitions", section: "その他", columns: 3, onChange: setOtherKeys },
      ],
    },
    {
      key: "料金",
      items: [
        { title: "価格帯", table: "price_range_definitions", section: "価格帯", columns: 3, onChange: setPriceRangeKeys },
        { title: "料金システム", table: "pricing_system_definitions", section: "料金システム", columns: 3, onChange: setPricingSystemKeys },
        { title: "ディスカウント", table: "discount_definitions", section: "ディスカウント", columns: 3, onChange: setDiscountKeys },
        { title: "VIP", table: "vip_definitions", section: "VIP", columns: 3, onChange: setVipKeys },
        { title: "支払い方法", table: "payment_method_definitions", section: "支払い方法", columns: 3, onChange: setPaymentMethodKeys },
      ],
    },
    {
      key: "音響・照明・演出",
      items: [
        { title: "音響", table: "sound_definitions", section: "音響", columns: 3, onChange: setSoundKeys },
        { title: "照明", table: "lighting_definitions", section: "照明", columns: 3, onChange: setLightingKeys },
        { title: "演出", table: "production_definitions", section: "演出", columns: 3, onChange: setProductionKeys },
      ],
    },
    {
      key: "飲食・サービス",
      renderBefore: () => (
        <DrinkSelector
          clearKey={clearKey}
          title="ドリンク"
          onChange={setDrinkKeys}
          drinkCategoryRefs={drinkCategoryRefs}
        />
      ),
      items: [
        {
          title: "フード",
          table: "food_definitions",
          section: "フード",
          columns: 3,
          onChange: setFoodKeys,
        },
        {
          title: "サービス",
          table: "service_definitions",
          section: "サービス",
          columns: 3,
          onChange: setServiceKeys,
        },
      ],
    },
    {
      key: "客層・雰囲気",
      items: [
        { title: "客層", table: "customer_definitions", section: "客層", columns: 3, onChange: setCustomerKeys },
        { title: "雰囲気", table: "atmosphere_definitions", section: "雰囲気", columns: 3, onChange: setAtmosphereKeys },
        { title: "接客", table: "hospitality_definitions", section: "接客", columns: 3, onChange: setHospitalityKeys },
      ],
    },
  ]

  return (
    <>
      {GENERIC_SECTIONS.map((block) => (
        <section key={block.key} className="mt-14">
          <h2
            ref={register(block.key)}
            className="px-4 mb-6 text-lg font-bold border-b border-slate-200 pb-2"
          >
            {block.key}
          </h2>

          {block.renderBefore?.()}

          {block.items.map((item) => (
            <GenericSelector
              key={item.table}
              title={item.title}
              table={item.table}
              selection="multi"
              onChange={item.onChange}
              columns={item.columns}
              sectionRef={register(item.section)}
              clearKey={clearKey}
            />
          ))}
        </section>
      ))}
    </>
  )
}