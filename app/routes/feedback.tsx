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
import { Form, redirect, useActionData} from "@remix-run/react";
import { Input } from "~/components/ui/input";
import fs from "fs/promises";

type FeedbackErrors = {
  subject?: string[];
  message?: string[];
  category?: string[];
  severity?: string[];
};

const CategoryEnum = z.enum(["suggestions", "bugs", "complaints"]);
const SeverityEnum = z.enum(["low", "normal", "high", "urgent"]);

const feedbackSchema = z.object({
  subject: z.string().min(3).max(30),
  message: z.string().min(10).max(500),
  category: CategoryEnum.optional(),
  severity: SeverityEnum.optional(),
});

export async function action({ request }) {
  const fromData = await request.formData();
  const feedbackData = Object.fromEntries(fromData);
  const result = feedbackSchema.safeParse(feedbackData);
  if (!result.success) {
    return { errors: result.error.flatten().fieldErrors };
  } else {
    const preFeedbackData = await fs.readFile("feedbacks.json", "utf-8");
    const preData = JSON.parse(preFeedbackData);
    preData.push(feedbackData);
    await fs.writeFile(
      "feedbacks.json",
      JSON.stringify(preData, null, 2),
      "utf-8"
    );
    return redirect("/");
  }
}

const feedback = () => {
  const requireds = {
    subject: true,
    category: true,
    severity: false,
    message: true,
  };
  const errors = useActionData<{ errors?: FeedbackErrors }>();
  
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
          <Form method="POST">
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

                />
                 {errors?.errors?.subject && (
                  <p className="text-red-600 text-xs">*{errors.errors.subject[0]}</p>
                )}

                <br />
                <div className="flex justify-between items-center ">
                  <div className="items-center flex-col justify-center">
                    <div className="flex items-start gap-1">
                      <Label htmlFor="subject">Category</Label>
                    </div>
                    <Select
                      name="category"
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
                    {errors?.errors?.category && (
                  <p className="text-red-600 text-xs">*Required</p>
                )}
                  </div>
                  <div className="items-center flex-col justify-center">
                    <div className="flex items-start gap-1">
                      <Label htmlFor="severity">Severity</Label>
                      
                    </div>
                    <Select name="severity">
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
                    {errors?.errors?.severity && (
                  <p className="text-red-600 text-xs">*Required</p>
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
                  />
                  {errors?.errors?.message && (
                  <p className="text-red-600 text-xs">*{errors.errors.message[0]}</p>
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
