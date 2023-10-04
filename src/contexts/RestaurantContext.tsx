"use client";

import React, { createContext, useContext, ReactNode, useState } from 'react';
import { RestaurantData as restaurant } from '@/types/RestaurantData';

interface RestaurantData {
  restaurantsWithDirection: restaurant[];
  latitude: number | null;
  longitude: number | null;
}

const defaultState: RestaurantData = {
  restaurantsWithDirection: [],
  latitude: null,
  longitude: null,
};

const RestaurantUpdateContext = createContext<Function>(() => {});
export const RestaurantContext = createContext<RestaurantData>(defaultState);

export const useRestaurantData = () => useContext(RestaurantContext);
export const useSetRestaurantData = () => useContext(RestaurantUpdateContext);

interface Props {
  children: ReactNode;
}

export const RestaurantProvider: React.FC<Props> = ({ children }) => {
  const [data, setData] = useState(defaultState);

  return (
    <RestaurantContext.Provider value={data}>
      <RestaurantUpdateContext.Provider value={setData}>
        {children}
      </RestaurantUpdateContext.Provider>
    </RestaurantContext.Provider>
  );
};