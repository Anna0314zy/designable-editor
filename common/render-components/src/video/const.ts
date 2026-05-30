export enum playerMessageTypeCollection {
  PLAYEREVENT = "playerEvent",
  PLAYERSTATE = "playerState",
}

export enum PlayerEventTypeCollection {
  PLAY = "play",
  PAUSE = "pause",
  ENDED = "ended",
  ENTERFULLSCREEN = "enterfullscreen",
  EXITFULLSCREEN = "exitfullscreen",
  VOLUMECHANGE = "volumechange",
  SEEKED = "seeked",
  RATECHANGE = "ratechange",
  TIMEUPDATE = "timeupdate",
}

export const playerEvents: string[] = [
  PlayerEventTypeCollection.PLAY,
  PlayerEventTypeCollection.PAUSE,
  PlayerEventTypeCollection.ENDED,
  PlayerEventTypeCollection.ENTERFULLSCREEN,
  PlayerEventTypeCollection.EXITFULLSCREEN,
  PlayerEventTypeCollection.VOLUMECHANGE,
  PlayerEventTypeCollection.SEEKED,
  PlayerEventTypeCollection.RATECHANGE,
];
