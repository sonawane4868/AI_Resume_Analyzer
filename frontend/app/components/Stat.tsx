export default function Stat({ title, value, color }: any) {
  return (
    <div className="card p-5">
      <p className="text-sm text-gray-400">{title}</p>
      <h2 className={`text-3xl font-semibold mt-2 ${color}`}>
        {value}
      </h2>
    </div>
  );
}