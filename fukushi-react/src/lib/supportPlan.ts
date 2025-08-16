export enum SupportPlanDomainKey {
    DAILY_LIFE = "daily_life",
    HEALTH = "health",
    LEISURE = "leisure",
    COMMUNITY_LIFE = "community_life",
    OTHER_SUPPORT = "other_support",
}

export const SupportPlanDomains = [
    { key: SupportPlanDomainKey.DAILY_LIFE, label: "１ 日 常 生 活" },
    { key: SupportPlanDomainKey.HEALTH, label: "２ 健 康 管" },
    { key: SupportPlanDomainKey.LEISURE, label: "３ 自 由 時 間" },
    { key: SupportPlanDomainKey.COMMUNITY_LIFE, label: "４ 地 域 生 活" },
    { key: SupportPlanDomainKey.OTHER_SUPPORT, label: "５ そ の 他" },
];

export const SupportPlanDomainItems = {
    [SupportPlanDomainKey.DAILY_LIFE]: [
        { id: "1", label: "食 事" },
        { id: "2", label: "入 浴" },
        { id: "3", label: "排せつ" },
        { id: "4", label: "衣服寝具" },
        { id: "5", label: "睡 眠" },
        { id: "6", label: "その他" },
        { id: "7", label: "金銭管理" },
        { id: "8", label: "コミュニケーション" },
    ],
    [SupportPlanDomainKey.HEALTH]: [
        { id: "1", label: "日常管理" },
        { id: "2", label: "服 薬" },
        { id: "3", label: "その他" },
    ],
    [SupportPlanDomainKey.LEISURE]: [
        { id: "1", label: "外 出" },
        { id: "2", label: "買い物" },
        { id: "3", label: "ホーム内" },
        { id: "4", label: "その他" },
    ],
    [SupportPlanDomainKey.COMMUNITY_LIFE]: [
        { id: "1", label: "施設利用" },
        { id: "2", label: "行事参加" },
        { id: "3", label: "居宅サービス利用ほか" },
    ],
    [SupportPlanDomainKey.OTHER_SUPPORT]: [
        { id: "1", label: "夜間対応" },
        { id: "2", label: "帰宅時支援" },
        { id: "3", label: "入院時対応" },
    ],
};


export const timeSlots = [
    "6:00", "7:00", "8:00", "9:00", "10:00",
    "15:00", "16:00", "17:00", "18:00", "19:00",
    "20:00", "21:00", "22:00", "23:00", "24:00"
];

export const supportPlanAssessedOptions = [
        {
            id: "0",
            label: "済み",
        },
        {
            id: "1",
            label: "終了",
        },
    ]

export const supportPlanOptions = [
        {
            id: "0",
            label: "有効",
        },
        {
            id: "1",
            label: "終了",
        },
    ]