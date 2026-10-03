import { useEffect } from 'react';
import { BackHandler } from 'react-native';

/**
 * Makes the Android hardware back button navigate within a tab shell instead of
 * exiting the app: pressing back from a non-default tab returns to the default
 * tab first, then behaves normally.
 */
export function useTabBackHandler(activeTab: string, defaultTab: string, setTab: (id: string) => void) {
  useEffect(() => {
    const onBack = () => {
      if (activeTab !== defaultTab) {
        setTab(defaultTab);
        return true; // handled — stay in the app
      }
      return false; // let the OS handle it
    };

    const sub = BackHandler.addEventListener('hardwareBackPress', onBack);
    return () => sub.remove();
  }, [activeTab, defaultTab, setTab]);
}
