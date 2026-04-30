import CandidateRow from "./CandidateRow";
import ScoreChart from "./ScoreChart";
import Stat from "./Stat";

export default function Dashboard({ data, onAddMore }: any) {
  const results = data.results;

  console.log(data);

  const avg =
    results?.reduce((a: number, b: any) => a + b.score, 0) / results?.length;

  return (
    <div className="space-y-6">
      {/* STATS */}
      <div className="grid grid-cols-4 gap-4">
        <Stat title="Avg Score" value={avg?.toFixed(1)} color="text-green-400" />
        <Stat title="Candidates" value={results?.length} />
        <Stat title="Top Score" value={results[0]?.score} />
        <Stat title="Low Score" value={results[results?.length - 1]?.score} />
      </div>

      {/* CHART */}
      <ScoreChart results={results} />

      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Candidate Dashboard</h2>

        <button
          onClick={onAddMore}
          className="text-sm px-3 py-1 border border-[#2a2a2e] rounded-lg hover:bg-[#1a1a1c]"
        >
          + Add More
        </button>
      </div>
      {/* LIST */}
      <div className="card">
        {results?.map((r: any, i: number) => (
          <CandidateRow key={i} r={r} i={i} />
        ))}
      </div>
    </div>
  );
}
