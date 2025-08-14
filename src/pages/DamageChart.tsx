// src/pages/DamageChart.tsx
import React from "react";
import rawText from "../assets/data.txt?raw"; // 원본 문자열 읽기
import {
    ResponsiveContainer,
    BarChart,
    PieChart,
    Pie,
    Cell,
    Label,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
    CartesianGrid,
    ReferenceLine
} from "recharts";


const RAW =rawText.trim();

/* ------------------------- 유틸 & 타입 ------------------------- */

type Row6 = {
    level: number;
    name: string;      // player_id
    monster: string;   // boss
    damage: number;
    season: number;
    unionRank: number;
};

type Agg = {
    name: string;
    total: number;
} & Record<`m_${string}`, number>;

type PieRow = {
    name: string;     // 예: "Lv 31"
    value: number;    // 해당 레벨의 시도 수(행 개수)
    level: number;    // 숫자 레벨
    ids: string[];    // 이 레벨에 참여한 고유 ID 목록
};

type TooltipItem = {
    value?: number | string;
    name?: string;
    dataKey?: string | number;
    color?: string;
    payload?: unknown;
};

type CustomTooltipProps = {
    active?: boolean;
    payload?: TooltipItem[];
    label?: string | number;
    /** 전시즌 사용자 총합 */
    prevTotals?: Map<string, number>;
    /** 전시즌 번호(표시용) */
    prevSeason?: number;
};

type PieTooltipProps = {
    active?: boolean;
    // recharts가 보내주는 payload 배열의 각 요소 안에 우리가 넣어둔 PieRow가 들어있음
    payload?: Array<{ payload?: PieRow }>;
};


const cssRoot = getComputedStyle(document.documentElement);

// 기본 팔레트(순서 고정) — 시즌별 몬스터 5종을 이 순서로 칠한다
const BASE_PALETTE = [
    (cssRoot.getPropertyValue("--c-talkative") || "#DB4437").trim(), // red
    (cssRoot.getPropertyValue("--c-materialH") || "#F4B400").trim(), // yellow
    (cssRoot.getPropertyValue("--c-victorso") || "#4285F4").trim(),  // blue
    (cssRoot.getPropertyValue("--c-rebuild") || "#0F9D58").trim(),   // green
    (cssRoot.getPropertyValue("--c-latence") || "#FF6F00").trim(),   // orange
];

// KPI용 크롬 톤
const CHROME = {
    red: (cssRoot.getPropertyValue("--c-talkative") || "#DB4437").trim(),
    yellow: (cssRoot.getPropertyValue("--c-materialH") || "#F4B400").trim(),
    blue: (cssRoot.getPropertyValue("--c-victorso") || "#4285F4").trim(),
    green: (cssRoot.getPropertyValue("--c-rebuild") || "#0F9D58").trim(),
};

// '마테리얼h' 표기 정규화 → '마테리얼H'
const normalizeMonster = (m: string) =>
    m.replace(/마테리얼h/g, "마테리얼H");

/** 6열 파싱 */
function parse6(text: string): Row6[] {
    return text
        .split("\n")
        .map((l) => l.trim())
        .filter(Boolean)
        .map((line) => {
            const [lv, id, boss, dmg, ssn, rank] = line.split(",");
            return {
                level: Number(lv),
                name: id.trim(),
                monster: normalizeMonster(boss.trim()),
                damage: Number(String(dmg).replace(/,/g, "").trim()),
                season: Number(ssn),
                unionRank: Number(rank),
            };
        });
}

/** 최신 시즌만 필터링하고, 그 시즌의 몬스터 5종 순서를 뽑는다(등장순). */
function pickLatestSeason(rows: Row6[]) {
    if (!rows.length) return { seasonRows: [] as Row6[], monsters: [] as string[], season: 0, unionRank: 0 };

    const latest = rows.reduce((m, r) => Math.max(m, r.season), 0);
    const seasonRows = rows.filter((r) => r.season === latest);

    // 등장 순서대로 유니크 5종 추출
    const monsters: string[] = [];
    for (const r of seasonRows) {
        if (!monsters.includes(r.monster)) monsters.push(r.monster);
        if (monsters.length === 5) break;
    }

    // 방어적으로 5종 미만이면 이름순 보정
    if (monsters.length < 5) {
        const more = Array.from(new Set(seasonRows.map((r) => r.monster))).sort();
        for (const m of more) {
            if (!monsters.includes(m)) monsters.push(m);
            if (monsters.length === 5) break;
        }
    }

    const unionRank = seasonRows[0]?.unionRank ?? 0;
    return { seasonRows, monsters, season: latest, unionRank };
}

/** (name, monster)로 스택 집계 */
function aggregate(rows: Row6[], monsterOrder: string[]): Agg[] {
    const map = new Map<string, Agg>();

    for (const r of rows) {
        if (!map.has(r.name)) {
            // m_ 접두어를 붙여서 몬스터별 키 초기화
            const base = Object.fromEntries(
                monsterOrder.map((m) => [`m_${m}`, 0])
            ) as Record<`m_${string}`, number>;

            map.set(r.name, { name: r.name, total: 0, ...base });
        }

        const a = map.get(r.name)!;
        if (monsterOrder.includes(r.monster)) {
            const key = `m_${r.monster}` as const;
            a[key] += r.damage;
            a.total += r.damage;
        }
    }

    return Array.from(map.values()).sort((a, b) => b.total - a.total);
}

/** 한국식 단위 */
const formatKor = (n: number) => {
    if (n >= 1_0000_0000_0000) return Math.floor(n / 1_0000_0000_0000) + "조";
    if (n >= 1_0000_0000) return Math.floor(n / 1_0000_0000) + "억";
    return (n || 0).toLocaleString();
};


/** 시즌별 사용자 총합(Map: name -> total) */
function totalsBySeason(rows: Row6[], targetSeason: number): Map<string, number> {
    const m = new Map<string, number>();
    for (const r of rows) {
        if (r.season !== targetSeason) continue;
        m.set(r.name, (m.get(r.name) || 0) + r.damage);
    }
    return m;
}

/** 시즌별 핵심 메트릭 계산 */
function seasonMetrics(rows: Row6[], targetSeason: number) {
    let has = false;
    let total = 0;
    const ids = new Set<string>();
    let rank: number | undefined = undefined;

    for (const r of rows) {
        if (r.season !== targetSeason) continue;
        has = true;
        total += r.damage;
        ids.add(r.name);
        if (rank === undefined) rank = r.unionRank;
    }
    const headcount = ids.size;
    const avg = headcount ? total / headcount : 0;
    return { has, headcount, total, avg, rank };
}

// 기존 Delta 대체
function Delta({
                   delta,
                   isRank,
                   useKor,          // 억/조 포맷 여부 (Damage Total/Avg에서 사용)
                   inline = true,   // 같은 줄(기본) vs 새 줄
               }: {
    delta: number | undefined;
    isRank?: boolean;
    useKor?: boolean;
    inline?: boolean;
}) {
    if (typeof delta !== "number") return <span style={{ opacity: .6, ...(inline ? { marginLeft: 6 } : {}) }}>-</span>;
    if (delta === 0) return <span style={{ opacity: .8, ...(inline ? { marginLeft: 6 } : {}) }}>-</span>;

    const up = delta > 0;
    const color = isRank ? (up ? CHROME.blue : CHROME.red) : (up ? CHROME.red : CHROME.blue);

    const formatted = useKor
        ? formatKor(Math.abs(delta))
        : Math.abs(delta).toLocaleString();

    return (
        <span
            style={{
                fontSize: 12,
                fontWeight: 800,
                color,
                letterSpacing: 0.2,
                ...(inline ? { marginLeft: 6 } : {}), // 새 줄이면 좌측 여백 제거
            }}
        >
      {up ? "▲" : "▼"}{formatted}
    </span>
    );
}




// CustomTooltip
function CustomTooltip({ active, payload, label, prevTotals }: CustomTooltipProps) {
    if (!active || !payload || !payload.length) return null;

    const rows = (payload ?? []).filter(
        (p): p is TooltipItem => p != null && Number(p.value ?? 0) > 0
    );
    if (!rows.length) return null;

    const total = rows.reduce((sum: number, r) => sum + Number(r.value ?? 0), 0);

    const key = String(label ?? "");
    const prev = prevTotals?.get(key);

    return (
        <div
            style={{
                background: "rgba(18,22,35,.96)",
                color: "#eaf0ff",
                padding: "12px 14px",
                borderRadius: 12,
                boxShadow: "0 10px 30px rgba(0,0,0,.35)",
                fontSize: 12,
                minWidth: 220,
            }}
        >
            <div style={{ fontWeight: 700, marginBottom: 8, letterSpacing: 0.2 }}>
                {label}
            </div>

            {rows.map((r) => (
                <div
                    key={String(r.dataKey ?? r.name)}
                    style={{ display: "flex", gap: 10, alignItems: "center", lineHeight: 1.5 }}
                >
          <span
              style={{
                  width: 10,
                  height: 10,
                  background: r.color as string,
                  borderRadius: 3,
                  display: "inline-block",
                  opacity: 0.95,
              }}
          />
                    <span style={{ opacity: 0.9 }}>{r.name}</span>
                    <span style={{ marginLeft: "auto", fontVariantNumeric: "tabular-nums" }}>
            {formatKor(Number(r.value ?? 0))}
          </span>
                </div>
            ))}

            <hr style={{ border: 0, borderTop: "1px solid rgba(255,255,255,.10)", margin: "8px 0" }} />

            {/* 합계 (현재 시즌) */}
            <div style={{ display: "flex", gap: 8 }}>
                <span style={{ opacity: 0.8 }}>합계</span>
                <span style={{ marginLeft: "auto", fontWeight: 700 }}>{formatKor(total)}</span>
            </div>

            {/* 전시즌 한 줄 (합계와는 '형제' 줄로 둬야 레이아웃 안꼬임) */}
            <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
        <span style={{ opacity: 0.8 }}>
          전시즌{ /*typeof prevSeason === "number" ? `(${prevSeason})` : "" */}
        </span>
                <span style={{ marginLeft: "auto", fontWeight: 700 }}>
          {typeof prev === "number" ? formatKor(prev) : "-"}
        </span>
            </div>
        </div>
    );
}



function PieTooltip({ active, payload }: PieTooltipProps) {
    if (!active || !payload || !payload.length) return null;

    const p = (payload[0]?.payload ?? undefined) as PieRow | undefined;
    if (!p) return null;

    const ids = p.ids || [];
    const MAX = 12;
    const shown = ids.slice(0, MAX);
    const remain = Math.max(0, ids.length - shown.length);

    return (
        <div
            style={{
                background: "rgba(18,22,35,.96)",
                color: "#eaf0ff",
                padding: "12px 14px",
                borderRadius: 12,
                boxShadow: "0 10px 30px rgba(0,0,0,.35)",
                fontSize: 12,
                maxWidth: 260,
            }}
        >
            <div style={{ display: "flex", gap: 8, alignItems: "baseline", marginBottom: 8 }}>
                <div style={{ fontWeight: 800 }}>{p.name}</div>
                <div style={{ marginLeft: "auto", opacity: 0.85 }}>
                    {p.value.toLocaleString()}회
                </div>
            </div>
            <div style={{ lineHeight: 1.6 }}>
                {shown.length ? shown.join(", ") : <span style={{ opacity: 0.6 }}>없음</span>}
                {remain > 0 && <span style={{ opacity: 0.6 }}> 외 {remain}명…</span>}
            </div>
        </div>
    );
}

// --- KPI Hover Tooltip (custom) ---------------------------------------------

function KpiHover({ tip, children }: { tip: React.ReactNode; children: React.ReactNode }) {
    const [open, setOpen] = React.useState(false);

    return (
        <div
            style={{ position: "relative", cursor: "default" }} //
            onMouseEnter={() => setOpen(true)}
            onMouseLeave={() => setOpen(false)}
        >
            <div>{children}</div>

            {open && (
                <div
                    style={{
                        position: "absolute",
                        left: "50%",
                        bottom: "calc(100% + 10px)",
                        transform: "translateX(-50%)",
                        background: "rgba(18,22,35,.96)",
                        color: "#eaf0ff",
                        padding: "10px 12px",
                        borderRadius: 12,
                        boxShadow: "0 10px 30px rgba(0,0,0,.35)",
                        fontSize: 12,
                        // ▼ 가로 크기 자동
                        width: "100px",
                        maxWidth: "unset",
                        whiteSpace: "nowrap",
                        zIndex: 10,
                        border: "1px solid rgba(255,255,255,.06)",
                        pointerEvents: "none",
                    }}
                >
                    {tip}
                    <div
                        style={{
                            position: "absolute",
                            left: "50%",
                            top: "100%",
                            transform: "translateX(-50%)",
                            width: 0,
                            height: 0,
                            borderLeft: "6px solid transparent",
                            borderRight: "6px solid transparent",
                            borderTop: "6px solid rgba(18,22,35,.96)",
                            filter: "drop-shadow(0 1px 0 rgba(255,255,255,.06))",
                        }}
                    />
                </div>
            )}
        </div>
    );
}





export default function DamageChart() {
    // 전체 rows 보관
    const allRows = React.useMemo(() => parse6(RAW), []);

    // 최신 시즌 선택
    const { seasonRows, monsters, season, unionRank } = React.useMemo(() => {
        return pickLatestSeason(allRows);
    }, [allRows]);

    // 전시즌(= 최신시즌 - 1) 사용자별 총합
    const prevTotals = React.useMemo(() => {
        return totalsBySeason(allRows, season - 1);
    }, [allRows, season]);

    // 4) 색상 매핑: 최신 시즌 몬스터 5종에 BASE_PALETTE 순서대로 배정
    const COLOR_MAP: Record<string, string> = React.useMemo(() => {
        const m: Record<string, string> = {};
        monsters.forEach((mon, i) => (m[mon] = BASE_PALETTE[i % BASE_PALETTE.length]));
        return m;
    }, [monsters]);

    // 5) 집계(스택용 데이터)
    const data = React.useMemo(() => aggregate(seasonRows, monsters), [seasonRows, monsters]);

    // KPI
    const headcount = data.length;
    const totalDamage = data.reduce((s, a) => s + a.total, 0);
    const avgDamage = totalDamage / Math.max(1, headcount);
    const top5 = data.slice(0, 5);
// 현재/전시즌 메트릭
    const prevSeason = season - 1;
    const currM = React.useMemo(() => seasonMetrics(allRows, season), [allRows, season]);
    const prevM = React.useMemo(() => seasonMetrics(allRows, prevSeason), [allRows, season]);

// 델타 계산 (전시즌 없으면 undefined 처리)
    const deltaRank       = prevM.has && currM.rank != null && prevM.rank != null ? (currM.rank - prevM.rank) : undefined;
//  예시: 전 10위 → 현 12위 => +2(밀림) → ▲2 파랑
//       전 10위 → 현  8위 => -2(상승) → ▼2 빨강

    const deltaHeadcount  = prevM.has ? (currM.headcount - prevM.headcount) : undefined;
    const deltaTotal      = prevM.has ? (currM.total - prevM.total) : undefined;
    const deltaAvg        = prevM.has ? (Math.round(currM.avg) - Math.round(prevM.avg)) : undefined;




    const css = getComputedStyle(document.documentElement);
    const axisTick = { fill: css.getPropertyValue("--muted").trim() || "#9aa3b2", fontSize: 12 };

    const card = {
        background: "var(--panel)",
        border: "1px solid #1a2130",
        borderRadius: 14,
        boxShadow: "0 10px 30px rgba(0,0,0,.35), inset 0 1px 0 rgba(255,255,255,.03)",
    } as const;

    const kpiTitle = { fontSize: 12, color: "var(--muted)", margin: 0 } as const;
    const kpiValue = { fontSize: 22, fontWeight: 800, margin: "6px 0 0", letterSpacing: 0.2 } as const;

    const rankColors = [
        (cssRoot.getPropertyValue("--c-talkative") || "#DB4437").trim(),
        (cssRoot.getPropertyValue("--c-materialH") || "#F4B400").trim(),
        (cssRoot.getPropertyValue("--c-victorso") || "#4285F4").trim(),
        (cssRoot.getPropertyValue("--c-rebuild") || "#0F9D58").trim(),
        (cssRoot.getPropertyValue("--c-talkative") || "#DB4437").trim(),
    ];



    const pieData: PieRow[] = React.useMemo(() => {
        // 최신 시즌(seasonRows)만 사용
        const byLevel = new Map<number, { count: number; ids: Set<string> }>();
        for (const r of seasonRows) {
            if (!byLevel.has(r.level)) byLevel.set(r.level, { count: 0, ids: new Set() });
            const bucket = byLevel.get(r.level)!;
            bucket.count += 1;         // "시도"는 행 단위로 카운트
            bucket.ids.add(r.name);    // 해당 레벨에 포함된 고유 ID 수집
        }
        // 레벨 오름차순으로 정렬하여 파이 데이터 구성
        return Array.from(byLevel.entries())
            .sort((a, b) => a[0] - b[0])
            .map(([level, v]) => ({
                name: `LEVEL ${level}`,
                value: v.count,
                level,
                ids: Array.from(v.ids).sort(),
            }));
    }, [seasonRows]);

// --- 총 시도 수
    const totalAttempts = React.useMemo(
        () => pieData.reduce((s, d) => s + d.value, 0),
        [pieData]
    );


    return (
        <div style={{ minHeight: "100dvh", background: "var(--panel)", overflowX: "auto", WebkitOverflowScrolling: "touch" }}>
            <div style={{ maxWidth: 1680, minWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
                <h2 style={{ fontSize: 22, fontWeight: 800, letterSpacing: .2, margin: "0 0 8px" }}>
                    시삐보털 유니온 레이드 (31차)
                </h2>
                <div style={{ color: "var(--muted)", fontSize: 15, marginBottom: 16 }}>last update: 2025-08-15</div>

                {/* KPI + TOP5 */}
                <div style={{ display: "grid", gridTemplateColumns: "1.7fr 1fr 1fr", gap: 16, marginBottom: 18 }}>
                    {/* KPI */}
                    <div style={{ ...card, padding: 16, display: "flex", flexDirection: "column", minHeight: 140 }}>
                        <div style={{ display: "flex", alignItems: "center", marginBottom: 8 }}>
                            <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>KPI</h3>
                        </div>

                        <div
                            style={{
                                display: "grid",
                                gridTemplateColumns: "repeat(4, 1fr)",
                                gap: 12,
                                alignItems: "stretch",
                                flex: 1,
                                minHeight: 0,
                            }}
                        >
                            {[
                                {
                                    title: "Rank",
                                    value: (
                                        <KpiHover
                                            tip={
                                                <div style={{ minWidth: 160 }}>
                                                    <div style={{ opacity: .8 }}>전시즌</div>
                                                    <div style={{ fontWeight: 800, marginTop: 4 }}>
                                                        {prevM.has && prevM.rank != null ? `${prevM.rank} 위` : "-"}
                                                    </div>

                                                </div>
                                            }
                                        >
                                            <div style={{ textAlign: "center", lineHeight: 1.25 }}>
                                                <div>{(unionRank || "-")} 위</div>
                                                <div style={{ marginTop: 4 }}>
                                                    <Delta delta={deltaRank} isRank inline={false} />
                                                </div>
                                            </div>
                                        </KpiHover>
                                    ),
                                    color: CHROME.red
                                },
                                {
                                    title: "Headcount",
                                    value: (
                                        <KpiHover
                                            tip={
                                                <div style={{ minWidth: 160 }}>
                                                    <div style={{ opacity: .8 }}>전시즌</div>
                                                    <div style={{ fontWeight: 800, marginTop: 4 }}>
                                                        {prevM.has ? `${prevM.headcount.toLocaleString()} 명` : "-"}
                                                    </div>

                                                </div>
                                            }
                                        >
                                            <div style={{ textAlign: "center", lineHeight: 1.25 }}>
                                                <div>{headcount.toLocaleString()} 명</div>
                                                <div style={{ marginTop: 4 }}>
                                                    <Delta delta={deltaHeadcount} inline={false} />
                                                </div>
                                            </div>
                                        </KpiHover>
                                    ),
                                    color: CHROME.yellow
                                },
                                {
                                    title: "Total Damage",
                                    value: (
                                        <KpiHover
                                            tip={
                                                <div style={{ minWidth: 160 }}>
                                                    <div style={{ opacity: .8 }}>전시즌</div>
                                                    <div style={{ fontWeight: 800, marginTop: 4 }}>
                                                        {prevM.has ? formatKor(prevM.total) : "-"}
                                                    </div>

                                                </div>
                                            }
                                        >
                                            <div style={{ textAlign: "center", lineHeight: 1.25 }}>
                                                <div>{formatKor(totalDamage)}</div>
                                                <div style={{ marginTop: 4 }}>
                                                    <Delta delta={deltaTotal} useKor inline={false} />
                                                </div>
                                            </div>
                                        </KpiHover>
                                    ),
                                    color: CHROME.blue
                                },
                                {
                                    title: "Average Damage",
                                    value: (
                                        <KpiHover
                                            tip={
                                                <div style={{ minWidth: 160 }}>
                                                    <div style={{ opacity: .8 }}>전시즌</div>
                                                    <div style={{ fontWeight: 800, marginTop: 4 }}>
                                                        {prevM.has ? formatKor(Math.round(prevM.avg)) : "-"}
                                                    </div>

                                                </div>
                                            }
                                        >
                                            <div style={{ textAlign: "center", lineHeight: 1.25 }}>
                                                <div>{formatKor(Math.round(avgDamage))}</div>
                                                <div style={{ marginTop: 4 }}>
                                                    <Delta delta={deltaAvg} useKor inline={false} />
                                                </div>
                                            </div>
                                        </KpiHover>
                                    ),
                                    color: CHROME.green
                                }
                            ]


                                .map((k, i) => (
                                <div
                                    key={i}
                                    style={{
                                        height: "100%",
                                        padding: 12,
                                        borderRadius: 10,
                                        background: "rgba(255,255,255,.02)",
                                        display: "flex",
                                        flexDirection: "column",
                                    }}
                                >
                                    <p style={kpiTitle}>{k.title}</p>
                                    <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
                                        <div style={{ ...kpiValue, color: "#fff", margin: 0 }}>{k.value}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* TOP5 */}
                    <div style={{ ...card, padding: 16 }}>
                        <div style={{ display: "flex", alignItems: "center", marginBottom: 8 }}>
                            <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>TOP5</h3>
                        </div>

                        <div style={{ borderRadius: 10, overflow: "hidden", border: "1px solid rgba(255,255,255,.06)" }}>
                            <div
                                style={{
                                    display: "grid",
                                    gridTemplateColumns: "56px 1fr 140px 90px",
                                    padding: "10px 12px",
                                    background: "rgba(255,255,255,.03)",
                                    color: "var(--muted)",
                                    fontSize: 12,
                                }}
                            >
                                <div>#</div>
                                <div>ID</div>
                                <div style={{ textAlign: "right" }}>Total</div>
                                <div style={{ textAlign: "right" }}>Share</div>
                            </div>

                            {top5.map((r, idx) => {
                                const share = totalDamage ? (r.total / totalDamage) * 100 : 0;
                                return (
                                    <div
                                        key={r.name}
                                        style={{
                                            display: "grid",
                                            gridTemplateColumns: "56px 1fr 140px 90px",
                                            padding: "10px 12px",
                                            borderTop: "1px solid rgba(255,255,255,.06)",
                                            alignItems: "center",
                                            fontSize: 13,
                                        }}
                                    >
                                        <div style={{ fontWeight: 800, color: rankColors[idx] }}>{idx + 1}</div>
                                        <div style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{r.name}</div>
                                        <div style={{ textAlign: "right", fontVariantNumeric: "tabular-nums", fontWeight: 700 }}>
                                            {formatKor(r.total)}
                                        </div>
                                        <div style={{ textAlign: "right", fontVariantNumeric: "tabular-nums", opacity: 0.9 }}>
                                            {share.toFixed(1)}%
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Level Attempts Pie */}
                    <div style={{ ...card, padding: 16 }}>
                        <div style={{ display: "flex", alignItems: "center", marginBottom: 8 }}>
                            <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>Encounter Count</h3>
                        </div>

                        <div
                            style={{
                                borderRadius: 10,
                                overflow: "hidden",
                                border: "1px solid rgba(255,255,255,.06)",
                                padding: 12,
                                background: "rgba(255,255,255,.02)",
                                height: 260,
                            }}
                        >
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Tooltip content={<PieTooltip />} />
                                    <Legend
                                        verticalAlign="bottom"
                                        align="center"
                                        wrapperStyle={{ bottom: 0, color: "#cbd6ea" }}
                                        iconType="circle"
                                        formatter={(v: string) => <span style={{ color: "#cbd6ea", fontSize: 12 }}>{v}</span>}
                                    />
                                    <Pie
                                        data={pieData}
                                        dataKey="value"
                                        nameKey="name"
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={50}
                                        outerRadius={80}
                                        paddingAngle={2}
                                        stroke="rgba(0,0,0,.25)"
                                        isAnimationActive={false}
                                    >
                                        {pieData.map((_, i) => (
                                            <Cell key={i} fill={BASE_PALETTE[i % BASE_PALETTE.length]} />
                                        ))}

                                        {/* ▼ 가운데 총 시도수 라벨 */}{/* ▼ 가운데 총 시도수 라벨 */}
                                        <Label
                                            value={totalAttempts.toLocaleString()}
                                            position="center"
                                            style={{ fill: "#eaf0ff", fontWeight: 800, fontSize: 18, letterSpacing: 0.2 }}
                                        />
                                        <Label
                                            value="total"
                                            position="center"
                                            dy={18}
                                            style={{ fill: "var(--muted)", fontSize: 11 }}
                                        />
                                    </Pie>

                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>


                {/* 차트 */}
                <div
                    style={{
                        width: "100%",
                        background: "var(--panel)",
                        border: "1px solid #1a2130",
                        borderRadius: 18,
                        padding: "18px 18px 8px",
                        boxShadow: "0 10px 30px rgba(0,0,0,.35), inset 0 1px 0 rgba(255,255,255,.03)",
                    }}
                >
                    <h3 style={{ margin: "0 0 8px", fontSize: 16, fontWeight: 700 }}>Overall Damage</h3>
                    <div style={{ width: "100%", height: 500 }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data} margin={{ top: 24, right: 32, left: 24, bottom: 40 }}>
                                <CartesianGrid stroke={css.getPropertyValue("--grid").trim() || "#1f2633"} vertical={false} />
                                <XAxis dataKey="name" interval={0} angle={-28} textAnchor="end" height={74} tick={axisTick} />
                                <YAxis tickFormatter={formatKor} tick={axisTick} />
                                <Tooltip content={<CustomTooltip prevTotals={prevTotals} prevSeason={season - 1} />} />
                                <Legend
                                    verticalAlign="bottom"
                                    align="center"
                                    wrapperStyle={{ bottom: 50, color: "#cbd6ea" }}
                                    iconType="circle"
                                    formatter={(v) => <span style={{ color: "#cbd6ea", fontSize: 12 }}>{v}</span>}
                                />
                                {monsters.map((m, i) => (
                                    <Bar
                                        key={m}
                                        dataKey={`m_${m}`} // 접두어 버전
                                        stackId="total"
                                        name={m}
                                        fill={COLOR_MAP[m] || BASE_PALETTE[i % BASE_PALETTE.length]}
                                        radius={[4, 4, 0, 0]}
                                    />
                                ))}
                                <ReferenceLine
                                    y={Math.round(avgDamage)}               // 이번 시즌 평균(이미 계산된 변수 사용)
                                    stroke="#eaf0ff"                        // 선 색
                                    strokeOpacity={0.8}
                                    strokeDasharray="6 6"                   // 점선
                                    ifOverflow="extendDomain"
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
}
