import { CustomCommand } from "./types";

export const customCommands: CustomCommand[] = [
  {
    name: "linkedin",
    type: "link",
    value: "https://linkedin.com/in/13months",
    description: "Open LinkedIn profile",
  },
  {
    name: "blog",
    type: "link",
    value: "https://13months.tistory.com",
    description: "Open personal blog",
  },
  {
    name: "hobby",
    type: "text",
    value: "🎹 Piano, 📸 Photography, 💻 Coding",
    description: "Display hobbies",
  },
  {
    name: "career",
    type: "text",
    value: "Frontend Engineer | Kakao Tech Campus",
    description: "Display career information",
  },
];
