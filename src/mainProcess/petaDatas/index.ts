import { UpdateMode } from "@/commons/api/interfaces/updateMode";
import { ImageType } from "@/commons/datas/imageType";
import { PetaImage } from "@/commons/datas/petaImage";
import { minimId } from "@/commons/utils/utils";
import { MainLogger } from "@/mainProcess/utils/mainLogger";
import * as Path from "path";
import * as file from "@/mainProcess/storages/file";
import { createPetaBoard, PetaBoard } from "@/commons/datas/petaBoard";
import { createPetaTag, PetaTag } from "@/commons/datas/petaTag";
import { createPetaPetaImagePetaTag, PetaImagePetaTag } from "@/commons/datas/petaImagesPetaTags";
import DB from "@/mainProcess/storages/db";
import { MainEvents } from "@/commons/api/mainEvents";
import { ImportImageResult } from "@/commons/api/interfaces/importImageResult";
import { promiseSerial } from "@/commons/utils/promiseSerial";
import { Settings } from "@/commons/datas/settings";
import Config from "@/mainProcess/storages/config";
import sharp from "sharp";
import crypto from "crypto";
import dateFormat from "dateformat";
import { upgradePetaBoard, upgradePetaImage } from "@/mainProcess/utils/upgrader";
import { imageFormatToExtention } from "@/mainProcess/utils/imageFormatToExtention";
import { DEFAULT_BOARD_NAME, PLACEHOLDER_COMPONENT, PLACEHOLDER_SIZE, UNTAGGED_ID } from "@/commons/defines";
import { encode as encodePlaceholder } from "blurhash";
import { PetaTagInfo } from "@/commons/datas/petaTagInfo";
import { createI18n, I18n } from "vue-i18n";
import languages from "@/commons/languages";
export class PetaDatas {
  cancelImportImages: (() => void) | undefined;
  constructor(
    private datas: {
      dataPetaImages: DB<PetaImage>,
      dataPetaBoards: DB<PetaBoard>,
      dataPetaTags: DB<PetaTag>,
      dataPetaImagesPetaTags: DB<PetaImagePetaTag>,
      dataSettings: Config<Settings>
    },
    private paths: {
      DIR_IMAGES: string,
      DIR_THUMBNAILS: string
    },
    private emitMainEvent: <U extends keyof MainEvents>(key: U, ...args: Parameters<MainEvents[U]>) => void,
    private mainLogger: MainLogger
  ) {

  }
  /*------------------------------------
    PetaImage更新
  ------------------------------------*/
  async updatePetaImage(petaImage: PetaImage, mode: UpdateMode) {
    const log = this.mainLogger.logChunk();
    log.log("##Update PetaImage");
    log.log("mode:", mode);
    log.log("image:", minimId(petaImage.id));
    if (mode == UpdateMode.REMOVE) {
      await this.datas.dataPetaImagesPetaTags.remove({ petaImageId: petaImage.id });
      log.log("removed tags");
      await this.datas.dataPetaImages.remove({ id: petaImage.id });
      log.log("removed db");
      await file.rm(this.getImagePath(petaImage, ImageType.ORIGINAL)).catch((e) => {});
      log.log("removed file");
      await file.rm(this.getImagePath(petaImage, ImageType.THUMBNAIL)).catch((e) => {});
      log.log("removed thumbnail");
      return true;
    }
    await this.datas.dataPetaImages.update({ id: petaImage.id }, petaImage, mode == UpdateMode.UPSERT);
    log.log("updated");
    // emitMainEvent("updatePetaImage", petaImage);
    return true;
  }
  /*------------------------------------
    PetaBoard更新
  ------------------------------------*/
  async updatePetaBoard(board: PetaBoard, mode: UpdateMode) {
    const log = this.mainLogger.logChunk();
    log.log("##Update PetaBoard");
    log.log("mode:", mode);
    log.log("board:", minimId(board.id));
    if (mode == UpdateMode.REMOVE) {
      await this.datas.dataPetaBoards.remove({ id: board.id });
      log.log("removed");
      return true;
    }
    await this.datas.dataPetaBoards.update({ id: board.id }, board, mode == UpdateMode.UPSERT);
    log.log("updated");
    return true;
  }
  async getPetaImageIdsByPetaTagIds(petaTagIds: string[] | undefined) {
    const log = this.mainLogger.logChunk();
    // all
    if (!petaTagIds) {
      log.log("type: all");
      const ids = (await this.datas.dataPetaImages.find({})).map((pi) => pi.id);
      log.log("return:", ids.length);
      return ids;
    }
    // untagged
    if (petaTagIds.length == 0) {
      log.log("type: untagged");
      const taggedIds = Array.from(new Set((await this.datas.dataPetaImagesPetaTags.find({})).map((pipt) => {
        return pipt.petaImageId;
      })));
      const ids = (await this.datas.dataPetaImages.find({
        id: {
          $nin: taggedIds
        }
      })).map((pi) => pi.id);
      return ids;
    }
    // filter by ids
    log.log("type: filter");
    const pipts = (await this.datas.dataPetaImagesPetaTags.find({
      $or: petaTagIds.map((id) => {
        return {
          petaTagId: id
        }
      })
    }));
    const ids = Array.from(new Set(pipts.map((pipt) => {
      return pipt.petaImageId;
    }))).filter((id) => {
      return pipts.filter((pipt) => {
        return pipt.petaImageId === id;
      }).length == petaTagIds.length
    });
    return ids;
  }
  async getPetaTagIdsByPetaImageIds(petaImageIds: string[]) {
    const log = this.mainLogger.logChunk();
    // all
    if (petaImageIds.length == 0) {
      const ids = (await this.datas.dataPetaImagesPetaTags.find({})).map((pipt) => {
        return pipt.petaTagId;
      });
      log.log("type: all");
      log.log("return:", ids.length);
      return ids;
    }
    log.log("type: filter");
    // filter by ids
    // const timerUUID = uuid().substring(0, 5);
    // console.time("getPetaImageIdsByPetaTagIds-find:" + timerUUID);
    let pipts: PetaImagePetaTag[] = [];
    await promiseSerial(async (petaImageId) => {
      pipts.push(...(await this.datas.dataPetaImagesPetaTags.find({ petaImageId })));
    }, petaImageIds).value;
    // console.timeEnd("getPetaImageIdsByPetaTagIds-find:" + timerUUID);
    const ids = Array.from(new Set(pipts.map((pipt) => {
      return pipt.petaTagId;
    })));
    const petaTagIds = ids.filter((id) => {
      return pipts.filter((pipt) => {
        return pipt.petaTagId == id;
      }).length == petaImageIds.length;
    });
    return petaTagIds;
  }
  async getPetaTagInfos(untaggedName: string) {
    const log = this.mainLogger.logChunk();
    const petaTags = await this.datas.dataPetaTags.find({});
    const taggedIds = Array.from(new Set((await this.datas.dataPetaImagesPetaTags.find({})).map((pipt) => {
      return pipt.petaImageId;
    })));
    const count = (await this.datas.dataPetaImages.count({
      id: {
        $nin: taggedIds
      }
    }));
    let values: PetaTagInfo[] = [];
    const result = promiseSerial(async (petaTag) => {
      const info = {
        petaTag,
        count: await this.datas.dataPetaImagesPetaTags.count({ petaTagId: petaTag.id })
      } as PetaTagInfo;
      values.push(info);
      return info;
    }, petaTags);
    const values2 = await result.value;
    log.log("return:", values.length);
    values.sort((a, b) => {
      if (a.petaTag.name < b.petaTag.name) {
        return -1;
      } else {
        return 1;
      }
    });
    values.unshift({
      petaTag: {
        index: 0,
        id: UNTAGGED_ID,
        name: untaggedName
      },
      count: count
    });
    return values;
  }
  async regenerateThumbnails() {
    const log = this.mainLogger.logChunk();
    this.emitMainEvent("regenerateThumbnailsBegin");
    const images = await this.datas.dataPetaImages.find({});
    const generate = async (image: PetaImage, i: number) => {
      upgradePetaImage(image);
      const data = await file.readFile(Path.resolve(this.paths.DIR_IMAGES, image.file.original));
      const result = await this.generateThumbnail({
        data,
        outputFilePath: Path.resolve(this.paths.DIR_THUMBNAILS, image.file.original),
        size: this.datas.dataSettings.data.thumbnails.size,
        quality: this.datas.dataSettings.data.thumbnails.quality
      });
      image.placeholder = result.placeholder;
      image.file.thumbnail = `${image.file.original}.${result.extname}`;
      await this.updatePetaImage(image, UpdateMode.UPDATE);
      log.log(`thumbnail (${i + 1} / ${images.length})`);
      this.emitMainEvent("regenerateThumbnailsProgress", i + 1, images.length);
    }
    await promiseSerial(generate, images).value;
    this.emitMainEvent("regenerateThumbnailsComplete");
  }
  /*------------------------------------
    PetaTag更新
  ------------------------------------*/
  async updatePetaTag(tag: PetaTag, mode: UpdateMode) {
    const log = this.mainLogger.logChunk();
    log.log("##Update PetaTag");
    log.log("mode:", mode);
    log.log("tag:", minimId(tag.id));
    if (mode == UpdateMode.REMOVE) {
      await this.datas.dataPetaImagesPetaTags.remove({ petaTagId: tag.id });
      await this.datas.dataPetaTags.remove({ id: tag.id });
      log.log("removed");
      return true;
    }
    // tag.petaImages = Array.from(new Set(tag.petaImages));
    await this.datas.dataPetaTags.update({ id: tag.id }, tag, mode == UpdateMode.UPSERT);
    log.log("updated");
    return true;
  }
  async updatePetaImagesPetaTags(petaImageIds: string[], petaTagIds: string[], mode: UpdateMode) {
    await promiseSerial(async (petaImageId) => {
      await promiseSerial(async (petaTagId) => {
        await this.updatePetaImagePetaTag(createPetaPetaImagePetaTag(petaImageId, petaTagId), mode);
      }, petaTagIds).value;
    }, petaImageIds).value;
    if (mode != UpdateMode.UPDATE) {
      this.emitMainEvent("updatePetaTags");
    }
  }
  /*------------------------------------
    PetaImagePetaTag更新
  ------------------------------------*/
  async updatePetaImagePetaTag(petaImagePetaTag: PetaImagePetaTag, mode: UpdateMode) {
    const log = this.mainLogger.logChunk();
    log.log("##Update PetaImagePetaTag");
    log.log("mode:", mode);
    log.log("tag:", minimId(petaImagePetaTag.id));
    if (mode == UpdateMode.REMOVE) {
      await this.datas.dataPetaImagesPetaTags.remove({ id: petaImagePetaTag.id });
      log.log("removed");
      return true;
    }
    await this.datas.dataPetaImagesPetaTags.update({ id: petaImagePetaTag.id }, petaImagePetaTag, mode == UpdateMode.UPSERT);
    log.log("updated");
    return true;
  }
  /*------------------------------------
    PetaImageからパスを取得
  ------------------------------------*/
  getImagePath(petaImage: PetaImage, thumbnail: ImageType) {
    if (thumbnail == ImageType.ORIGINAL) {
      return Path.resolve(this.paths.DIR_IMAGES, petaImage.file.original);
    } else {
      return Path.resolve(this.paths.DIR_THUMBNAILS, petaImage.file.thumbnail);
    }
  }
  /*------------------------------------
    画像インポート(ファイルパス)
  ------------------------------------*/
  async importImagesFromFilePaths(filePaths: string[]) {
    if (this.cancelImportImages) {
      this.cancelImportImages();
      this.cancelImportImages = undefined;
    }
    const log = this.mainLogger.logChunk();
    log.log("##Import Images From File Paths");
    log.log("###List Files", filePaths.length);
    this.emitMainEvent("importImagesBegin");
    // emitMainEvent("importImagesProgress", {
    //   progress: 0,
    //   file: filePaths.join("\n"),
    //   result: ImportImageResult.LIST
    // });
    const _filePaths: string[] = [];
    try {
      for (let i = 0; i < filePaths.length; i++) {
        const filePath = filePaths[i];
        if (!filePath) continue;
        const readDirResult = file.readDirRecursive(filePath, (filePaths) => {
          // console.log(filePaths);
        });
        this.cancelImportImages = readDirResult.cancel;
        _filePaths.push(...(await readDirResult.files));
      }
    } catch (error) {
      this.emitMainEvent("importImagesComplete", {
        addedFileCount: 0,
        fileCount: filePaths.length
      });
      return [];
    }
    log.log("complete", _filePaths.length);
    let addedFileCount = 0;
    const petaImages: PetaImage[] = [];
    const importImage = async (filePath: string, index: number) => {
      log.log("import:", index + 1, "/", _filePaths.length);
      let result = ImportImageResult.SUCCESS;
      try {
        const data = await file.readFile(filePath);
        const name = Path.basename(filePath);
        const fileDate = (await file.stat(filePath)).mtime;
        const addResult = await this.addImage({
          data, name, fileDate
        });
        petaImages.push(addResult.petaImage);
        if (addResult.exists) {
          result = ImportImageResult.EXISTS;
        } else {
          addedFileCount++;
        }
        log.log("imported", result);
      } catch (err) {
        log.error(err);
        result = ImportImageResult.ERROR;
      }
      this.emitMainEvent("importImagesProgress", {
        allFileCount: _filePaths.length,
        currentFileCount: index + 1,
        file: filePath,
        result: result
      });
    }
    const result = promiseSerial(importImage, _filePaths);
    this.cancelImportImages = result.cancel;
    try {
      await result.value;
    } catch (err) {
      //
    }
    this.cancelImportImages = undefined;
    log.log("return:", addedFileCount, "/", _filePaths.length);
    this.emitMainEvent("importImagesComplete", {
      addedFileCount: addedFileCount,
      fileCount: _filePaths.length
    });
    if (this.datas.dataSettings.data.autoAddTag) {
      this.emitMainEvent("updatePetaTags");
    }
    return petaImages;
  }
  async getPetaBoards() {
    const log = this.mainLogger.logChunk();
    const data = await this.datas.dataPetaBoards.find({});
    data.forEach((board) => {
      // バージョンアップ時のプロパティ更新
      upgradePetaBoard(board);
    })
    if (data.length == 0) {
      log.log("no boards");
      const board = createPetaBoard(DEFAULT_BOARD_NAME, 0, this.datas.dataSettings.data.darkMode);
      await this.updatePetaBoard(board, UpdateMode.UPSERT);
      data.push(board);
      return data;
    } else {
      return data;
    }
  }
  /*------------------------------------
    画像インポート(バッファー)
  ------------------------------------*/
  async importImagesFromBuffers(buffers: Buffer[], name: string) {
    if (this.cancelImportImages) {
      this.cancelImportImages();
      this.cancelImportImages = undefined;
    }
    this.emitMainEvent("importImagesBegin");
    const log = this.mainLogger.logChunk();
    log.log("##Import Images From Buffers");
    log.log("buffers:", buffers.length);
    let addedFileCount = 0;
    const petaImages: PetaImage[] = [];
    const importImage = async (buffer: Buffer, index: number) => {
      log.log("import:", index + 1, "/", buffers.length);
      let result = ImportImageResult.SUCCESS;
      try {
        const addResult = await this.addImage({
          data: buffer, name
        });
        petaImages.push(addResult.petaImage);
        if (addResult.exists) {
          result = ImportImageResult.EXISTS;
        } else {
          addedFileCount++;
        }
        log.log("imported", name, result);
      } catch (err) {
        log.error(err);
        result = ImportImageResult.ERROR;
      }
      this.emitMainEvent("importImagesProgress", {
        allFileCount: buffers.length,
        currentFileCount: index + 1,
        file: name,
        result: result
      });
    }
    const result =  promiseSerial(importImage, buffers);
    this.cancelImportImages = result.cancel;
    await result.value;
    this.cancelImportImages = undefined;
    log.log("return:", addedFileCount, "/", buffers.length);
    this.emitMainEvent("importImagesComplete", {
      addedFileCount: addedFileCount,
      fileCount: buffers.length
    });
    if (this.datas.dataSettings.data.autoAddTag) {
      this.emitMainEvent("updatePetaTags");
    }
    return petaImages;
  }
  /*------------------------------------
    PetaImage取得
  ------------------------------------*/
  async getPetaImage(id: string) {
    return (await this.datas.dataPetaImages.find({ id }))[0];
  }
  /*------------------------------------
    PetaImage追加
  ------------------------------------*/
  async addImage(param: { data: Buffer, name: string, fileDate?: Date, addDate?: Date }): Promise<{ exists: boolean, petaImage: PetaImage }> {
    const id = crypto.createHash("sha256").update(param.data).digest("hex");
    const exists = await this.getPetaImage(id);
    if (exists) return {
      petaImage: upgradePetaImage(exists),
      exists: true
    };
    const metadata = await sharp(param.data).metadata();
    let extName: string | undefined | null = undefined;
    if (metadata.orientation !== undefined) {
      // jpegの角度情報があったら回転する。pngにする。
      param.data = await sharp(param.data).rotate().png().toBuffer();
      extName = "png";
    } else {
      // formatを拡張子にする。
      extName = imageFormatToExtention(metadata.format);
    }
    if (!extName) {
      throw new Error("invalid image file type");
    }
    const addDate = param.addDate || new Date();
    const fileDate = param.fileDate || new Date();
    const originalFileName = `${id}.${extName}`;
    const thumbnail = await this.generateThumbnail({
      data: param.data,
      outputFilePath: Path.resolve(this.paths.DIR_THUMBNAILS, originalFileName),
      size: this.datas.dataSettings.data.thumbnails.size,
      quality: this.datas.dataSettings.data.thumbnails.quality
    });
    const petaImage: PetaImage = {
      file: {
        original: originalFileName,
        thumbnail: `${originalFileName}.${thumbnail.extname}`
      },
      name: param.name,
      fileDate: fileDate.getTime(),
      addDate: addDate.getTime(),
      width: 1,
      height: thumbnail.sharp.height / thumbnail.sharp.width,
      placeholder: thumbnail.placeholder,
      id: id,
      nsfw: false
    }
    if (this.datas.dataSettings.data.autoAddTag) {
      const name = dateFormat(addDate, "yyyy-mm-dd");
      const datePetaTag = (await this.datas.dataPetaTags.find({name: name}))[0] || createPetaTag(name);
      await this.updatePetaImagePetaTag(createPetaPetaImagePetaTag(petaImage.id, datePetaTag.id), UpdateMode.UPSERT);
      await this.updatePetaTag(datePetaTag, UpdateMode.UPSERT);
    }
    await file.writeFile(Path.resolve(this.paths.DIR_IMAGES, originalFileName), param.data);
    await this.datas.dataPetaImages.update({ id: petaImage.id }, petaImage, true);
    return {
      petaImage: petaImage,
      exists: false
    };
  }
  /*------------------------------------
    サムネイル作成
  ------------------------------------*/
  async generateThumbnail(params: {
    data: Buffer,
    outputFilePath: string,
    size: number,
    quality: number
  }) {
    let result: sharp.OutputInfo;
    const extname = params.outputFilePath.split(".").pop();
    let isGIF = extname == "gif";
    if (isGIF) {
      result = await sharp(params.data)
      .resize(params.size)
      .webp({ quality: params.quality })
      .toFile(params.outputFilePath + ".gif");
      await file.writeFile(
        params.outputFilePath + ".gif",
        params.data
      );
    } else {
      result = await sharp(params.data)
      .resize(params.size)
      .webp({ quality: params.quality })
      .toFile(params.outputFilePath + ".webp");
    }
    const placeholder = await new Promise<string>((res, rej) => {
      sharp(params.data)
      .resize(PLACEHOLDER_SIZE, Math.floor(result.height / result.width * PLACEHOLDER_SIZE))
      .raw()
      .ensureAlpha()
      .toBuffer((err, buffer, { width, height }) => {
        if (err) {
          rej(err);
        }
        try {
          res(encodePlaceholder(new Uint8ClampedArray(buffer), width, height, PLACEHOLDER_COMPONENT, PLACEHOLDER_COMPONENT));
        } catch(e) {
          rej(e);
        }
      });
    })
    return {
      sharp: result,
      placeholder,
      extname: isGIF ? "gif" : "webp"
    };
  }
}