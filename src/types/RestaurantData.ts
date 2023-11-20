export interface RestaurantData {
  id: string;
  placeId: string;
  name: string;
  lat: number;
  lng: number;
  photos: [string];
  vicinity: string;
  rating: number;
  priceLevel: number;
  postalCode: string;
  website: string;
  url: string;
  userRatingsTotal: number;
  formattedPhoneNumber: string;
  direction: string;
}
