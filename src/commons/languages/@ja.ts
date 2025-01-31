const ja = {
  hello: "こんにちは",
  titles: {
    details: "詳細",
    browser: "ブラウザ",
    boards: "ボード",
    settings: "設定"
  },
  shared: {
    yes: "はい",
    no: "いいえ",
    closeButton: "閉じる",
  },
  utils: {
    downloadUpdateDialog: (ctx: any) => {
      return `新しいアップデートを発見しました!!!\n現在のバージョン: ${ctx.list(0)}\n最新のバージョン: ${ctx.list(1)}\n手動でダウンロードしますか?`;
    }
  },
  utilsBar: {
    nsfwConfirm: "NSFWマークの付いた画像が表示されます。\nよろしいですか?"
  },
  home: {
    infoButton: "情報",
    settingsButton: "設定",
    importImagesFromFilesButton: "ファイル",
    importImagesFromDirectoriesButton: "フォルダ",
    openBrowserButton: "ブラウザ"
  },
  boards: {
    removeDialog: (ctx: any) => {
      return `ボード"${ctx.list(0)}"を削除しますか?`
    },
    selectErrorBoardDialog: (ctx: any) => {
      return `前回、ボード"${ctx.list(0)}"をロード中にアプリが終了されました。\nもう一度読み込みますか?`
    },
    menu: {
      openBrowser: "ブラウザを開く",
      resetPosition: "位置をリセット"
    },
    panelMenu: {
      toFront: "最前面へ移動",
      toBack: "最背面へ移動",
      details: "詳細を見る",
      playGIF: "GIFを再生",
      stopGIF: "GIFを停止",
      crop: "トリミング",
      flipHorizontal: "左右反転",
      flipVertical: "上下反転",
      reset: "リセット",
      remove: "削除"
    },
    addManyImageDialog: (ctx: any) => {
      return `${ctx.list(0)}枚の画像をボードに追加しますか?`
    },
    crop: {
      apply: "適用",
      reset: "リセット",
      cancel: "キャンセル"
    },
    loading: "読込中...",
    extracting: "展開中..."
  },
  browser: {
    tagMenu: {
      remove: (ctx: any) => {
        return `タグ "${ctx.list(0)}" を削除`
      },
    },
    petaImageMenu: {
      remove: (ctx: any) => {
        return `${ctx.list(0)}枚の画像を削除`
      },
      openImageFile: "画像ファイルの場所を開く",
      waifu2x: "waifu2xで変換する",
      searchImageByGoogle: "Googleで類似画像を検索"
    },
    removeImageDialog: (ctx: any) => {
      return `${ctx.list(0)}枚の画像を削除しますか?`
    },
    removeTagDialog: (ctx: any) => {
      return `タグ "${ctx.list(0)}" を削除しますか?\n画像は削除されません。`
    },
    tagAlreadyExistsDialog: (ctx: any) => {
      return `タグ" ${ctx.list(0)}" はすでに存在します`
    },
    property: {
      clickToAddTag: "タグ追加",
      tagName: "タグ名",
      fetchingTags: "タグ取得中...",
      selectedImage: (ctx: any) => {
        return `${ctx.list(0)}枚の画像を選択中`
      },
      tagMenu: {
        remove: (ctx: any) => {
          return `タグ"${ctx.list(0)}"を削除`
        },
      },
      clearSelectionButton: "選択解除",
      openDetailsButton: "詳細",
      clearSelectionDialog: "選択解除しますか?",
      tags: "タグ一覧",
      infos: {
        label: "情報",
        addDate: "追加日",
        fileDate: "変更日",
        note: "ノート",
        name: "名前"
      }
    },
    untagged: "未分類",
    all: "すべて",
    grouping: "分割"
  },
  tab: {
    menu: {
      remove: (ctx: any) => {
        return `ボード "${ctx.list(0)}" を削除`
      }
    }
  },
  info: {
    githubButton: "Github",
    issuesButton: "バグ/要望",
    dbFolderButton: "データベースフォルダ",
    configFolderButton: "コンフィグフォルダ",
    licenses: "使用しているライブラリ情報",
    assets: "使用しているアセット情報",
    debuggers: "デバッグ協力"
  },
  settings: {
    settings: "設定",
    general: "基本",
    control: "操作",
    browser: "ブラウザ",
    datas: "データ",
    others: "その他",
    info: "情報",
    update: "アップデート",
    darkMode: "ダークモード",
    autoDarkMode: "ダークモードの自動検出",
    autoDarkModeDescriptions: "PCの設定がダークモードかどうかを判別し、本アプリのダークモードを自動で切り替えます。",
    alwaysOnTop: "常に手前に表示",
    show: "を起動時に表示する。",
    showBoard: "ボードのみ",
    showBrowser: "ブラウザのみ",
    showBoth: "ボードとブラウザ",
    showDescriptions: "アプリ起動時に表示する画面を設定できます。",
    alwaysOnTopDescriptions: "このアプリのウインドウを常に最前面に固定します。",
    showFPS: "フレームレートを表示",
    showFPSDescriptions: "開発者向けの機能です。",
    zoomSensitivity: "ズーム感度",
    zoomSensitivityDescriptions: "-100のように、頭にマイナスを付けると反転できます。",
    moveSensitivity: "移動感度(Macのみ)",
    moveSensitivityDescriptions: "-100のように、頭にマイナスを付けると反転できます。",
    autoHideUI: "非アクティブ時にUIを隠す",
    autoHideUIDescriptions: "別アプリを操作している時に、タブバーやボタン等のUIを自動で隠します。",
    regenerateMetadatasButton: "メタデータ再生成",
    regenerateMetadatasConfirm: "サムネイルの再生成には時間がかかりますが、よろしいですか?",
    regenerateMetadatasDescriptions: "サムネイルやメタデータを再生成します。バージョンアップなどで仕様が変わった時に再生成する必要があります。",
    loadTilesInOriginal: "ブラウザをズーム時にフルサイズの画像を読み込む。(高スペックPC向け)",
    loadTilesInOriginalDescriptions: "ブラウザでズームした時に、フルサイズの画像を読み込みます。動作が重いと感じた場合はチェックを外すと良いです。",
    showTagsOnTile: "タグを表示する",
    showTagsOnTileDescriptions: "タグが邪魔な場合・ブラウザが重い場合はチェックを外すと良いです。",
    alwaysShowNSFW: "NSFWな画像を常に表示",
    alwaysShowNSFWDescriptions: "NSFWとしてマークした画像を常に表示します。気をつけてくださいね。",
    browsePetaImageDirectoryButton: "データの保存先を選ぶ",
    changePetaImageDirectoryButton: "データの保存先を適用",
    changePetaImageDirectoryDescriptions: "このアプリの画像の保存先を変更できます。",
    ignoreMinorUpdate: "マイナーアップデートの通知を無視する",
    ignoreMinorUpdateDescriptions: "大きな重要なアップデート以外の、小さなアップデートを無視します。\nアップデートの頻度が多くて困っている人向けの設定です。",
    updateAvailable: "新しいバージョンがあります。",
    thisIsLatest: "既に最新バージョンです。",
    latestVersion: "最新バージョン",
    currentVersion: "現在のバージョン",
    updateButton: "アップデートする",
    releaseNoteButton: "リリースノートを確認",
    changePetaImageDirectoryDialog: (ctx: any) => {
      return `データの保存先を\n"${ctx.list(0)}"\nに変更しますか?\n"はい"を押すと再起動します。`
    },
    changePetaImageDirectoryErrorDialog: (ctx: any) => {
      return `データの保存先を\n"${ctx.list(0)}"\nに変更出来ませんでした。\n他のフォルダを選んでください。`
    },
  },
  imageImporter: {
    cancel: "中止"
  },
  tasks: {
    updateDatas: {
      name: "データを更新しています。",
      logs: {
        begin: "開始",
        progress: "更新中",
        complete: "完了",
        failed: "失敗"
      }
    },
    listingFiles: {
      name: "一覧を取得しています。",
      logs: {
        begin: "開始",
        progress: "取得中",
        complete: "完了",
        failed: "失敗"
      }
    },
    importingFiles: {
      name: "ファイルをインポートしています。",
      logs: {
        begin: "開始",
        progress: (ctx: any) => {
          return `${ctx.list(0) === "error" ? "エラー" : ctx.list(0) === "exists" ? "重複" : "追加"}:${ctx.list(1)}`
        },
        complete: (ctx: any) => {
          return `${ctx.list(1)}件中${ctx.list(0)}件のインポートに成功しました。`
        },
        failed: (ctx: any) => {
          return `${ctx.list(1)}件中${ctx.list(0)}件のインポートに成功しました。`
        }
      }
    },
    upconverting: {
      name: "waifu2xで変換しています。",
      logs: {
        begin: (ctx: any) => {
          return `${ctx.list(0)}枚の画像を変換します。`;
        },
        progress: (ctx: any) => {
          return `waifu2xログ: ${ctx.list(0)}`;
        },
        complete: "完了",
        failed: "失敗",
      }
    },
    searchImageByGoogle: {
      name: "検索URLを生成中。",
      logs: {
        begin: "開始",
        complete: "完了",
        failed: (ctx: any) => {
          return `失敗: ${ctx.list(0)}`;
        },
        progress: (ctx: any) => {
          return `${ctx.list(0)}`;
        }
      },
    }
  } as {[key: string]: {
    name: string,
    logs: {
      begin: string | ((ctx: any) => void),
      progress: string | ((ctx: any) => void),
      complete: string | ((ctx: any) => void),
      failed: string | ((ctx: any) => void)
    }
  }}
};
export default ja;