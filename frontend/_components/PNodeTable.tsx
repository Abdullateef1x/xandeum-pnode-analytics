import { PNode } from "@/_lib/api";

interface Props {
  title: string;
  pnodes: PNode[];
  cardClassName?: string;
  headerTextClass?: string;
  bodyTextClass?: string;
}

export default function PNodeTable({
  title,
  pnodes,
  cardClassName = "bg-gray-800",
  headerTextClass = "text-white",
  bodyTextClass = "text-gray-200",
}: Props) {
  return (
    <div className={`rounded-xl shadow p-4 ${cardClassName}`}>
      <h2 className={`text-lg font-semibold mb-3 ${headerTextClass}`}>{title}</h2>

      <div className="overflow-x-auto">
        <table className="w-full text-sm table-fixed">
          <colgroup>
            <col style={{ width: "35%" }} />
            <col style={{ width: "15%" }} />
            <col style={{ width: "25%" }} />
            <col style={{ width: "25%" }} />
          </colgroup>

          <thead className="border-b border-gray-600">
            <tr className="text-left">
              <th className={`py-2 ${bodyTextClass}`}>Address</th>
              <th className={bodyTextClass}>Status</th>
              <th className={bodyTextClass}>Last Seen</th>
              <th className={bodyTextClass}>Fetched At</th>
            </tr>
          </thead>

          <tbody>
            {pnodes.map((node) => (
              <tr
                key={`${node.id}-${node.fetchedAt}`}
                className="border-b last:border-0"
              >
                <td className={`py-2 font-mono text-xs ${bodyTextClass}`}>
                  {node.address || node.id}
                </td>
                <td>
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      node.status === "online"
                        ? "bg-green-600 text-white"
                        : "bg-red-600 text-white"
                    }`}
                  >
                    {node.status || "unknown"}
                  </span>
                </td>
                <td className={`py-2 ${bodyTextClass}`}>
                  {node.lastSeen
                    ? new Date(node.lastSeen * 1000).toLocaleString()
                    : "—"}
                </td>
                <td className={`py-2 ${bodyTextClass}`}>
                  {node.fetchedAt
                    ? new Date(node.fetchedAt).toLocaleString()
                    : "Live"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
