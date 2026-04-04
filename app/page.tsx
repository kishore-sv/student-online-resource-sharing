import FileUpload from "@/components/file-upload";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/ui/mode-toggle";

export default function Home() {
  return (
    <div>
      <h1>Hello</h1>
      <ModeToggle />
      <FileUpload />
      <Button>Submit</Button>
    </div>
  );
}
