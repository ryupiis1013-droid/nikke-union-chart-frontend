// src/pages/DamageChart.tsx
import React from "react";
import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
    CartesianGrid,
} from "recharts";

const RAW = `
캐스터아르토리아,토커티브,5753546258
캐스터아르토리아,토커티브,3275989285
캐스터아르토리아,마테리얼H,2057768171
아카자와레드,토커티브,7973149340
아카자와레드,토커티브,6540403882
아카자와레드,토커티브,9274231976
된장통폭발,토커티브,4122467458
된장통폭발,토커티브,7823220221
된장통폭발,토커티브,10217218435
라붕이드디어각성,토커티브,2493259690
라붕이드디어각성,마테리얼H,3753578745
김태훈,토커티브,6681667695
라붕이드디어각성,리빌드스푸키,1717616243
리세,마테리얼H,3761178985
김태훈,리빌드스푸키,8336362654
김태훈,마테리얼H,7605329773
리세,토커티브,5219395337
리세,빅토르소,3028312130
다이핀치,빅토르소,4499494985
야스,빅토르소,9588441638
야스,마테리얼H,9771493741
야스,토커티브,12720856078
이브,토커티브,11470035713
알로에,마테리얼H,8260024270
알로에,리빌드스푸키,6595268909
알로에,빅토르소,7124455447
이브,마테리얼H,8865557037
이브,빅토르소,8180183485
슈엔애호가,빅토르소,5731225861
슈엔애호가,리빌드스푸키,5107033091
슈엔애호가,레이턴스,6476982866
크모레,빅토르소,4485471020
미래,토커티브,16641594588
미카미카,마테리얼H,12819779530
리유,레이턴스,5600017493
미카미카,리빌드스푸키,8816883517
크모레,마테리얼H,7593404394
미카미카,빅토르소,8197130468
미래,마테리얼H,17804745134
다이핀치,레이턴스,9685073046
미래,레이턴스,17133432393
크모레,리빌드스푸키,6260743219
이별의꽃,마테리얼H,15116629131
테르미엔,마테리얼H,12077146334
태연,리빌드스푸키,6699810658
태연,마테리얼H,6115688300
태연,레이턴스,7300754562
이별의꽃,빅토르소,11813487365
테르미엔,리빌드스푸키,8005939909
다이핀치,리빌드스푸키,5290359083
이별의꽃,레이턴스,22452463271
테르미엔,토커티브,10097628078
끄앙,마테리얼H,7836618580
끄앙,리빌드스푸키,9148267144
끄앙,빅토르소,7880818020
REF,빅토르소,3505379410
REF,레이턴스,4411477094
GESTIRN,마테리얼H,12672586420
NAVIS,마테리얼H,14730285055
NAVIS,레이턴스,15413232077
JY,빅토르소,5517046497
JY,레이턴스,5617800537
NAVIS,토커티브,13190136246
세트,빅토르소,5841590644
세트,리빌드스푸키,6732640280
임플래커블,레이턴스,5765045861
세트,토커티브,7269402739
임플래커블,리빌드스푸키,8111565441
임플래커블,빅토르소,5910898484
GESTIRN,리빌드스푸키,9993660192
GESTIRN,빅토르소,8552343746
퀸틸,리빌드스푸키,9040128860
`;

const MONSTERS = ["토커티브","마테리얼H","리빌드스푸키","빅토르소","레이턴스"] as const;
type Key = typeof MONSTERS[number];

const css = getComputedStyle(document.documentElement);
const COLORS: Record<Key,string> = {
    토커티브:  (css.getPropertyValue("--c-talkative")||"#DB4437").trim(),
    마테리얼H: (css.getPropertyValue("--c-materialH")||"#F4B400").trim(),
    리빌드스푸키:(css.getPropertyValue("--c-rebuild")||"#0F9D58").trim(),
    빅토르소:  (css.getPropertyValue("--c-victorso")||"#4285F4").trim(),
    레이턴스:  (css.getPropertyValue("--c-latence")||"#FF6F00").trim(),
};

type Row = { name:string; monster:Key; damage:number };
type Agg = { name:string; total:number } & Record<Key, number>;

function parse(text:string): Row[] {
    return text.split("\n").filter(Boolean).map(line=>{
        const [name, m, dmg] = line.split(",");
        return { name: name.trim(), monster: m.trim() as Key, damage: Number(dmg.trim()) };
    });
}
function aggregate(rows:Row[]): Agg[] {
    const map = new Map<string, Agg>();
    for (const r of rows) {
        if (!map.has(r.name)) {
            map.set(r.name, { name:r.name, total:0, 토커티브:0, 마테리얼H:0, 리빌드스푸키:0, 빅토르소:0, 레이턴스:0 });
        }
        const a = map.get(r.name)!;
        a[r.monster] += r.damage;
        a.total += r.damage;
    }
    return Array.from(map.values()).sort((a,b)=>b.total-a.total);
}

const formatKor = (n:number)=>{
    if (n >= 1_0000_0000_0000) return (n/1_0000_0000_0000).toFixed(2)+"조";
    if (n >= 1_0000_0000) return (n/1_0000_0000).toFixed(2)+"억";
    return (n||0).toLocaleString();
};

function CustomTooltip({ active, payload, label }:{
    active?:boolean; payload?:any[]; label?:string;
}) {
    if (!active || !payload || !payload.length) return null;
    const rows = payload.filter(p=>p && p.value>0);
    if (!rows.length) return null;
    const total = rows.reduce((s, r) => s + (r.value || 0), 0);
    return (
        <div style={{
            background:"rgba(18,22,35,.96)", color:"#eaf0ff",
            padding:"12px 14px", borderRadius:12,
            boxShadow:"0 10px 30px rgba(0,0,0,.35)", fontSize:12, minWidth:220
        }}>
            <div style={{fontWeight:700, marginBottom:8, letterSpacing:.2}}>{label}</div>
            {rows.map(r=>(
                <div key={r.dataKey} style={{display:"flex",gap:10,alignItems:"center",lineHeight:1.5}}>
                    <span style={{width:10,height:10,background:r.color,borderRadius:3,display:"inline-block",opacity:.95}}/>
                    <span style={{opacity:.9}}>{r.name}</span>
                    <span style={{marginLeft:"auto",fontVariantNumeric:"tabular-nums"}}>{formatKor(r.value)}</span>
                </div>
            ))}
            <hr style={{border:0,borderTop:"1px solid rgba(255,255,255,.10)", margin:"8px 0"}}/>
            <div style={{display:"flex",gap:8}}>
                <span style={{opacity:.8}}>합계</span>
                <span style={{marginLeft:"auto",fontWeight:700}}>{formatKor(total)}</span>
            </div>
        </div>
    );
}


// src/pages/DamageChart.tsx (중요 부분만)
export default function DamageChart() {
    const data = React.useMemo(() => aggregate(parse(RAW)), []);
    const css = getComputedStyle(document.documentElement);
    const axisTick = { fill: css.getPropertyValue('--muted').trim() || "#9aa3b2", fontSize: 12 };

    return (
        // ✅ 래퍼: 화면 꽉 채우고(100vw), 가운데 정렬, 최대 1680px
        <div style={{ width: "100vw" }}>
            <div style={{ maxWidth: 1680, margin: "0 auto", padding: "0 24px" }}>
                {/* 타이틀/설명은 여기서만 */}
                <h1 style={{ fontSize: 22, fontWeight: 800, letterSpacing: .2, margin: "0 0 6px" }}>
                    시삐보털 유니온 레이드 차트 SAMPLE
                </h1>
                <div style={{ color: "var(--muted)", fontSize: 15, marginBottom: 18 }}>
                    test 버전입니다.
                </div>

                {/* ✅ 카드: 반드시 width:100% 강제 */}
                <div
                    style={{
                        width: "100%",                // ← 이 줄이 핵심
                        background: "var(--panel)",
                        border: "1px solid #1a2130",
                        borderRadius: 18,
                        padding: "18px 18px 8px",
                        boxShadow:
                            "0 10px 30px rgba(0,0,0,.35), inset 0 1px 0 rgba(255,255,255,.03)",
                    }}
                >
                    {/* ✅ 차트 컨테이너: 부모 폭 100% + 넉넉한 높이 */}
                    <div style={{ width: "100%", height: 700 }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data} margin={{ top: 24, right: 32, left: 24, bottom: 90 }}>
                                <CartesianGrid
                                    stroke={css.getPropertyValue("--grid").trim() || "#1f2633"}
                                    vertical={false}
                                />
                                <XAxis
                                    dataKey="name"
                                    interval={0}
                                    angle={-28}
                                    textAnchor="end"
                                    height={74}
                                    tick={axisTick}
                                />
                                <YAxis tickFormatter={formatKor} tick={axisTick} />
                                <Tooltip content={<CustomTooltip />} />
                                <Legend
                                    wrapperStyle={{ bottom: 0, color: "#cbd6ea" }}
                                    iconType="circle"
                                    formatter={(v) => <span style={{ color: "#cbd6ea", fontSize: 12 }}>{v}</span>}
                                />
                                {MONSTERS.map((m) => (
                                    <Bar key={m} dataKey={m} stackId="total" name={m} fill={COLORS[m]} radius={[4, 4, 0, 0]} />
                                ))}
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
}

