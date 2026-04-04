"use client"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { signIn } from "@/lib/auth-client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { IconBrandGithub, IconBrandGoogle, IconBook } from "@tabler/icons-react"
import { toast } from "sonner"
import Link from "next/link"

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState<"google" | "github" | null>(null);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { data, error } = await signIn.email({
      email,
      password,
    });
    setLoading(false);
    if (!error) {
      toast.success("Welcome back to StudyHub!");
      router.push("/dashboard");
    } else {
      toast.error(error.message || "Invalid credentials");
    }
  };

  const handleSocialLogin = async (provider: "google" | "github") => {
    setSocialLoading(provider);
    const { error } = await signIn.social({
      provider,
      callbackURL: "/dashboard",
    });
    setSocialLoading(null);
    if (error) {
        toast.error(error.message || `Failed to sign in with ${provider}`);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0 border-none shadow-2xl">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-6 md:p-8" onSubmit={handleLogin}>
            <FieldGroup>
              <div className="flex flex-col items-center gap-2 text-center">
                 <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center mb-2">
                    <IconBook className="w-6 h-6 text-primary" />
                </div>
                <h1 className="text-2xl font-bold text-foreground">Welcome back</h1>
                <p className="text-balance text-muted-foreground text-sm">
                  Login to your StudyHub account
                </p>
              </div>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Field>
              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                  <Link
                    href="/forgot-password"
                    className="ml-auto text-sm underline-offset-2 hover:underline text-muted-foreground transition-colors"
                  >
                    Forgot your password?
                  </Link>
                </div>
                <Input 
                    id="password" 
                    type="password" 
                    required 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
              </Field>
              <Field>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Signing in..." : "Login"}
                </Button>
              </Field>
              <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card">
                Or continue with
              </FieldSeparator>
              <div className="grid grid-cols-2 gap-4">
                <Button 
                    variant="outline" 
                    type="button" 
                    onClick={() => handleSocialLogin("google")}
                    disabled={loading || !!socialLoading}
                    className="cursor-pointer"
                >
                  {socialLoading === "google" ? (
                    <div className="h-4 w-4 border-2 border-primary border-t-transparent rounded-full animate-spin mr-2" />
                  ) : (
                    <IconBrandGoogle className="w-5 h-5 mr-2" />
                  )}
                  Google
                </Button>
                <Button 
                    variant="outline" 
                    type="button" 
                    onClick={() => handleSocialLogin("github")}
                    disabled={loading || !!socialLoading}
                    className="cursor-pointer"
                >
                  {socialLoading === "github" ? (
                    <div className="h-4 w-4 border-2 border-primary border-t-transparent rounded-full animate-spin mr-2" />
                  ) : (
                    <IconBrandGithub className="w-5 h-5 mr-2" />
                  )}
                  GitHub
                </Button>
              </div>
              <FieldDescription className="text-center">
                Don&apos;t have an account? <a href="/signup" className="text-primary hover:underline font-medium">Sign up</a>
              </FieldDescription>
            </FieldGroup>
          </form>
          <div className="relative hidden bg-muted md:block overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1523240795612-9a054b0db644"
              alt="Students collaborating"
              className="absolute inset-0 h-full w-full object-cover select-none brightness-75 transition-transform hover:scale-105 duration-700"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 text-white text-sm font-medium">
              "Sharing is the first step towards collective growth."
            </div>
          </div>
        </CardContent>
      </Card>
      <FieldDescription className="px-6 text-center text-xs">
        By clicking continue, you agree to our <a href="#" className="hover:underline">Terms of Service</a>{" "}
        and <a href="#" className="hover:underline">Privacy Policy</a>.
      </FieldDescription>
    </div>
  )
}
