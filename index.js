import { observeOpenAI } from "langfuse";
import OpenAIApi from "openai";

const main = async () => {
    // Assumes environment variables are set
    const client = observeOpenAI(new OpenAIApi());

    const assistant = await client.beta.assistants.create({
        name: "Math Tutor",
        instructions: "You are a personal math tutor. Answer questions briefly, in a sentence or less.",
        model: "gpt-4",
    });

    const inputMessages = [
        {
            role: "assistant",
            content: "I am a math tutor that likes to help math students, how can I help?",
        },
        {
            role: "user",
            content: "I need to solve the equation `3x + 11 = 14`. Can you help me?",
        },
    ];
    // Error here when creating thread
    const thread = await client.beta.threads.create({ messages: inputMessages });

    const run = await client.beta.threads.runs.createAndPoll(thread.id, {
        assistantId: assistant.id,
        stream: false,
    });

    const messages = await client.beta.threads.messages.list(thread.id);
    console.log(messages);
};

main();
