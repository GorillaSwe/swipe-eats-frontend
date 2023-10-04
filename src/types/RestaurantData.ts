export interface RestaurantData {
  placeId: string;
  name: string;
  lat: number;
  lng: number;
  photos: [string];
  vicinity: string;
  rating: number;
  price_level: number;
  website: string;
  url: string;
  formatted_phone_number: string;
  direction: string;
}