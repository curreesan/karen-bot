export type ModerationLog = {
  id: number;
  discordId: string;
  username: string;
  message: string;
  category: string;
  severity: string;
  reason: string;
  action: string;
  guildId: string;
  channelId: string;
  createdAt: string;
};

export type Offense = {
  id: number;
  discordId: string;
  username: string;
  count: number;
  lastOffenseAt: string;
  isBanned: boolean;
};
