export interface MockMessage {
  id: string;
  sender_name: string;
  message_content: string;
  ink_color: string;
  font_style: string;
  created_at: string;
}

export const MOCK_MESSAGES: MockMessage[] = [
  {
    id: "1",
    sender_name: "Alen",
    message_content: "Bro, those late-night debugging sessions in the lab were legendary. Never forget the time we fixed that bug at 3 AM and celebrated with instant noodles. You're going places! 🚀",
    ink_color: "#1a3a6b",
    font_style: "Caveat",
    created_at: "2026-02-20T10:30:00Z",
  },
  {
    id: "2",
    sender_name: "Ayush",
    message_content: "From the first day of college to the last, you've been the most reliable friend anyone could ask for. Keep being awesome, and don't forget us when you're famous!",
    ink_color: "#1a1a1a",
    font_style: "Shadows Into Light",
    created_at: "2026-02-21T14:15:00Z",
  },
  {
    id: "3",
    sender_name: "Adithya",
    message_content: "Remember our crazy hackathon project? We didn't win, but the memories we made were worth more than any trophy. Stay curious, stay hungry! ✨",
    ink_color: "#8b1a1a",
    font_style: "Kalam",
    created_at: "2026-02-22T09:00:00Z",
  },
  {
    id: "4",
    sender_name: "Alphy",
    message_content: "You always had the best notes and the worst handwriting. Thanks for being there through every exam and every crisis. Love you, buddy! 💙",
    ink_color: "#1a3a6b",
    font_style: "Caveat",
    created_at: "2026-02-23T16:45:00Z",
  },
  {
    id: "5",
    sender_name: "Ashwin",
    message_content: "The canteen, the bunked classes, the last-minute submissions — wouldn't trade any of it. Here's to our friendship lasting forever!",
    ink_color: "#1a1a1a",
    font_style: "Kalam",
    created_at: "2026-02-24T11:20:00Z",
  },
  {
    id: "6",
    sender_name: "Abel",
    message_content: "You taught me that the best code is written with friends, not alone. Thank you for every moment. See you at the reunion! 🎓",
    ink_color: "#8b1a1a",
    font_style: "Shadows Into Light",
    created_at: "2026-02-25T08:30:00Z",
  },
];

export const INK_COLORS = [
  { name: "Blue", value: "#1a3a6b" },
  { name: "Black", value: "#1a1a1a" },
  { name: "Red", value: "#8b1a1a" },
];

export const FONT_STYLES = [
  { name: "Casual", value: "Caveat", className: "font-caveat" },
  { name: "Playful", value: "Shadows Into Light", className: "font-shadows" },
  { name: "Neat", value: "Kalam", className: "font-kalam" },
];
