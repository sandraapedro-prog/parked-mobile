export type ItemType = "Idea" | "Hobby";

export const ITEM_TYPES: ItemType[] = ["Idea", "Hobby"];

export type Category = string;

export const BUILTIN_CATEGORIES: string[] = [
  "Creative",
  "Business",
  "Personal",
  "Reading",
  "Sports",
  "Cooking",
];

export const CATEGORIES: string[] = BUILTIN_CATEGORIES;

export type CustomCategory = {
  name: string;
  color: string;
};

export type Energy = "Low" | "Medium" | "High";

export const ENERGY_LEVELS: Energy[] = ["Low", "Medium", "High"];

export const ENERGY_HINT: Record<Energy, string> = {
  Low: "Easy to pick up.",
  Medium: "Needs some focus.",
  High: "Deep work required.",
};

export type ParkedItem = {
  id: string;
  title: string;
  notes?: string;
  type: ItemType;
  category?: string;
  energy?: Energy;
  checkInDate?: string; // ISO date
  createdAt: string;
  unparkedAt?: string;
  deletedAt?: string;
};

export type Filter = "All" | "Hobbies" | "Ideas" | "Due";

export const FILTERS: { key: Filter; label: string }[] = [
  { key: "All", label: "All" },
  { key: "Hobbies", label: "Hobbies" },
  { key: "Ideas", label: "Ideas" },
  { key: "Due", label: "Due for check-in" },
];

export const SEED_ITEMS: ParkedItem[] = [
  {
    id: "seed-1",
    title: "Watercolour painting",
    notes:
      "Got halfway through a landscape series. Loved it but got out of time.",
    type: "Hobby",
    category: "Creative",
    energy: "Medium",
    checkInDate: "2026-06-01",
    createdAt: "2026-02-04T10:00:00.000Z",
  },
  {
    id: "seed-2",
    title: "App for dog walkers",
    notes:
      "Matching platform with live GPS. Need to research competitors first.",
    type: "Idea",
    category: "Business",
    energy: "High",
    checkInDate: "2026-07-31",
    createdAt: "2026-01-12T10:00:00.000Z",
  },
  {
    id: "seed-3",
    title: "Learning Portuguese",
    notes:
      "Was on lesson 24 on Duolingo. Paused it for a holiday and haven't picked it up since.",
    type: "Hobby",
    category: "Personal",
    energy: "Medium",
    checkInDate: "2026-05-01",
    createdAt: "2025-11-22T10:00:00.000Z",
  },
  {
    id: "seed-4",
    title: 'Read "The Dawn of Everything"',
    notes:
      "Started it, loved the first chapter, then life got busy. This one deserves full attention.",
    type: "Hobby",
    category: "Reading",
    energy: "High",
    checkInDate: "2026-04-30",
    createdAt: "2025-12-05T10:00:00.000Z",
  },
  {
    id: "seed-5",
    title: "Playing tennis",
    notes:
      "Don't have anyone to play with and group classes are too far away.",
    type: "Hobby",
    category: "Sports",
    energy: "Low",
    createdAt: "2025-10-18T10:00:00.000Z",
  },
  {
    id: "seed-6",
    title: "Sourdough from scratch",
    notes:
      "Made a starter, baked twice, then went on a trip. The starter is in the freezer waiting.",
    type: "Hobby",
    category: "Cooking",
    energy: "Medium",
    checkInDate: "2026-04-29",
    createdAt: "2026-02-20T10:00:00.000Z",
  },
  {
    id: "seed-7",
    title: "Newsletter for indie founders",
    notes:
      "Idea: weekly behind-the-scenes from people building small, calm businesses.",
    type: "Idea",
    category: "Business",
    energy: "Medium",
    createdAt: "2026-03-15T10:00:00.000Z",
  },
];

// Items that have already been "unparked" — they appear on the Active page
// and demonstrate the flow from day one.
export const ACTIVE_SEED_ITEMS: ParkedItem[] = [
  {
    id: "active-1",
    title: "Morning yoga routine",
    notes:
      "Started a 20-minute flow each morning. Slowly building the habit back.",
    type: "Hobby",
    category: "Personal",
    energy: "Low",
    createdAt: "2026-04-10T08:00:00.000Z",
    unparkedAt: "2026-04-15T08:00:00.000Z",
  },
  {
    id: "active-2",
    title: "Newsletter MVP",
    notes:
      "Drafting the first issue this week. Substack page is up and ready.",
    type: "Idea",
    category: "Business",
    energy: "Medium",
    createdAt: "2026-03-22T10:00:00.000Z",
    unparkedAt: "2026-04-18T10:00:00.000Z",
  },
  {
    id: "active-3",
    title: "Garden planters",
    notes:
      "Planted herbs in the new ceramic pots — basil, mint, rosemary.",
    type: "Hobby",
    category: "Creative",
    energy: "Low",
    createdAt: "2026-03-08T12:00:00.000Z",
    unparkedAt: "2026-04-12T12:00:00.000Z",
  },
];
