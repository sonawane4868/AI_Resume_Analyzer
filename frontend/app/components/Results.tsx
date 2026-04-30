import CandidateCard from "./CandidateCard";

export default function Results({ data }: any) {
  return (
    <div className="space-y-10">

      <div className="bg-white p-6 rounded-2xl border shadow-sm max-w-4xl">
        <h3 className="font-semibold mb-2 text-lg">
          Job Description
        </h3>
        <p className="text-sm text-gray-600 whitespace-pre-line">
          {data.job_description}
        </p>
      </div>

      <div className="max-w-4xl">
        <h3 className="font-semibold mb-4 text-xl">
          Candidate Ranking
        </h3>

        <div className="space-y-4">
          {data?.results?.map((r: any, i: number) => (
            <CandidateCard key={i} r={r} index={i} />
          ))}
        </div>
      </div>
    </div>
  );
}