import { PetaImage, petaImagesArrayToDBPetaImagesArray } from "@/datas/petaImage";
import { UpdateMode } from "@/datas/updateMode";
import { API } from "@/renderer/api";

export function savePetaImages(petaImages: PetaImage[], mode: UpdateMode) {
  return API.send("savePetaImages", petaImagesArrayToDBPetaImagesArray(petaImages), mode);
}