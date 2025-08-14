// src/pages/DamageChart.tsx
import React from "react";
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
    CartesianGrid
} from "recharts";


const RAW = `
0,아카자와레드,알트아이젠,7141192335,29,80
0,아카자와레드,리빌드 스푸키,7418148162,29,80
0,김태훈,헤비메탈,4505700576,29,80
0,아카자와레드,헤비메탈,8189108975,29,80
0,김태훈,리빌드 스푸키,7318389418,29,80
0,김태훈,알트아이젠,6584452421,29,80
0,다이핀치,리빌드 스푸키,2264546037,29,80
0,된장통폭발,알트아이젠,5189779383,29,80
0,된장통폭발,헤비메탈,9194398783,29,80
0,된장통폭발,리빌드 스푸키,8807307471,29,80
0,리세,알트아이젠,2068352893,29,80
0,리세,헤비메탈,4353930965,29,80
0,리세,랜드 이터,3032092444,29,80
0,미래,알트아이젠,12289329089,29,80
0,괴벨스,리빌드 스푸키,5254153617,29,80
0,미래,리빌드 스푸키,12039119509,29,80
0,테르미엔,헤비메탈,7581314021,29,80
0,테르미엔,랜드 이터,8776106023,29,80
0,야스,헤비메탈,8969068752,29,80
0,야스,리빌드 스푸키,8598406273,29,80
0,URPPSMOL,헤비메탈,4965743437,29,80
0,야스,랜드 이터,10190500336,29,80
0,URPPSMOL,랜드 이터,4824418133,29,80
0,URPPSMOL,리빌드 스푸키,6847673466,29,80
0,지현,헤비메탈,5224691664,29,80
0,지현,두리안,3466485108,29,80
0,지현,랜드 이터,3638932161,29,80
0,이브,알트아이젠,7143664660,29,80
0,이브,랜드 이터,7751353942,29,80
0,이브,두리안,6893911295,29,80
0,NAVIS,두리안,9391428176,29,80
0,NAVIS,알트아이젠,10492656860,29,80
0,미래,랜드 이터,13951611749,29,80
0,NAVIS,랜드 이터,11649690245,29,80
0,미카미카,리빌드 스푸키,6896847601,29,80
0,이별의꽃,알트아이젠,12875506192,29,80
0,미카미카,랜드 이터,8144513089,29,80
0,이별의꽃,두리안,11184601157,29,80
0,태연,랜드 이터,5378276387,29,80
0,태연,리빌드 스푸키,3353311543,29,80
0,태연,두리안,6163425834,29,80
0,크모레,리빌드 스푸키,3087307321,29,80
0,테르미엔,알트아이젠,8349801104,29,80
0,슈엔애호가,랜드 이터,6844711562,29,80
0,슈엔애호가,헤비메탈,7404472878,29,80
0,슈엔애호가,두리안,5233316204,29,80
0,크모레,두리안,5489823283,29,80
0,알로에,리빌드 스푸키,6841691505,29,80
0,REF,랜드 이터,3358349769,29,80
0,알로에,두리안,5746893996,29,80
0,알로에,랜드 이터,6258105002,29,80
0,REF,헤비메탈,3372740905,29,80
0,이별의꽃,랜드 이터,13142009519,29,80
0,세트,랜드 이터,6435189305,29,80
0,GESTIRN,두리안,8372157307,29,80
0,GESTIRN,랜드 이터,8977365479,29,80
0,세트,두리안,6650440313,29,80
0,세트,리빌드 스푸키,6764646939,29,80
0,써버쿨,알트아이젠,5437900015,29,80
0,써버쿨,두리안,8736789453,29,80
0,리유,랜드 이터,4304180752,29,80
0,슈펑,두리안,5729722277,29,80
0,리유,두리안,5505986723,29,80
0,써버쿨,랜드 이터,7858131117,29,80
0,슈펑,랜드 이터,4724602425,29,80
0,슈펑,알트아이젠,3007216508,29,80
0,리유,알트아이젠,2940713096,29,80
0,미카미카,알트아이젠,5170920262,29,80
0,크모레,알트아이젠,2972712990,29,80
0,REF,알트아이젠,2738243431,29,80
0,다이핀치,두리안,1549829982,29,80
0,다이핀치,헤비메탈,1474537525,29,80
0,GESTIRN,헤비메탈,10106096126,29,80
0,퀸틸,헤비메탈,9674393949,29,80
0,퀸틸,랜드 이터,4006722164,29,80
0,퀸틸,알트아이젠,8216533360,29,80
0,괴벨스,알트아이젠,3540136449,29,80
0,괴벨스,랜드 이터,5484541372,29,80
0,캐르,랜드 이터,11905166958,29,80
0,캐르,알트아이젠,8658111392,29,80
0,캐르,리빌드 스푸키,9578685673,29,80
0,임플래커블,랜드 이터,5476454929,29,80
0,무명,알트아이젠,5288161457,29,80
0,임플래커블,리빌드 스푸키,5204059401,29,80
0,무명,리빌드 스푸키,6472282526,29,80
0,라붕이드디어각성,랜드 이터,4347750135,29,80
0,임플래커블,두리안,7056126765,29,80
0,무명,랜드 이터,7738231039,29,80
0,라붕이드디어각성,알트아이젠,1917075136,29,80
0,라붕이드디어각성,두리안,5166268403,29,80
0,아카자와레드,마더웨일,8292933362,30,82
0,아카자와레드,타이피스,9967620502,30,82
0,슈엔애호가,타이피스,6130340977,30,82
0,슈엔애호가,쿠쿰버,4098369509,30,82
0,아카자와레드,그레이브 디거,7389275926,30,82
0,라붕이드디어각성,타이피스,3661142290,30,82
0,라붕이드디어각성,그레이브 디거,4662974713,30,82
0,라붕이드디어각성,마더웨일,3384009739,30,82
0,된장통폭발,쿠쿰버,7558122842,30,82
0,된장통폭발,그레이브 디거,10172565646,30,82
0,된장통폭발,마더웨일,7953513200,30,82
0,캐스터아르토리아,두리안,11291298074,29,80
0,캐스터아르토리아,랜드 이터,8773993187,29,80
0,크모레,마더웨일,2956822956,30,82
0,퀸틸,마더웨일,8360927721,30,82
0,김태훈,리빌드 벌컨R,1463522755,30,82
0,퀸틸,타이피스,13294582482,30,82
0,김태훈,쿠쿰버,8719945809,30,82
0,김태훈,타이피스,7469710709,30,82
0,퀸틸,쿠쿰버,12554880861,30,82
0,크모레,그레이브 디거,4303187430,30,82
0,크모레,쿠쿰버,5509662464,30,82
0,다이핀치,쿠쿰버,3678300568,30,82
0,다이핀치,타이피스,2681337373,30,82
0,알로에,쿠쿰버,4828097327,30,82
0,알로에,그레이브 디거,6294736755,30,82
0,야스,타이피스,10484835243,30,82
0,알로에,마더웨일,5030975588,30,82
0,야스,마더웨일,8196421876,30,82
0,야스,쿠쿰버,10377976639,30,82
0,미래,타이피스,12932186165,30,82
0,미래,쿠쿰버,13974015914,30,82
0,슈엔애호가,리빌드 벌컨R,4862407314,30,82
0,리세,타이피스,1288269707,30,82
0,리세,리빌드 벌컨R,2969404561,30,82
0,리유,그레이브 디거,5090468144,30,82
0,LUSTER,마더웨일,4062037159,30,82
0,리유,마더웨일,3578169825,30,82
0,태연,마더웨일,4438472224,30,82
0,리유,리빌드 벌컨R,4047608402,30,82
0,태연,리빌드 벌컨R,5807467642,30,82
0,미래,마더웨일,12916555634,30,82
0,태연,그레이브 디거,6214271852,30,82
0,테르미엔,마더웨일,8241494701,30,82
0,지현,쿠쿰버,1918764151,30,82
0,지현,리빌드 벌컨R,3285804061,30,82
0,테르미엔,리빌드 벌컨R,8899196230,30,82
0,테르미엔,그레이브 디거,7215303616,30,82
0,REF,타이피스,1921632564,30,82
0,REF,리빌드 벌컨R,3503314253,30,82
0,GESTIRN,그레이브 디거,8533019418,30,82
0,GESTIRN,마더웨일,6773124019,30,82
0,GESTIRN,리빌드 벌컨R,9383990408,30,82
0,임플래커블,타이피스,4875778874,30,82
0,무명,리빌드 벌컨R,7055401624,30,82
0,세트,타이피스,4683281847,30,82
0,임플래커블,리빌드 벌컨R,7398443332,30,82
0,NAVIS,쿠쿰버,11519414255,30,82
0,임플래커블,쿠쿰버,6395428620,30,82
0,세트,쿠쿰버,8723300241,30,82
0,세트,리빌드 벌컨R,5491942643,30,82
0,이별의꽃,그레이브 디거,12904678752,30,82
0,캐르,타이피스,9631654253,30,82
0,NAVIS,타이피스,10833906214,30,82
0,이별의꽃,마더웨일,10179217025,30,82
0,이별의꽃,리빌드 벌컨R,10452804156,30,82
0,슈펑,마더웨일,4576579434,30,82
0,NAVIS,마더웨일,10409064777,30,82
0,슈펑,리빌드 벌컨R,4762342706,30,82
0,미카미카,리빌드 벌컨R,7277553925,30,82
0,리세,그레이브 디거,2262006622,30,82
0,다이핀치,그레이브 디거,5928422112,30,82
0,미카미카,그레이브 디거,9507882985,30,82
0,미카미카,마더웨일,7010110093,30,82
0,지현,그레이브 디거,5532871966,30,82
0,REF,그레이브 디거,5021136578,30,82
0,슈펑,그레이브 디거,6572988673,30,82
0,무명,그레이브 디거,7644425929,30,82
0,무명,마더웨일,6766002334,30,82
0,써버쿨,그레이브 디거,5083480735,30,82
0,써버쿨,마더웨일,6391176053,30,82
0,써버쿨,리빌드 벌컨R,5851964131,30,82
0,괴벨스,마더웨일,4764731643,30,82
0,괴벨스,타이피스,4380478134,30,82
0,캐르,마더웨일,9537396496,30,82
0,이브,타이피스,6341283013,30,82
0,캐르,쿠쿰버,14022088711,30,82
0,이브,리빌드 벌컨R,7706535272,30,82
0,괴벨스,리빌드 벌컨R,7696528197,30,82
0,이브,마더웨일,6249767088,30,82
0,LUSTER,타이피스,7217410007,30,82
0,LUSTER,쿠쿰버,7232938889,30,82
0,끄앙,타이피스,3315856446,30,82
0,끄앙,알트아이젠,3103391519,29,80
0,끄앙,두리안,7482802450,29,80
0,끄앙,리빌드 벌컨R,8025007931,30,82
0,끄앙,마더웨일,6834031893,30,82
0,끄앙,랜드 이터,8594349003,29,80
0,캐스터아르토리아,리빌드 벌컨R,5170067257,30,82
0,캐스터아르토리아,마더웨일,6845303300,30,82
2,캐스터아르토리아,토커티브,5753546258,31,91
2,캐스터아르토리아,토커티브,3275989285,31,91
2,캐스터아르토리아,마테리얼H,2057768171,31,91
2,아카자와레드,토커티브,7973149340,31,91
2,아카자와레드,토커티브,6540403882,31,91
2,아카자와레드,토커티브,9274231976,31,91
2,된장통폭발,토커티브,4122467458,31,91
2,된장통폭발,토커티브,7823220221,31,91
2,된장통폭발,토커티브,10217218435,31,91
0,캐스터아르토리아,그레이브 디거,8687438664,30,82
0,캐스터아르토리아,헤비메탈,5176167158,29,80
2,라붕이드디어각성,토커티브,2493259690,31,91
2,라붕이드디어각성,마테리얼H,3753578745,31,91
2,김태훈,토커티브,6681667695,31,91
2,라붕이드디어각성,리빌드 스푸키,1717616243,31,91
2,리세,마테리얼H,3761178985,31,91
2,김태훈,리빌드 스푸키,8336362654,31,91
2,김태훈,마테리얼H,7605329773,31,91
2,리세,토커티브,5219395337,31,91
2,리세,빅 토로소,3028312130,31,91
2,다이핀치,빅 토로소,4499494985,31,91
2,야스,빅 토로소,9588441638,31,91
2,야스,마테리얼H,9771493741,31,91
2,야스,토커티브,12720856078,31,91
2,이브,토커티브,11470035713,31,91
2,알로에,마테리얼H,8260024270,31,91
2,알로에,빅 토로소,7124455447,31,91
2,이브,마테리얼H,8865557037,31,91
2,이브,빅 토로소,8180183485,31,91
2,슈엔애호가,빅 토로소,5731225861,31,91
2,슈엔애호가,리빌드 스푸키,5107033091,31,91
2,슈엔애호가,레이턴스,6476982866,31,91
2,크모레,빅 토로소,4485471020,31,91
2,미래,토커티브,16641594588,31,91
2,미카미카,마테리얼H,12819779530,31,91
2,리유,레이턴스,5600017493,31,91
2,미카미카,리빌드 스푸키,8816883517,31,91
2,크모레,마테리얼H,7593404394,31,91
2,미카미카,빅 토로소,8197130468,31,91
2,미래,마테리얼H,17804745134,31,91
2,다이핀치,레이턴스,9685073046,31,91
2,미래,레이턴스,17133432393,31,91
2,크모레,리빌드 스푸키,6260743219,31,91
2,이별의꽃,마테리얼H,15116629131,31,91
2,테르미엔,마테리얼H,12077146334,31,91
2,태연,리빌드 스푸키,6699810658,31,91
2,태연,마테리얼H,6115688300,31,91
2,태연,레이턴스,7300754562,31,91
2,이별의꽃,빅 토로소,11813487365,31,91
2,테르미엔,리빌드 스푸키,8005939909,31,91
2,다이핀치,리빌드 스푸키,5290359083,31,91
2,이별의꽃,레이턴스,22452463271,31,91
2,테르미엔,토커티브,10097628078,31,91
2,끄앙,마테리얼H,7836618580,31,91
2,끄앙,리빌드 스푸키,9148267144,31,91
2,끄앙,빅 토로소,7880818020,31,91
2,REF,빅 토로소,3505379410,31,91
2,REF,레이턴스,4411477094,31,91
2,GESTIRN,마테리얼H,12672586420,31,91
2,NAVIS,마테리얼H,14730285055,31,91
2,NAVIS,레이턴스,15413232077,31,91
2,JY,빅 토로소,5517046497,31,91
2,JY,레이턴스,5617800537,31,91
2,NAVIS,토커티브,13190136246,31,91
2,세트,빅 토로소,5841590644,31,91
2,세트,리빌드 스푸키,6732640280,31,91
2,임플래커블,레이턴스,5765045861,31,91
2,세트,토커티브,7269402739,31,91
2,임플래커블,리빌드 스푸키,8111565441,31,91
2,임플래커블,빅 토로소,5910898484,31,91
2,GESTIRN,리빌드 스푸키,9993660192,31,91
2,GESTIRN,빅 토로소,8552343746,31,91
1,퀸틸,리빌드 스푸키,9040128860,31,91
1,퀸틸,토커티브,41840608,31,91
1,퀸틸,토커티브,12737768274,31,91
1,REF,토커티브,3789705116,31,91
1,리유,마테리얼H,452137018,31,91
1,JY,마테리얼H,8320924343,31,91
1,리유,리빌드 스푸키,2281186465,31,91
1,무명,토커티브,9449048424,31,91
1,무명,마테리얼H,8202786186,31,91
1,무명,빅 토로소,6995259041,31,91
1,캐르,마테리얼H,11714574423,31,91
1,써버쿨,마테리얼H,12737298655,31,91
1,써버쿨,빅 토로소,8294357441,31,91
1,써버쿨,리빌드 스푸키,9740212655,31,91
1,캐르,레이턴스,5456363116,31,91
1,괴벨스,빅 토로소,5965411118,31,91
1,괴벨스,레이턴스,7064763242,31,91
1,괴벨스,리빌드 스푸키,9233628480,31,91
1,LUSTER,마테리얼H,6125494975,31,91
1,LUSTER,토커티브,6529424143,31,91
1,캐르,토커티브,15005429035,31,91
1,LUSTER,레이턴스,8733901242,31,91
`.trim();

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
    if (n >= 1_0000_0000_0000) return (n / 1_0000_0000_0000).toFixed(2) + "조";
    if (n >= 1_0000_0000) return (n / 1_0000_0000).toFixed(2) + "억";
    return (n || 0).toLocaleString();
};

// CustomTooltip
function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
    if (!active || !payload || !payload.length) return null;

    // p가 null/undefined 아니고 value > 0 일 때만 남김 + 타입 가드로 any 제거
    const rows = (payload ?? []).filter(
        (p): p is TooltipItem => p != null && Number(p.value ?? 0) > 0
    );
    if (!rows.length) return null;

    // s, r에 암시적 any가 뜨지 않도록 누적값을 number로 고정
    const total = rows.reduce((sum: number, r) => sum + Number(r.value ?? 0), 0);

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
            <div style={{ display: "flex", gap: 8 }}>
                <span style={{ opacity: 0.8 }}>합계</span>
                <span style={{ marginLeft: "auto", fontWeight: 700 }}>{formatKor(total)}</span>
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



export default function DamageChart() {
    // 1) 파싱(6열) → 2) 최신 시즌 선택 → 3) 해당 시즌 몬스터 5종 순서 추출
    const { seasonRows, monsters, season, unionRank } = React.useMemo(() => {
        const parsed = parse6(RAW);
        return pickLatestSeason(parsed);
    }, []);

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
                name: `Lv ${level}`,
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
        <div style={{ minHeight: "100dvh", background: "var(--panel)", overflowX: "hidden" }}>
            <div style={{ maxWidth: 1680, margin: "0 auto", padding: "0 24px" }}>
                <h2 style={{ fontSize: 22, fontWeight: 800, letterSpacing: .2, margin: "0 0 8px" }}>
                    유레 하드 (시즌 {season})
                </h2>
                <div style={{ color: "var(--muted)", fontSize: 15, marginBottom: 16 }}>last update: 2025-08-13</div>

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
                                { title: "Rank", value: <>{unionRank || "-"} 위</>, color: CHROME.red },
                                { title: "Headcount", value: <>{headcount.toLocaleString()} 명</>, color: CHROME.yellow },
                                { title: "Damage Total", value: <>{formatKor(totalDamage)}</>, color: CHROME.blue },
                                { title: "Damage Avg", value: <>{formatKor(Math.round(avgDamage))}</>, color: CHROME.green },
                            ].map((k, i) => (
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
                                        <p style={{ ...kpiValue, color: k.color, margin: 0 }}>{k.value}</p>
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
                                <div style={{ textAlign: "right" }}>기여도</div>
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
                            <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>Encounter</h3>
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
                    <h3 style={{ margin: "0 0 8px", fontSize: 16, fontWeight: 700 }}>Damage Chart</h3>
                    <div style={{ width: "100%", height: 500 }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data} margin={{ top: 24, right: 32, left: 24, bottom: 40 }}>
                                <CartesianGrid stroke={css.getPropertyValue("--grid").trim() || "#1f2633"} vertical={false} />
                                <XAxis dataKey="name" interval={0} angle={-28} textAnchor="end" height={74} tick={axisTick} />
                                <YAxis tickFormatter={formatKor} tick={axisTick} />
                                <Tooltip content={<CustomTooltip />} />
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
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
}
