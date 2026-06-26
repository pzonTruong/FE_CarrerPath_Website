import { http } from '@/shared/api/http';
import type { CareerPath } from '../types';

export const roadmapApi = {
  getByCareerId: (careerId: string) => http.get<CareerPath>(`/roadmaps/${careerId}`)
};
