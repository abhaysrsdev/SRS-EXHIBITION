export type BusinessType = 'Wholesaler' | 'Retailer' | 'Distributor' | 'Other';

export interface ExhibitionLead {
  id: string;
  name: string;
  mobile: string;
  city: string;
  state: string | null;
  shop_name: string;
  business_type: BusinessType | null;
  product_code: string | null;
  sales_order_code: string | null;
  remarks: string | null;
  uploaded_files: UploadedFile[] | null;
  created_at: string;
}

export interface UploadedFile {
  name: string;
  url: string;
  type: string;
  size: number;
  category: 'visiting_card' | 'shop_photo' | 'gst_certificate' | 'other';
}

export interface LeadFormData {
  name: string;
  mobile: string;
  city: string;
  state?: string;
  shop_name: string;
  business_type?: BusinessType;
  product_code?: string;
  sales_order_code?: string;
  remarks?: string;
}

export interface FileWithPreview extends File {
  preview?: string;
  category?: 'visiting_card' | 'shop_photo' | 'gst_certificate';
}

export interface AdminLeadRow extends ExhibitionLead {
  _fileCount: number;
}
