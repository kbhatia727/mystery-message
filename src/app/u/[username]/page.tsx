"use client";
import React, { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { messageSchema } from "@/schemas/messageSchema";
import { ApiResponse } from "@/types/ApiResponse";
import axios, { AxiosError } from "axios";
import { useParams } from "next/navigation";
import { useCompletion } from "@ai-sdk/react";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

const page = () => {
  const params = useParams<{ username: string }>();

  const [messageSuggestions, setMessageSuggestions] = useState<string[]>([]);

  const form = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema),
    defaultValues: {
      content: "",
    },
  });
  const { reset } = form;

  async function onSubmit(data: z.infer<typeof messageSchema>) {
    try {
      const response = await axios.post<ApiResponse>("/api/send-message", {
        username: params.username,
        content: data.content,
      });
      if (response.data.success)
        toast.success("Success", { description: response.data.message });
      reset({
        content: "",
      });
    } catch (err) {
      const axiosError = err as AxiosError<ApiResponse>;
      let errorMessage = axiosError.response?.data?.message;
      toast.error("Failed to sent message", { description: errorMessage });
    }
  }

  const { isLoading, error, completion, complete } = useCompletion({
    api: "/api/suggest-messages",
    onResponse: (response: Response) => {
      if (response.status === 429) {
        toast.error("You are being rate limited. Please try again later.");
      }
    },
    onFinish: () => {
      toast.success("Successfully generated completion!");
    },
    onError: (error: Error) => {
      console.error("An error occurred:", error);
    },
  });

  useEffect(() => {
    if (error) {
      toast.error(error.message);
    }
  }, [error]);

  useEffect(() => {
    if (completion) {
      const messages = completion.split("||");
      setMessageSuggestions(messages);
    }
  }, [completion]);

  return (
    <div>
      <h1>Public profile link</h1>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-2/3 space-y-6"
        >
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Send Anonymous message to {params.username}
                </FormLabel>
                <FormControl>
                  <Input placeholder="Write your message here" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Send</Button>
        </form>
      </Form>
      <Separator />

      <Button
        onClick={async () => {
          await complete("hey");
        }}
        disabled={isLoading}
      >
        {isLoading ? "Loading.." : "Suggest Messages"}
      </Button>
      <div>
        <ul>
          {messageSuggestions.length > 0 ? (
            messageSuggestions.map((message, index) => (
              <li
                key={index}
                onClick={() => {
                  form.setValue("content", message);
                }}
              >
                {message}
              </li>
            ))
          ) : (
            <p>No suggestions available</p>
          )}
        </ul>
      </div>
    </div>
  );
};

export default page;
