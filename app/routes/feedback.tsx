import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Label } from "~/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Textarea } from "~/components/ui/textarea";
import { z } from "zod";
import { useRef, useState } from "react";
import { Form, useNavigate } from "@remix-run/react";
import { Input } from "~/components/ui/input";


const CategoryEnum = z.enum(['suggestions', 'bugs', 'complaints']);
const SeverityEnum = z.enum(['low','normal','high','urgent'])

const feedbackSchema = z.object({
  subject: z.string().min(3).max(30),
  message: z.string().min(10).max(500),
  category: CategoryEnum.optional(),
  severity: SeverityEnum.optional()
});

const feedback = () => {
  const navigate = useNavigate();
  const subject = useRef<HTMLInputElement | null>(null);
  const message = useRef<HTMLTextAreaElement | null>(null);
  const [severity, setSeverity] = useState<string | undefined>();
  const [category, setCategory] = useState<string | undefined>();
  
  const [errors, setErrors] = useState({
    subject: "",
    message: "",
    category:"",
    severity: ""
  });

  const requireds = {
    subject: true,
    category: true,
    severity: false,
    message: true,
  };
  const handleCategoryChange = (value: string) => {
    setCategory(value);
  };
  const handleSeverityChange = (value: string) => {
    setSeverity(value);
  };

  const handleFeedbackSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const feedbackData = {
      subject: subject.current?.value,
      message: message.current?.value,
      severity,
      category,
    };
    
    const result = feedbackSchema.safeParse(feedbackData);
    if (!result.success) {
      const fieldErrors = result.error.format();
      setErrors({
        subject: fieldErrors.subject?._errors?.[0] ?? "",
        message: fieldErrors.message?._errors?.[0] ?? "",
        category: fieldErrors.category?._errors?.[0] ?? "",
        severity: fieldErrors.severity?._errors?.[0] ?? "",
      });
    } else {
      setErrors({
        subject: "",
        message: "",
        category:"",
        severity:""
      });
      navigate("/");
      console.log(feedbackData);
    }
  };
  return (
    <div className="bg-slate-600 flex h-screen w-screen justify-center items-center">
      <Card className="w-fit h-auto">
        <CardHeader>
          <CardTitle>FeedBack</CardTitle>
          <CardDescription>
            Please give your valuable suggestions/feedback here
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form onSubmit={handleFeedbackSubmit} method="POST">
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <div className="flex gap-1">
                  <Label htmlFor="subject">Subject</Label>
                  <sub className="text-primary">
                    {requireds.subject ? "*" : ""}
                  </sub>
                </div>

                <Input
                  id="subject"
                  name="subject"
                  placeholder="Enter your subject..."
                //   required={requireds.subject}
                  ref={subject}
                />
                {errors.subject && (
                  <p className="text-red-600 text-xs">*{errors.subject}</p>
                )} 
                
                <br />
                <div className="flex justify-between items-center ">
                  <div className="items-center flex-col justify-center">
                    <div className="flex items-start gap-1">
                      <Label htmlFor="subject">Category</Label>
                      <span className="text-primary -mt-2">
                        {requireds.category ? "*" : ""}
                      </span>
                    </div>
                    <Select
                      name="category"
                    //   required={requireds.category}
                      onValueChange={handleCategoryChange}
                    >
                      <SelectTrigger id="category">
                        <SelectValue placeholder="Select Category" />
                      </SelectTrigger>
                      <SelectContent position="popper">
                        <SelectItem value="suggestions">Suggestions</SelectItem>
                        <SelectItem value="bugs">Bugs</SelectItem>
                        <SelectItem value="complaints">Complaints</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.category && (
                  <p className="text-red-600 text-xs">*{errors.category}</p>
                )}
                  </div>
                  <div className="items-center flex-col justify-center">
                  <div className="flex items-start gap-1">
                      <Label htmlFor="severity">Severity</Label>
                      <span className="text-primary -mt-2">
                        {requireds.severity ? "*" : ""}
                      </span>
                    </div>
                    <Select
                      name="severity"
                      onValueChange={handleSeverityChange}
                    >
                      <SelectTrigger id="severity">
                        <SelectValue placeholder="Select Severity" />
                      </SelectTrigger>
                      <SelectContent position="popper">
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="normal">Normal</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="urgent">Urgent</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.severity && (
                  <p className="text-red-600 text-xs">*{errors.severity}</p>
                )}
                  </div>
                </div>
                <br />

                <div className="flex gap-1">
                  <Label htmlFor="s">Message</Label>
                  <sub className="text-primary">
                    {requireds.message ? "*" : ""}
                  </sub>
                </div>
                <Textarea
                  className="min-h-[120px]"
                  id="message"
                  placeholder="Describe the issue you're facing, along with any relevant information. Please be as detailed and specific as possible."
                  name="message"
                //   required={requireds.message}
                  ref={message}
                />
                {errors.message && (
                  <p className="text-red-600 text-xs">*{errors.message}</p>
                )}
                
              </div>
              <br />
            </div>
            <div className="flex justify-end">
              <Button>Submit</Button>
            </div>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default feedback;
