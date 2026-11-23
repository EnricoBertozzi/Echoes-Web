/** Contrato: /api/v1/classrooms/{classroomId}/materials */
export interface ClassroomMaterial {
  id: string;
  title: string;
  description: string | null;
  originalFileName: string;
  contentType: string;
  fileSize: number;
  authorId: string;
  authorName: string;
  createdAt: string;
  updatedAt: string | null;
  previewable: boolean;
}

export interface ClassroomMaterialUpdate {
  title: string;
  description: string;
}
