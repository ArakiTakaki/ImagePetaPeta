export interface PetaImage {
  fileName: string,
  name: string,
  fileDate: number,
  addDate: number,
  tags: string[],
  width: number,
  height: number,
  id: string,
  _selected: boolean
}
export type PetaImages = {[id: string]: PetaImage};