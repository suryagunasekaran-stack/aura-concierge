export type ExamplePrompt = {
  label: string;
  text: string;
};

/** Demo prompts mapped to common concierge tool flows */
export const EXAMPLE_PROMPTS: ExamplePrompt[] = [
  {
    label: "Treatments",
    text: "What treatments do you offer?",
  },
  {
    label: "HydraFacial price",
    text: "How much is the HydraFacial?",
  },
  {
    label: "Book facial",
    text: "Can I book a facial for tomorrow?",
  },
  {
    label: "My packages",
    text: "What packages do I have left?",
  },
  {
    label: "My appointment",
    text: "Is my appointment still on?",
  },
  {
    label: "Clinic hours",
    text: "What time do you close today?",
  },
  {
    label: "Promos",
    text: "Got any promo or trial price for Emerald Peel?",
  },
  {
    label: "Acne advice",
    text: "Which facial is good for acne? I'm 25.",
  },
  {
    label: "Aftercare",
    text: "How should I prepare before a chemical peel?",
  },
  {
    label: "Consultation",
    text: "I'm not sure which treatment to pick — can I book a consultation?",
  },
];

export const RESET_MESSAGE = "start over";
