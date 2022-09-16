import { Store, Event, createEvent, createStore } from 'effector';
import { Section, SectionHead, SectionTab, SectionContent } from './components';
import { createSetting } from './setting';

type TabConfig<T> = {
  title: string | Store<string>;
  fn: (_: { changeTab: Event<T> }) => void;
};
type TabsConfig<Keys extends string> = Record<Keys, TabConfig<Keys>>;

export function Tabs<Keys extends string>(tabs: TabsConfig<Keys>) {
  const tabList = Object.keys(tabs) as Keys[];
  const firstTab = tabList[0];

  const lastTab = createSetting('last-tab', firstTab);
  const savedTab = lastTab.read() as Keys;
  const initialTab = tabList.includes(savedTab) ? savedTab : firstTab;

  const changeTab = createEvent<Keys>();
  const $tab = createStore(initialTab);
  $tab.on(changeTab, (_, tab) => tab);

  $tab.watch(lastTab.write);

  Section(() => {
    SectionHead(() => {
      for (const key of tabList) {
        const tab = tabs[key];

        SectionTab({
          text: tab.title,
          data: {
            active: $tab.map((current) => current === key),
          },
          handler: { click: changeTab.prepend(() => key) },
        });
      }
    });
    for (const key of tabList) {
      const tab = tabs[key];

      SectionContent({
        visible: $tab.map((current) => current === key),
        fn() {
          tab.fn({ changeTab });
        },
      });
    }
  });
}
