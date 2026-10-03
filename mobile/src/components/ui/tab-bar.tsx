import React, { type ReactNode } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { palette } from './theme';

export type TabItem = {
  id: string;
  label: string;
  /** Icon node — receives an `active` flag so callers can tint it. */
  renderIcon: (active: boolean) => ReactNode;
};

/**
 * Shared bottom tab bar. All portals use the same height, spacing and active
 * indicator treatment; only the accent color differs per portal.
 */
export default function TabBar({
  tabs,
  activeId,
  onSelect,
  activeColor = palette.blue,
}: {
  tabs: TabItem[];
  activeId: string;
  onSelect: (id: string) => void;
  activeColor?: string;
}) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.tabBar, { paddingBottom: Math.max(insets.bottom, 12) }]}>
      {tabs.map((tab) => {
        const active = tab.id === activeId;
        return (
          <TouchableOpacity
            key={tab.id}
            style={styles.tabItem}
            onPress={() => onSelect(tab.id)}
            activeOpacity={0.7}
            accessibilityRole="tab"
            accessibilityState={{ selected: active }}
            accessibilityLabel={tab.label}
          >
            {tab.renderIcon(active)}
            <Text style={[styles.tabLabel, active && { color: activeColor, fontWeight: '700' }]}>
              {tab.label}
            </Text>
            <View style={[styles.indicator, active && { backgroundColor: activeColor }]} />
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-start',
    backgroundColor: palette.card,
    borderTopWidth: 1,
    borderTopColor: palette.border,
    paddingTop: 10,
  },
  tabItem: { alignItems: 'center', gap: 3, minWidth: 64, paddingTop: 2 },
  tabLabel: { fontSize: 11, fontWeight: '500', color: palette.textMuted },
  indicator: {
    marginTop: 3,
    width: 18,
    height: 3,
    borderRadius: 2,
    backgroundColor: 'transparent',
  },
});
