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
import { signUp, signIn } from "@/lib/auth-client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { IconBrandGithub, IconBrandGoogle } from "@tabler/icons-react"
import { GraduationCap } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from "sonner"

const COLLEGES = [
    { label: "Presidency University", value: "presidency-university" },
    { label: "RV University", value: "rv-university" },
    { label: "REVA University", value: "reva-university" },
    { label: "BMS College of Engineering", value: "bmsce" },
    { label: "PES University", value: "pesu" },
    { label: "MS Ramaiah Institute of Technology", value: "msrit" },
    { label: "Dayananda Sagar College of Engineering", value: "dsce" },
    { label: "Bangalore Institute of Technology", value: "bit" },
    { label: "Vellore Institute of Technology (VIT)", value: "vit" },
    { label: "Manipal Institute of Technology (MIT)", value: "mit" },
    { label: "IIT Delhi", value: "iitd" },
    { label: "IIT Bombay", value: "iitb" },
    { label: "IIT Madras", value: "iitm" },
    { label: "NIT Surathkal", value: "nits" },
    { label: "BITS Pilani", value: "bits" },
    { label: "Other", value: "other" },
]

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [collegeName, setCollegeName] = useState("");
  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState<"google" | "github" | null>(null);
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!collegeName) {
        toast.error("Please select a college");
        return;
    }
    setLoading(true);
    const { data, error } = await signUp.email({
      email,
      password,
      name,
      collegeName,
    });
    setLoading(false);
    if (!error) {
      toast.success("Account created successfully!");
      router.push("/dashboard");
    } else {
      toast.error(error.message || "An error occurred");
    }
  };

  const handleSocialSignup = async (provider: "google" | "github") => {
    setSocialLoading(provider);
    const { error } = await signIn.social({
      provider,
      callbackURL: "/dashboard",
    });
    setSocialLoading(null);
    if (error) {
        toast.error(error.message || `Failed to sign up with ${provider}`);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0 border-none shadow-2xl">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-6 md:p-8" onSubmit={handleSignup}>
            <FieldGroup>
              <div className="flex flex-col items-center gap-2 text-center mb-4">
                 <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center mb-2">
                   <GraduationCap className="w-6 h-6 text-primary" />
                </div>
                <h1 className="text-2xl font-bold">Create your account</h1>
                <p className="text-sm text-balance text-muted-foreground">
                  Join StudyHub and start sharing resources
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Field>
                    <FieldLabel htmlFor="name">Full Name</FieldLabel>
                    <Input
                      id="name"
                      type="text"
                      placeholder="John Doe"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                </Field>
                <Field>
                    <FieldLabel htmlFor="college">College Name</FieldLabel>
                    <Select onValueChange={setCollegeName} required>
                        <SelectTrigger id="college" className="w-full h-9">
                            <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent className="max-h-56">
                            {COLLEGES.map((college) => (
                                <SelectItem key={college.value} value={college.label}>
                                    {college.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </Field>
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
                <FieldLabel htmlFor="password">Password</FieldLabel>
                <Input 
                    id="password" 
                    type="password" 
                    required 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <FieldDescription>
                   At least 8 characters long.
                </FieldDescription>
              </Field>

              <Field>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Creating account..." : "Create Account"}
                </Button>
              </Field>
              <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card">
                Or continue with
              </FieldSeparator>
              <div className="grid grid-cols-2 gap-4">
                <Button 
                    variant="outline" 
                    type="button" 
                    onClick={() => handleSocialSignup("google")}
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
                    onClick={() => handleSocialSignup("github")}
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
              <FieldDescription className="text-center mt-2">
                Already have an account? <a href="/login" className="text-primary font-medium hover:underline">Sign in</a>
              </FieldDescription>
            </FieldGroup>
          </form>
          <div className="relative hidden bg-muted md:block overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1515187029135-18ee286d815b"
              alt="Students study together"
              className="absolute inset-0 h-full w-full object-cover select-none brightness-75 transition-transform hover:scale-105 duration-700"
            />
             <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 text-white text-sm font-medium">
                "Empowering students through shared knowledge and collaboration."
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
