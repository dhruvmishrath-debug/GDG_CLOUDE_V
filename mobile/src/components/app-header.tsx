import React, { type ReactNode } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

/**
 * Shared, app-wide header for every portal (Hospital / Pharmacy / Patient).
 *
 * Responsibilities:
 * - Consumes the top safe-area inset so the header never sits under the system
 *   status bar (time / network / battery) or a device notch. Left/right insets
 *   are honoured too (landscape notches, rounded corners).
 * - Fixed body height so the header never shifts between screens.
 * - Consistent horizontal padding, left-aligned icon + title/subtitle, and
 *   evenly spaced right-side actions, all vertically centered.
 */
export const HEADER_HEIGHT = 64;
export const HEADER_PADDING_HORIZONTAL = 16;

export type HeaderAction = {
  /** Stable key for the action (defaults to index). */
  key?: string;
  /** Accessibility label — required for icon-only buttons. */
  accessibilityLabel: string;
  /** Icon element, sized ~20-22px. */
  icon: ReactNode;
  onPress: () => void;
  /** Renders a small notification dot on the button. */
  showBadge?: boolean;
};

interface AppHeaderProps {
  /** Primary title, e.g. "CityCare Hospital". */
  title: string;
  /** Optional smaller gray subtitle, e.g. "Admin Portal". */
  subtitle?: string;
  /** Leading hospital/role icon. */
  icon: ReactNode;
  /** Background color behind the leading icon. */
  iconBackgroundColor?: string;
  /** Right-side icon buttons (notifications, logout, ...). */
  actions?: HeaderAction[];
}

export default function AppHeader({
  title,
  subtitle,
  icon,
  iconBackgroundColor = '#F1F5F9',
  actions = [],
}: AppHeaderProps) {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.header,
        {
          paddingTop: insets.top,
          paddingLeft: HEADER_PADDING_HORIZONTAL + insets.left,
          paddingRight: HEADER_PADDING_HORIZONTAL + insets.right,
        },
      ]}
    >
      <View style={styles.body}>
        <View style={styles.left}>
          <View style={[styles.logoBox, { backgroundColor: iconBackgroundColor }]}>
            {icon}
          </View>
          <View style={styles.titleBlock}>
            <Text style={styles.title} numberOfLines={1} allowFontScaling={false}>
              {title}
            </Text>
            {subtitle ? (
              <Text style={styles.subtitle} numberOfLines={1} allowFontScaling={false}>
                {subtitle}
              </Text>
            ) : null}
          </View>
        </View>

        {actions.length > 0 ? (
          <View style={styles.right}>
            {actions.map((action, index) => (
              <TouchableOpacity
                key={action.key ?? index}
                style={styles.iconBtn}
                onPress={action.onPress}
                activeOpacity={0.7}
                accessibilityRole="button"
                accessibilityLabel={action.accessibilityLabel}
                hitSlop={{ top: 8, bottom: 8, left: 4, right: 4 }}
              >
                {action.icon}
                {action.showBadge ? <View style={styles.badge} /> : null}
              </TouchableOpacity>
            ))}
          </View>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E2E8F0',
    // Subtle separation between header and page content.
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 3,
    zIndex: 10,
  },
  body: {
    height: HEADER_HEIGHT,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  left: {
    flex: 1,
    minWidth: 0,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  logoBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleBlock: {
    flex: 1,
    minWidth: 0,
    justifyContent: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E293B',
    lineHeight: 22,
  },
  subtitle: {
    fontSize: 13,
    color: '#64748B',
    lineHeight: 17,
    marginTop: 1,
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginLeft: 12,
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  badge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EF4444',
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
});
