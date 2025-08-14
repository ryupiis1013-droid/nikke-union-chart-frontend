// src/App.tsx
import DamageChart from "./pages/DamageChart";

export default function App() {
    return (
        // 페이지 상단 여백만 살짝(28px) 주고 나머진 그대로
        <main style={{ padding: "28px 32px 40px" }}>
            <DamageChart />
        </main>
    );
}