export interface FeedItem {
  url: string;
  itemType: string = "group" | "social post";
  title: string;
  description: string;
  imgURL?: string;
}
