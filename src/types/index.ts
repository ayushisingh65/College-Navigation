export interface Location {
  id: string;
  name: string;
  description?: string;
  type: 'room' | 'facility' | 'lab' | 'other';
}

export interface NavigationState {
  startLocation: string;
  destinationLocation?: Location;
} 