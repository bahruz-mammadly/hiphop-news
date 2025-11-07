import { Badge } from "@/components/ui/badge"

interface Log {
  id: string
  action: string
  target_type: string
  target_id: string
  reason: string | null
  created_at: string
  moderator: {
    id: string
    username: string
    display_name: string
  }
}

interface Props {
  logs: Log[]
}

export default function ModerationLogsList({ logs }: Props) {
  const getActionBadgeColor = (action: string) => {
    switch (action) {
      case "delete":
        return "destructive"
      case "ban":
        return "destructive"
      case "flag":
        return "secondary"
      case "approve":
        return "default"
      default:
        return "secondary"
    }
  }

  return (
    <div className="rounded-lg border overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="bg-secondary/50">
          <tr>
            <th className="px-4 py-3 text-left font-semibold">Action</th>
            <th className="px-4 py-3 text-left font-semibold">Target</th>
            <th className="px-4 py-3 text-left font-semibold">Moderator</th>
            <th className="px-4 py-3 text-left font-semibold">Reason</th>
            <th className="px-4 py-3 text-left font-semibold">Date</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log) => (
            <tr key={log.id} className="border-t hover:bg-secondary/30">
              <td className="px-4 py-3">
                <Badge variant={getActionBadgeColor(log.action) as any}>{log.action}</Badge>
              </td>
              <td className="px-4 py-3 text-xs">
                <div className="font-medium capitalize">{log.target_type}</div>
                <div className="text-muted-foreground">{log.target_id.slice(0, 8)}...</div>
              </td>
              <td className="px-4 py-3">
                <div className="font-medium">{log.moderator.display_name}</div>
                <div className="text-xs text-muted-foreground">@{log.moderator.username}</div>
              </td>
              <td className="px-4 py-3 text-xs text-muted-foreground max-w-xs truncate">{log.reason || "--"}</td>
              <td className="px-4 py-3 text-xs text-muted-foreground">{new Date(log.created_at).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
