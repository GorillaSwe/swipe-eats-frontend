export interface RestaurantData {
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
  direction: boolean | null;
  isFavorite: boolean | null;
  userSub: string;
  userName: string;
  userPicture: string;
  createdAt: string;
  userRating: number;
  userComment: string;
}
