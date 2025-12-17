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
      <h2 className={`text-lg font-semibold mb-3 ${headerTextClass}`}>
        {title}
      </h2>

      <div className="overflow-x-auto">
        <table className="w-full text-sm table-fixed">
         <colgroup>
  <col className="w-2/5" />  
  <col className="w-1/5" />
  <col className="w-1/5" />
  <col className="w-1/5" />
</colgroup>


          <thead className="border-b border-gray-600 text-gray-300">
            <tr>
              <th className="py-2 pl-1 text-left font-medium">
                Address
              </th>
              <th className="py-2 text-center font-medium">
                Status
              </th>
              <th className="py-2 text-center font-medium">
                Last Seen
              </th>
              <th className="py-2 text-center font-medium">
                Fetched At
              </th>
            </tr>
          </thead>

          <tbody>
            {pnodes.map((node) => (
              <tr
                key={`${node.id}-${node.fetchedAt}`}
                className="border-b last:border-0"
              >
                <td
                  className={`py-2 pl-1 font-mono text-xs text-left truncate ${bodyTextClass}`}
                >
                  {node.address || node.id}
                </td>

                <td className="py-2 text-center">
                  <span
                    className={`inline-block w-full px-2 py-1 rounded text-xs font-medium truncate ${
                      node.status === "online"
                        ? "bg-green-600 text-white"
                        : "bg-red-600 text-white"
                    }`}
                  >
                    {node.status || "unknown"}
                  </span>
                </td>

                <td className={`py-2 text-center ${bodyTextClass}`}>
                  {node.lastSeen
                    ? new Date(node.lastSeen * 1000).toLocaleString()
                    : "—"}
                </td>

                <td className={`py-2 text-center ${bodyTextClass}`}>
                  {node.fetchedAt
                    ? new Date(node.fetchedAt).toLocaleString()
                    : "Live"}
                </td>
              </tr>
            ))}

            {pnodes.length === 0 && (
              <tr>
                <td
                  colSpan={4}
                  className="py-6 text-center text-gray-400"
                >
                  No pNode data
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
