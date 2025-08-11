export type Health = { app: string; db: string; version: string };

export async function getHealth(): Promise<Health> {
    const r = await fetch("http://localhost:8080/api/health", {
        headers: { Accept: "application/json" },
    });
    if (!r.ok) throw new Error(`HTTP ${r.status} ${r.statusText}`);
    return r.json();
}