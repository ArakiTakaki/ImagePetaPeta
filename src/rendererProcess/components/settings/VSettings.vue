<template>
  <t-settings-root>
    <ul>
      <li
        v-for="tab in tabs"
        :key="tab"
        :class="{
          selected: currentTab === tab
        }"
        @click="currentTab = tab"
      >
        {{$t("settings." + tab)}}
      </li>
    </ul>
    <t-contents>
      <!--
        General
      -->
      <t-content v-show="currentTab === 'general'">
        <label>
          <input
            type="checkbox"
            v-model="$settings.darkMode"
            :disabled="$settings.autoDarkMode"
          >
          {{$t("settings.darkMode")}}
        </label>
        <br>
        <label>
          <input
            type="checkbox"
            v-model="$settings.autoDarkMode"
          >
          {{$t("settings.autoDarkMode")}}
        </label>
        <p>{{$t("settings.autoDarkModeDescriptions")}}</p>
        <label>
          <input
            type="checkbox"
            v-model="$settings.alwaysOnTop"
          >
          {{$t("settings.alwaysOnTop")}}
        </label>
        <p>{{$t("settings.alwaysOnTopDescriptions")}}</p>
        <label>
          <select
            v-model="$settings.show"
          >
            <option value="board">{{$t("settings.showBoard")}}</option>
            <option value="browser">{{$t("settings.showBrowser")}}</option>
            <option value="both">{{$t("settings.showBoth")}}</option>
          </select>
          {{$t("settings.show")}}
        </label>
        <p>{{$t("settings.showDescriptions")}}</p>
      </t-content>
      <!--
        Control
      -->
      <t-content v-show="currentTab === 'control'">
        <label>
          {{$t("settings.zoomSensitivity")}}:
        </label>
        <input
          type="number"
          v-model="$settings.zoomSensitivity"
        >
        <p>{{$t("settings.zoomSensitivityDescriptions")}}</p>
        <label>
          {{$t("settings.moveSensitivity")}}:
        </label>
        <input
          type="number"
          v-model="$settings.moveSensitivity"
        >
        <p>{{$t("settings.moveSensitivityDescriptions")}}</p>
      </t-content>
      <!--
        Browser
      -->
      <t-content v-show="currentTab === 'browser'">
        <button
          v-show="regenerateMetadatasCompleted"
          @click="regenerateMetadatas"
        >
          {{$t("settings.regenerateMetadatasButton")}}
        </button>
        <label
          v-show="!regenerateMetadatasCompleted"
        >
          {{regenerateMetadatasDone}}/{{regenerateMetadatasCount}}
        </label>
        <p>{{$t("settings.regenerateMetadatasDescriptions")}}</p>
        <label>
          <input
            type="checkbox"
            v-model="$settings.loadTilesInOriginal"
          >
          {{$t("settings.loadTilesInOriginal")}}
        </label>
        <p>{{$t("settings.loadTilesInOriginalDescriptions")}}</p>
        <label>
          <input
            type="checkbox"
            v-model="$settings.showTagsOnTile"
          >
          {{$t("settings.showTagsOnTile")}}
        </label>
        <p>{{$t("settings.showTagsOnTileDescriptions")}}</p>
      </t-content>
      <!--
        Datas
      -->
      <t-content v-show="currentTab === 'datas'">
        <button
          @click="browsePetaImageDirectory"
        >
          {{$t("settings.browsePetaImageDirectoryButton")}}
        </button><br>
        <VEditableLabel
          :label="tempPetaImageDirectory"
          :clickToEdit="true"
          @input="(value) => tempPetaImageDirectory = value"
        />
        <br>
        <button
          @click="changePetaImageDirectory"
          :disabled="tempPetaImageDirectory === ''"
        >
          {{$t("settings.changePetaImageDirectoryButton")}}
        </button>
        <p>{{$t("settings.changePetaImageDirectoryDescriptions")}}</p>
      </t-content>
      <!--
        Others
      -->
      <t-content v-show="currentTab === 'others'">
        <label>
          <input
            type="checkbox"
            v-model="$settings.alwaysShowNSFW"
          >
          {{$t("settings.alwaysShowNSFW")}}
        </label><br>
        <p>{{$t("settings.alwaysShowNSFWDescriptions")}}</p>
        <label>
          <input
            type="checkbox"
            v-model="$settings.showFPS"
          >
          {{$t("settings.showFPS")}}
        </label><br>
        <p>{{$t("settings.showFPSDescriptions")}}</p>
      </t-content>
      <!--
        Update
      -->
      <t-content v-show="currentTab === 'update'" class="update">
        <t-strong>
          <p v-if="updateAvailable">
            {{$t("settings.updateAvailable")}}<br>
            {{$t("settings.currentVersion")}}: {{$appInfo.version}}<br>
            {{$t("settings.latestVersion")}}: {{latestVersion}}<br>
            <button @click="downloadUpdate">{{$t("settings.updateButton")}}</button>
          </p>
          <p v-else>
            {{$t("settings.thisIsLatest")}}<br>
            {{$t("settings.currentVersion")}}: {{$appInfo.version}}<br>
            <button @click="releaseNote">{{$t("settings.releaseNoteButton")}}</button>
          </p>
        </t-strong>
        <label>
          <input
            type="checkbox"
            v-model="$settings.ignoreMinorUpdate"
          >
          {{$t("settings.ignoreMinorUpdate")}}
        </label><br>
        <p>{{$t("settings.ignoreMinorUpdateDescriptions")}}</p>
        <!-- <button @click="downloadUpdate">{{$t("settings.updateButton")}}</button> -->
      </t-content>
      <!--
        Info
      -->
      <t-content v-show="currentTab === 'info'" class="info">
        <p>
          {{ $appInfo.name }} {{ $appInfo.version }}
        </p>
        <button
          tabindex="-1"
          @click="gotoGithub">
          {{$t("info.githubButton")}}
        </button>
        <button
          tabindex="-1"
          @click="gotoIssues">
          {{$t("info.issuesButton")}}
        </button>
        <p></p>
        <button
          tabindex="-1"
          @click="showDBFolder">
          {{$t("info.dbFolderButton")}}
        </button>
        <button
          tabindex="-1"
          @click="showConfigFolder">
          {{$t("info.configFolderButton")}}
        </button>
        <p>{{$t("info.assets")}}</p>
        <button
          tabindex="-1"
          @click="gotoIcons8">
          Icons8.com
        </button>
        <p>{{$t("info.debuggers")}}</p>
        <pre class="debuggers">{{ debuggers }}</pre>
        <p>{{$t("info.licenses")}}</p>
        <pre class="licenses">{{ licenses }}</pre>
      </t-content>
    </t-contents>
  </t-settings-root>
</template>

<script lang="ts">
// Vue
import { Options, Vue } from "vue-class-component";
import { Prop, Ref, Watch } from "vue-property-decorator";
// Components
import VEditableLabel from "@/rendererProcess/components/utils/VEditableLabel.vue";
// Others
import { API } from "@/rendererProcess/api";
import { Settings } from "@/commons/datas/settings";
import { LICENSES } from "@/@assets/licenses";
import { DOWNLOAD_URL, SUPPORT_URL } from "@/commons/defines";
import { DEBUGGERS } from "@/@assets/debuggers";
@Options({
  components: {
    VEditableLabel
  },
})
export default class VSettings extends Vue {
  regenerateMetadatasCompleted = true;
  regenerateMetadatasDone = 0;
  regenerateMetadatasCount = 0;
  tabs = ["general", "control", "browser", "datas", "others", "update", "info"];
  currentTab = "general";
  tempPetaImageDirectory = "";
  updateAvailable = false;
  latestVersion = "1.1.1";
  async mounted() {
    API.on("regenerateMetadatasProgress", (_, done, count) => {
      this.regenerateMetadatasDone = done;
      this.regenerateMetadatasCount = count;
      this.regenerateMetadatasCompleted = false;
    });
    API.on("regenerateMetadatasBegin", (_) => {
      this.regenerateMetadatasCompleted = false;
    });
    API.on("regenerateMetadatasComplete", (_) => {
      this.regenerateMetadatasCompleted = true;
    });
    API.on("foundLatestVersion", async (event, remote) => {
      this.latestVersion = remote.version;
      this.updateAvailable = true;
      this.currentTab = "update";
    });
    this.tempPetaImageDirectory = this.$settings.petaImageDirectory.path;
    if (this.$windowArgs === "update") {
      this.currentTab = "update";
      this.updateAvailable = true;
      this.latestVersion = (await API.send("getLatestVersion")).version;
    }
  }
  regenerateMetadatas() {
    API.send("regenerateMetadatas");
  }
  async browsePetaImageDirectory() {
    const path = await API.send("browsePetaImageDirectory");
    if (path) {
      this.tempPetaImageDirectory = path;
    }
  }
  async changePetaImageDirectory() {
    if (this.tempPetaImageDirectory) {
      const result = await this.$components.dialog.show(
        this.$t("settings.changePetaImageDirectoryDialog", [this.tempPetaImageDirectory]),
        [this.$t("shared.yes"), this.$t("shared.no")]
      );
      if (result === 0) {
        if (!await API.send("changePetaImageDirectory", this.tempPetaImageDirectory)) {
          await this.$components.dialog.show(
            this.$t("settings.changePetaImageDirectoryErrorDialog", [this.tempPetaImageDirectory]),
            [this.$t("shared.yes")]
          );
          this.tempPetaImageDirectory = this.$settings.petaImageDirectory.path;
        }
      } else {
        this.tempPetaImageDirectory = this.$settings.petaImageDirectory.path;
      }
    }
  }
  get licenses() {
    return LICENSES.map((lib) => `${lib.name}\n${lib.licenses}\n`).join('\n');
  }
  get debuggers() {
    return DEBUGGERS.join(", ");
  }
  gotoGithub() {
    API.send("openURL", "https://github.com/takumus/ImagePetaPeta");
  }
  gotoIssues() {
    API.send("openURL", `${SUPPORT_URL}?usp=pp_url&entry.1709939184=${encodeURIComponent(this.$appInfo.version)}`);
  }
  gotoIcons8() {
    API.send("openURL", "https://icons8.com/");
  }
  showDBFolder() {
    API.send("showDBFolder");
  }
  showConfigFolder() {
    API.send("showConfigFolder");
  }
  downloadUpdate() {
    API.send("openURL", `${DOWNLOAD_URL}${this.latestVersion}`);
  }
  releaseNote() {
    API.send("openURL", `${DOWNLOAD_URL}${this.$appInfo.version}`);
  }
}
</script>

<style lang="scss" scoped>
t-settings-root {
  text-align: center;
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
  >ul {
    list-style-type: none;
    padding: 0px;
    >li {
      margin: 0px 8px;
      display: inline-block;
      cursor: pointer;
      &.selected {
        text-decoration: underline;
      }
    }
  }
  >t-contents {
    height: 100%;
    overflow-y: scroll;
    overflow-x: hidden;
    display: block;
    >t-content {
      text-align: left;
      display: block;
      >p {
        font-size: var(--size-0);
        margin-left: 16px;
        word-break: break-word;
      }
      .file-path {
        width: 100%;
      }
      &.update {
        >t-strong {
          text-align: center;
          display: block;
          >p {
            font-size: var(--size-1);
            word-break: break-word;
          }
        }
      }
      &.info {
        text-align: center;
        display: block;
        >pre {
          &.licenses {
            text-align: left;
          }
          &.debuggers {
            text-align: center;
          }
          overflow: hidden;
          white-space: pre-wrap;
          font-size: var(--size-0);
        }
        >p {
          font-size: var(--size-1);
          word-break: break-word;
        }
      }
    }
  }
}
</style>