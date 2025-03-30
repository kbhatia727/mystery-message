import { openai } from "@ai-sdk/openai";
import { streamText, simulateReadableStream } from "ai";
import { MockLanguageModelV1 } from "ai/test";

export const maxDuration = 30;

export async function POST(req: Request) {
  const prompt =
    "Create list of three engaging question formatted as a single string. Each question should be separated by'||'. These questions are for an anonymous social messaging platform and should be suitable for diverse audience. Focus on universal themes that encourage friendly interaction. for example: 'whats your hobby?||what simple thing make you happy?||if you could have dinner with historical figure, who would it be?'";

  const model = openai.completion("gpt-3.5-turbo-instruct", { echo: true });

  let result = streamText({
    model: model,
    maxTokens: 400,
    prompt: prompt,
    onChunk({ chunk }) {},
    onError({ error }) {
      console.error(error);
    },
    onFinish({ text, finishReason, usage, response }) {
      // const messages = response.messages;
    },
  });

  // for await (const part of result.fullStream) {
  //   switch (part.type) {
  //     case "text-delta": {
  //       break;
  //     }
  //     case "reasoning": {
  //       break;
  //     }
  //     case "source": {
  //       break;
  //     }
  //     case "finish": {
  //       break;
  //     }
  //     case "error": {
  //       const error = part.error;
  //       break;
  //     }
  //   }
  // }

  //Testing purpose
  // result = streamText({
  //   model: new MockLanguageModelV1({
  //     doStream: async () => ({
  //       stream: simulateReadableStream({
  //         chunks: [
  //           { type: "text-delta", textDelta: "What inspires you most " },
  //           { type: "text-delta", textDelta: "in life?" },
  //           { type: "text-delta", textDelta: "||" },
  //           { type: "text-delta", textDelta: "If you could live " },
  //           { type: "text-delta", textDelta: "anywhere in the world, " },
  //           { type: "text-delta", textDelta: "where would it be?" },
  //           { type: "text-delta", textDelta: "||" },
  //           { type: "text-delta", textDelta: "What's the most " },
  //           { type: "text-delta", textDelta: "memorable trip you've " },
  //           { type: "text-delta", textDelta: "ever taken?" },
  //           {
  //             type: "finish",
  //             finishReason: "stop",
  //             logprobs: undefined,
  //             usage: { completionTokens: 50, promptTokens: 3 },
  //           },
  //         ],
  //       }),
  //       rawCall: { rawPrompt: null, rawSettings: {} },
  //     }),
  //   }),
  //   prompt: "Error handling stream!",
  // });

  return result.toDataStreamResponse({
    getErrorMessage: (error) => {
      return "Failed to get suggestions";
      // if (error == null) {
      //   return "unknown error";
      // }

      // if (typeof error === "string") {
      //   return error;
      // }

      // if (error instanceof Error) {
      //   return error?.message;
      // }

      // return JSON.stringify(error);
    },
  });
}
