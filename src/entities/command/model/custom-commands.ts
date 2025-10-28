import { CustomCommand } from "./types";

export const customCommands: CustomCommand[] = [
  {
    name: "github",
    type: "link",
    value: "https://github.com/i3months",
    description: "Open GitHub profile",
  },
  {
    name: "resume",
    type: "link",
    value: "https://13months.netlify.app/en",
    description: "Open resume website",
  },
  {
    name: "contact",
    type: "text",
    value: `- Linkedin : https://www.linkedin.com/in/joonmo-jeong/
- Github   : https://github.com/i3months
- Blog     : https://13months.tistory.com
- Email    : jeongjoonmo.dev@gmail.com`,
    description: "Display contact information",
  },
  {
    name: "linkedin",
    type: "link",
    value: "https://www.linkedin.com/in/joonmo-jeong/",
    description: "Open LinkedIn profile",
  },
  {
    name: "blog",
    type: "link",
    value: "https://13months.tistory.com",
    description: "Open personal blog",
  },
  {
    name: "career",
    type: "text",
    value: "Frontend Engineer | Kakao Tech Campus",
    description: "Display career information",
  },
];
