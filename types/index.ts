export type EquipmentStatus = 'available' | 'maintenance';

export type Equipment = {
  id: string;
  name: string;
  category_id: string | null;
  total_quantity: number;
  status: EquipmentStatus;
  image_url: string | null;
  description: string | null;
  created_at: string;
};

export type BookingStatus = 'active' | 'completed' | 'cancelled';

export type Booking = {
  id: string;
  equipment_id: string;
  start_date: string;
  end_date: string;
  quantity: number;
  customer_name: string;
  customer_email: string | null;
  customer_phone: string | null;
  status: BookingStatus;
  notes: string | null;
  created_at: string;
};

export type Category = {
  id: string;
  name: string;
  slug: string;
  created_at: string;
};
