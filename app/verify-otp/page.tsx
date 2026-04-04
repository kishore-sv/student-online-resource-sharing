"use client"
import { useState, Suspense } from "react"
import { authClient } from "@/lib/auth-client"
import { Button } from "@/components/ui/button"
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
  InputOTPSeparator,
} from "@/components/ui/input-otp"

function VerifyOtpContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const email = searchParams.get("email") || ""

  const [otp, setOtp] = useState("")
  const [loading, setLoading] = useState(false)

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault()
    if (otp.length !== 6) {
      toast.error("Please enter a valid 6-digit code")
      return;
    }
    setLoading(true)
    const { error } = await authClient.emailOtp.verifyEmail({
      email,
      otp,
    })
    setLoading(false)
    if (error) {
      toast.error(error.message || "Invalid or expired code")
    } else {
      toast.success("Email verified! Redirecting to dashboard...")
      // Adding a small delay to ensure session is updated
      setTimeout(() => {
        router.push("/home")
        router.refresh() // Refresh to update server-side session checks
      }, 500)
    }
  }

  const handleResend = async () => {
    await authClient.emailOtp.sendVerificationOtp({
      email,
      type: "email-verification",
    })
    toast.success("Verification code resent!")
  }

  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-background p-6 md:p-10">
      <div className="w-full max-w-md">
        <Link href="/signup" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors group">
          <IconArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          Back to signup
        </Link>

        <Card className="border-none shadow-2xl">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="w-12 h-12 bg-linear-to-br from-primary to-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20">
                <IconBook className="w-7 h-7 text-primary-foreground" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold">Verify your email</CardTitle>
            <CardDescription className="px-4">
              We&apos;ve sent a 6-digit code to <span className="font-semibold text-foreground">{email}</span>.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleVerify} className="space-y-6">
              <div className="space-y-4 flex flex-col items-center">
                <Label htmlFor="otp" className="text-muted-foreground font-normal">One-Time Password</Label>
                <InputOTP
                  maxLength={6}
                  value={otp}
                  onChange={(value) => setOtp(value)}
                  className="gap-2"
                >
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                  </InputOTPGroup>
                  <InputOTPSeparator />
                  <InputOTPGroup>
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
              </div>
              <Button type="submit" className="w-full h-12 cursor-pointer text-base font-medium shadow-md shadow-primary/10" disabled={loading}>
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                    Verifying...
                  </div>
                ) : "Verify & Continue"}
              </Button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={handleResend}
                  className="text-sm text-primary hover:text-primary/80 font-medium transition-colors cursor-pointer"
                >
                  Didn&apos;t receive code? Resend
                </button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default function VerifyOtpPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VerifyOtpContent />
    </Suspense>
  )
}
