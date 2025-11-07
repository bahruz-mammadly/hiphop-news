import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function AdminNav() {
  return (
    <div className="flex flex-wrap gap-2 border-b pb-4">
      <Link href="/admin">
        <Button variant="outline" size="sm">
          Dashboard
        </Button>
      </Link>
      <Link href="/admin/flagged">
        <Button variant="outline" size="sm">
          Flagged Content
        </Button>
      </Link>
      <Link href="/admin/users">
        <Button variant="outline" size="sm">
          Users
        </Button>
      </Link>
      <Link href="/admin/logs">
        <Button variant="outline" size="sm">
          Logs
        </Button>
      </Link>
    </div>
  )
}
