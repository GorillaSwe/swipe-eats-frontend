export interface RestaurantData {
  placeId: string;
  name: string;
  lat: number;
  lng: number;
  photoUrl: { url: string }[];
  direction: string;
}