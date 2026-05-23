export interface PlanDetails {
  name: string;
  costPerSeat: number;
  minSeats?: number;
}

export const PRICING_REFERENCE = {
  'Cursor': [
    { name: 'Hobby', costPerSeat: 0 },
    { name: 'Pro', costPerSeat: 20 },
    { name: 'Business', costPerSeat: 40 }
  ],
  'GitHub Copilot': [
    { name: 'Individual', costPerSeat: 10 },
    { name: 'Business', costPerSeat: 19 },
    { name: 'Enterprise', costPerSeat: 39 }
  ],
  'Claude': [
    { name: 'Free', costPerSeat: 0 },
    { name: 'Pro', costPerSeat: 20 },
    { name: 'Team', costPerSeat: 30, minSeats: 5 } 
  ],
  'ChatGPT': [
    { name: 'Plus', costPerSeat: 20 },
    { name: 'Team', costPerSeat: 30, minSeats: 2 },
    { name: 'Enterprise', costPerSeat: 60 }
  ],
  'Gemini': [
    { name: 'Pro', costPerSeat: 20 },
    { name: 'Ultra', costPerSeat: 30 }
  ],
  'Windsurf': [
    { name: 'Free', costPerSeat: 0 },
    { name: 'Pro', costPerSeat: 15 }
  ]
};