export interface finding {
    "user_id": string,
    "title": string,
    "description": string,
    "gene": string,
    "genes_in_view": string[],
    "chart_markers": object,
    "workspace_id": number,
    "chrm": string,
    "start": number,
    "end": number,
    "id": number
  }