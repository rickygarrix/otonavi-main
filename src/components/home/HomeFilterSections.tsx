"use client"

import { useCallback } from "react"
import AreaSelector from "@/components/filters/AreaSelector"
import AchievementSelector from "@/components/filters/AchievementSelector"
import GenericSelector from "@/components/filters/GenericSelector"
import DrinkSelector from "@/components/filters/DrinkSelector"
import { RegionKey } from "@/app/page"

type AchievementFilter = {
  hasAward: boolean
  hasMedia: boolean
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
  // セクション ref 登録（安定）
  // ============================
  const register = useCallback(
    (key: string) => (el: HTMLDivElement | null) => {
      genericSectionRefs.current[key] = el
    },
    [genericSectionRefs]
  )

  // ============================
  // AreaSelector onChange（安定）
  // ============================
  const handleAreaChange = useCallback(
    (prefIds: string[], areaIds: string[]) => {
      setPrefectureIds(prefIds)
      setAreaIds(areaIds)
    },
    [setPrefectureIds, setAreaIds]
  )

  return (
    <>
      {/* ================= エリア ================= */}
      <AreaSelector
        clearKey={clearKey}
        onChange={handleAreaChange}
        regionRefs={regionRefs}
        areaRefs={areaRefs}
      />

      {/* ================= 店舗タイプ ================= */}
      <GenericSelector
        title="店舗タイプ"
        table="store_types"
        selection="multi"
        onChange={setStoreTypeKeys}
        columns={3}
        sectionRef={register("店舗タイプ")}
        clearKey={clearKey}
      />

      <GenericSelector
        title="イベントの傾向"
        table="event_trend_definitions"
        selection="multi"
        onChange={setEventTrendKeys}
        columns={3}
        sectionRef={register("イベントの傾向")}
        clearKey={clearKey}
      />

      <GenericSelector
        title="ルール / マナー"
        table="rule_definitions"
        selection="multi"
        onChange={setRuleKeys}
        columns={3}
        sectionRef={register("ルール / マナー")}
        clearKey={clearKey}
      />

      {/* ================= 実績 ================= */}
      <AchievementSelector
        clearKey={clearKey}
        onChange={setAchievementFilter}
        achievementRefs={achievementRefs}
      />

      {/* ================= 設備 ================= */}
      <GenericSelector
        title="荷物預かり"
        table="baggage_definitions"
        selection="multi"
        onChange={setBaggageKeys}
        columns={3}
        sectionRef={register("荷物預かり")}
        clearKey={clearKey}
      />

      <GenericSelector
        title="セキュリティ"
        table="security_definitions"
        selection="multi"
        onChange={setSecurityKeys}
        columns={3}
        sectionRef={register("セキュリティ")}
        clearKey={clearKey}
      />

      <GenericSelector
        title="トイレ"
        table="toilet_definitions"
        selection="multi"
        onChange={setToiletKeys}
        columns={3}
        sectionRef={register("トイレ")}
        clearKey={clearKey}
      />

      <GenericSelector
        title="広さ"
        table="size_definitions"
        selection="multi"
        onChange={setSizeKey}
        columns={3}
        sectionRef={register("広さ")}
        clearKey={clearKey}
      />

      <GenericSelector
        title="フロアの位置"
        table="floor_definitions"
        selection="multi"
        onChange={setFloorKeys}
        columns={3}
        sectionRef={register("フロアの位置")}
        clearKey={clearKey}
      />

      <GenericSelector
        title="座席タイプ"
        table="seat_type_definitions"
        selection="multi"
        onChange={setSeatTypeKeys}
        columns={3}
        sectionRef={register("座席タイプ")}
        clearKey={clearKey}
      />

      <GenericSelector
        title="喫煙"
        table="smoking_definitions"
        selection="multi"
        onChange={setSmokingKeys}
        columns={3}
        sectionRef={register("喫煙")}
        clearKey={clearKey}
      />

      <GenericSelector
        title="周辺環境"
        table="environment_definitions"
        selection="multi"
        onChange={setEnvironmentKeys}
        columns={3}
        sectionRef={register("周辺環境")}
        clearKey={clearKey}
      />

      <GenericSelector
        title="その他"
        table="other_definitions"
        selection="multi"
        onChange={setOtherKeys}
        columns={3}
        sectionRef={register("その他")}
        clearKey={clearKey}
      />

      {/* ================= 料金 ================= */}
      <GenericSelector
        title="価格帯"
        table="price_range_definitions"
        selection="multi"
        onChange={setPriceRangeKeys}
        columns={3}
        sectionRef={register("価格帯")}
        clearKey={clearKey}
      />

      <GenericSelector
        title="料金システム"
        table="pricing_system_definitions"
        selection="multi"
        onChange={setPricingSystemKeys}
        columns={3}
        sectionRef={register("料金システム")}
        clearKey={clearKey}
      />

      <GenericSelector
        title="ディスカウント"
        table="discount_definitions"
        selection="multi"
        onChange={setDiscountKeys}
        columns={3}
        sectionRef={register("ディスカウント")}
        clearKey={clearKey}
      />

      <GenericSelector
        title="VIP"
        table="vip_definitions"
        selection="multi"
        onChange={setVipKeys}
        columns={3}
        sectionRef={register("VIP")}
        clearKey={clearKey}
      />

      <GenericSelector
        title="支払い方法"
        table="payment_method_definitions"
        selection="multi"
        onChange={setPaymentMethodKeys}
        columns={3}
        sectionRef={register("支払い方法")}
        clearKey={clearKey}
      />

      {/* ================= 音響・照明・演出 ================= */}
      <GenericSelector
        title="音響"
        table="sound_definitions"
        selection="multi"
        onChange={setSoundKeys}
        columns={3}
        sectionRef={register("音響")}
        clearKey={clearKey}
      />

      <GenericSelector
        title="照明"
        table="lighting_definitions"
        selection="multi"
        onChange={setLightingKeys}
        columns={3}
        sectionRef={register("照明")}
        clearKey={clearKey}
      />

      <GenericSelector
        title="演出"
        table="production_definitions"
        selection="multi"
        onChange={setProductionKeys}
        columns={3}
        sectionRef={register("演出")}
        clearKey={clearKey}
      />

      {/* ================= 飲食・サービス ================= */}
      <DrinkSelector
        clearKey={clearKey}
        title="ドリンク"
        onChange={setDrinkKeys}
        drinkCategoryRefs={drinkCategoryRefs}
      />

      <GenericSelector
        title="フード"
        table="food_definitions"
        selection="multi"
        onChange={setFoodKeys}
        columns={3}
        sectionRef={register("フード")}
        clearKey={clearKey}
      />

      <GenericSelector
        title="サービス"
        table="service_definitions"
        selection="multi"
        onChange={setServiceKeys}
        columns={3}
        sectionRef={register("サービス")}
        clearKey={clearKey}
      />

      {/* ================= 客層・雰囲気 ================= */}
      <GenericSelector
        title="客層"
        table="customer_definitions"
        selection="multi"
        onChange={setCustomerKeys}
        columns={3}
        sectionRef={register("客層")}
        clearKey={clearKey}
      />

      <GenericSelector
        title="雰囲気"
        table="atmosphere_definitions"
        selection="multi"
        onChange={setAtmosphereKeys}
        columns={3}
        sectionRef={register("雰囲気")}
        clearKey={clearKey}
      />

      <GenericSelector
        title="接客"
        table="hospitality_definitions"
        selection="multi"
        onChange={setHospitalityKeys}
        columns={3}
        sectionRef={register("接客")}
        clearKey={clearKey}
      />
    </>
  )
}