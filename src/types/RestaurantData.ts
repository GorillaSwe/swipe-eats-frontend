export interface RestaurantData {
  placeId: string;
  name: string;
  lat: number;
  lng: number;
  photos: [string];
  vicinity: string;
  rating: number;
  priceLevel: number;
  website: string;
  url: string;
  userRatingsTotal: number,
  formattedPhoneNumber: string;
  direction: string;
}