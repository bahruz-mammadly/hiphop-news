import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default function SignUpSuccessPage() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gradient-to-br from-background to-secondary/20 p-4">
      <div className="w-full max-w-md">
        <Card className="border-0 shadow-lg">
          <CardHeader className="space-y-2 text-center">
            <CardTitle className="text-3xl font-bold">Check Your Email</CardTitle>
            <CardDescription>We&apos;ve sent a confirmation link to your inbox</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Please click the verification link in your email to confirm your account and get started with the hip-hop
              community.
            </p>
            <p className="text-xs text-muted-foreground">
              Didn&apos;t receive the email? Check your spam folder or{" "}
              <Link href="/auth/sign-up" className="font-medium text-primary hover:underline">
                try signing up again
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
