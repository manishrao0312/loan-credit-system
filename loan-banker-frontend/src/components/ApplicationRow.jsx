export default function ApplicationRow({ app, onVerify, onAnalyze, onApprove }) {
  return (
    <tr className="border-b text-sm">
      <td className="px-2 py-1">{app.id}</td>
      <td className="px-2 py-1">{app.full_name}</td>
      <td className="px-2 py-1">{app.requested_loan_amount}</td>
      <td className="px-2 py-1">{app.monthly_income}</td>
      <td className="px-2 py-1">
        {app.cibil_score ?? "-"}
      </td>
      <td className="px-2 py-1">
        {app.risk_label ?? "-"}
      </td>
      <td className="px-2 py-1">
        {app.is_verified ? "Yes" : "No"}
      </td>
      <td className="px-2 py-1">
        {app.approved ? "Approved" : app.analysis_run ? "Analyzed" : "Pending"}
      </td>
      <td className="px-2 py-1 space-x-1">
        {!app.is_verified && (
          <button
            onClick={() => onVerify(app.id)}
            className="bg-yellow-500 text-white px-2 py-1 rounded text-xs"
          >
            Verify
          </button>
        )}
        {app.is_verified && !app.analysis_run && (
          <button
            onClick={() => onAnalyze(app.id)}
            className="bg-blue-600 text-white px-2 py-1 rounded text-xs"
          >
            Analyze
          </button>
        )}
        {app.analysis_run && !app.approved && (
          <button
            onClick={() => onApprove(app.id)}
            className="bg-green-600 text-white px-2 py-1 rounded text-xs"
          >
            Approve
          </button>
        )}
      </td>
    </tr>
  );
}
