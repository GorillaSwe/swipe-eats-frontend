export interface CardData {
  placeId: string;
  name: string;
  lat: number;
  lng: number;
  photoUrl: { url: string }[];
  direction: string;
  // 他のカードデータのプロパティをここに追加
}