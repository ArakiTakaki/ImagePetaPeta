import SettingsIndex from "@/rendererProcess/windows/settings.vue";
import { create } from "@/rendererProcess/windows/@create";
import { WindowType } from "@/commons/datas/windowType";
create(SettingsIndex, WindowType.SETTINGS);