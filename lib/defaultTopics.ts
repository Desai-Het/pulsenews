import { Topic } from "@/types";

export const DEFAULT_TOPICS: Topic[] = [
  {
    id: "ai-genai",
    label: "AI & Generative Tech",
    query:
      "generative AI OR LLM OR GPT OR Claude OR Gemini OR artificial intelligence invention",
    isDefault: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: "tech-global",
    label: "Tech World",
    query:
      "technology India USA Google Microsoft Apple Samsung startup tech innovation",
    isDefault: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: "big-companies",
    label: "Big Companies",
    query:
      "SpaceX OR Meta OR Google OR Microsoft OR Amazon OR Nvidia OR Emergent OR OpenAI announcement",
    isDefault: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: "politics",
    label: "India & USA Politics",
    query:
      "India policy law rule government USA politics policy congress parliament Modi",
    isDefault: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: "must-know",
    label: "Must Know",
    query:
      "breaking world major event crisis discovery historic milestone important",
    isDefault: true,
    createdAt: new Date().toISOString(),
  },
];
