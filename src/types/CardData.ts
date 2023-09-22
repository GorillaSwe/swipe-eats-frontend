export interface CardData {
  placeId: string;
  name: string;
  lat: number;
  lng: number;
  photoUrl: { url: string }[];
  // 他のカードデータのプロパティをここに追加
}