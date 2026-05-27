export interface DrugCatalogItem {
  id: string;
  name?: string;
  generic_name?: string | null;
  display_name: string;
  strength?: string | null;
  form?: string | null;
  route?: string | null;
  is_active?: boolean;
}

export interface LabTestCatalogItem {
  id: string;
  name?: string;
  code?: string | null;
  display_name: string;
  category?: string | null;
  sample_type?: string | null;
  default_sample_type?: string | null;
  is_active?: boolean;
}
