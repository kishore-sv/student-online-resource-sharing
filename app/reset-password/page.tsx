"use client"
import { useState, Suspense } from "react"
import { authClient } from "@/lib/auth-client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { IconBook, IconArrowLeft } from "@tabler/icons-react"
import Link from "next/link"
import { useSearchParams, useRouter } from "next/navigation"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp"

function ResetPasswordContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const email_param = searchParams.get("email") || ""
  
  const [email, setEmail] = useState(email_param)
  const [otp, setOtp] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault()
    if (otp.length !== 6) {
        toast.error("Please enter a valid 6-digit code")
        return;
    }
    setLoading(true)
    const { error } = await authClient.emailOtp.resetPassword({
      email,
      otp,
      password,
    })
    setLoading(false)
    if (error) {
      toast.error(error.message || "Invalid code or failed to reset")
    } else {
      toast.success("Password reset successful! Redirecting to login...")
      setTimeout(() => {
          router.push("/login")
      }, 1500)
    }
  }

  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-background p-6 md:p-10">
      <div className="w-full max-w-md">
        <Link href="/login" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors group">
            <IconArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            Back to login
        </Link>
        
        <Card className="border-none shadow-2xl">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
                <div className="w-12 h-12 bg-linear-to-br from-primary to-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20">
                    <IconBook className="w-7 h-7 text-primary-foreground" />
                </div>
            </div>
            <CardTitle className="text-2xl font-bold">Reset Password</CardTitle>
            <CardDescription className="px-4">
              Enter the 6-digit code we sent you and choose a new password.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleReset} className="space-y-4">
               {!email_param && (
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="m@example.com"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
               )}
              <div className="space-y-3 flex flex-col items-center">
                <Label htmlFor="otp">Verification Code</Label>
                <InputOTP
                  maxLength={6}
                  value={otp}
                  onChange={(value) => setOtp(value)}
                >
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">New Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <Button type="submit" className="w-full h-11 text-base mt-2 shadow-md shadow-primary/10" disabled={loading}>
                {loading ? "Resetting Password..." : "Update Password"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default function ResetPasswordPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ResetPasswordContent />
        </Suspense>
    )
}
