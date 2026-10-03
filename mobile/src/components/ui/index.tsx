import React, { type ReactNode } from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TextInput,
  type TextInputProps,
  type TextStyle,
  TouchableOpacity,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { ChevronRight, RefreshCw, Search, SlidersHorizontal } from 'lucide-react-native';

import {
  cardShadow,
  HIT_SLOP,
  palette,
  radius,
  spacing,
  toneStyles,
  type StatusTone,
} from './theme';

// ─── Screen scaffolding ──────────────────────────────────────────────────────

/** Page title used at the top of a tab's content. */
export function PageTitle({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <View style={styles.pageTitleWrap}>
      <Text style={styles.pageTitle}>{title}</Text>
      {subtitle ? <Text style={styles.pageSubtitle}>{subtitle}</Text> : null}
    </View>
  );
}

/** Consistent section heading. */
export function SectionTitle({
  children,
  style,
}: {
  children: ReactNode;
  style?: StyleProp<TextStyle>;
}) {
  return <Text style={[styles.sectionTitle, style]}>{children}</Text>;
}

/** White card container with the app's standard radius + shadow. */
export function Card({ children, style }: { children: ReactNode; style?: ViewStyle }) {
  return <View style={[styles.card, style]}>{children}</View>;
}

// ─── Search + Filter ─────────────────────────────────────────────────────────

export function SearchBar({
  value,
  onChangeText,
  placeholder,
  onFilterPress,
  filterActive,
  right,
  ...rest
}: {
  value: string;
  onChangeText: (t: string) => void;
  placeholder: string;
  onFilterPress?: () => void;
  filterActive?: boolean;
  right?: ReactNode;
} & Pick<TextInputProps, 'returnKeyType' | 'onSubmitEditing'>) {
  return (
    <View style={styles.searchRow}>
      <View style={styles.searchContainer}>
        <Search size={20} color={palette.textMuted} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder={placeholder}
          placeholderTextColor={palette.textMuted}
          value={value}
          onChangeText={onChangeText}
          {...rest}
        />
      </View>
      {onFilterPress ? (
        <TouchableOpacity
          style={[styles.filterBtn, filterActive && styles.filterBtnActive]}
          onPress={onFilterPress}
          activeOpacity={0.75}
          accessibilityRole="button"
          accessibilityLabel="Filter"
          hitSlop={HIT_SLOP}
        >
          <SlidersHorizontal
            size={18}
            color={filterActive ? palette.white : palette.textSecondary}
          />
          {filterActive ? <View style={styles.filterDot} /> : null}
        </TouchableOpacity>
      ) : null}
      {right}
    </View>
  );
}

/** Horizontally scrollable pill selector (categories / filters). */
export function ChipRow({
  items,
  activeId,
  onSelect,
}: {
  items: { id: string; label: string; count?: number }[];
  activeId: string;
  onSelect: (id: string) => void;
}) {
  return (
    <View style={styles.chipRowWrap}>
      <View style={styles.chipRow}>
        {items.map((item) => {
          const active = item.id === activeId;
          return (
            <TouchableOpacity
              key={item.id}
              style={[styles.chip, active && styles.chipActive]}
              onPress={() => onSelect(item.id)}
              activeOpacity={0.75}
              accessibilityRole="button"
              accessibilityState={{ selected: active }}
            >
              <Text style={[styles.chipTxt, active && styles.chipTxtActive]}>
                {item.label}
                {typeof item.count === 'number' ? ` (${item.count})` : ''}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

// ─── Badges ──────────────────────────────────────────────────────────────────

export function Badge({
  label,
  tone = 'neutral',
  style,
}: {
  label: string;
  tone?: StatusTone;
  style?: ViewStyle;
}) {
  const t = toneStyles[tone];
  return (
    <View style={[styles.badge, { backgroundColor: t.bg }, style]}>
      <Text style={[styles.badgeTxt, { color: t.fg }]} numberOfLines={1}>
        {label}
      </Text>
    </View>
  );
}

/** Tiny inline confidence chip. */
export function ConfidenceChip({ value }: { value: number }) {
  const tone: StatusTone = value >= 90 ? 'success' : value >= 80 ? 'warning' : 'danger';
  const t = toneStyles[tone];
  return (
    <View style={[styles.confChip, { backgroundColor: t.bg }]}>
      <Text style={[styles.confTxt, { color: t.fg }]}>{value}%</Text>
    </View>
  );
}

// ─── Buttons ─────────────────────────────────────────────────────────────────

export function PrimaryButton({
  label,
  onPress,
  icon,
  color = palette.blue,
  disabled,
}: {
  label: string;
  onPress: () => void;
  icon?: ReactNode;
  color?: string;
  disabled?: boolean;
}) {
  return (
    <TouchableOpacity
      style={[styles.primaryBtn, { backgroundColor: color }, disabled && styles.disabled]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.85}
      accessibilityRole="button"
      accessibilityLabel={label}
    >
      {icon}
      <Text style={styles.primaryBtnTxt}>{label}</Text>
    </TouchableOpacity>
  );
}

export function OutlineButton({
  label,
  onPress,
  icon,
  color = palette.blue,
}: {
  label: string;
  onPress: () => void;
  icon?: ReactNode;
  color?: string;
}) {
  return (
    <TouchableOpacity
      style={[styles.outlineBtn, { borderColor: color }]}
      onPress={onPress}
      activeOpacity={0.85}
      accessibilityRole="button"
      accessibilityLabel={label}
    >
      {icon}
      <Text style={[styles.outlineBtnTxt, { color }]}>{label}</Text>
    </TouchableOpacity>
  );
}

// ─── List rows ───────────────────────────────────────────────────────────────

/** Navigable settings-style row with a leading icon container. */
export function SettingRow({
  icon,
  iconBg = palette.slateSoft,
  title,
  subtitle,
  rightText,
  onPress,
  destructive,
  last,
}: {
  icon: ReactNode;
  iconBg?: string;
  title: string;
  subtitle?: string;
  rightText?: string;
  onPress?: () => void;
  destructive?: boolean;
  last?: boolean;
}) {
  return (
    <TouchableOpacity
      style={[styles.settingRow, last && styles.settingRowLast]}
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}
      disabled={!onPress}
      accessibilityRole="button"
      accessibilityLabel={title}
    >
      <View style={[styles.settingIcon, { backgroundColor: iconBg }]}>{icon}</View>
      <View style={styles.settingBody}>
        <Text style={[styles.settingTitle, destructive && { color: palette.red }]}>
          {title}
        </Text>
        {subtitle ? <Text style={styles.settingSubtitle}>{subtitle}</Text> : null}
      </View>
      {rightText ? <Text style={styles.settingRightText}>{rightText}</Text> : null}
      {onPress ? <ChevronRight size={18} color={palette.textMuted} /> : null}
    </TouchableOpacity>
  );
}

/** Key/value row used inside detail views. */
export function DetailRow({
  label,
  value,
  valueColor,
  last,
}: {
  label: string;
  value: ReactNode;
  valueColor?: string;
  last?: boolean;
}) {
  return (
    <View style={[styles.detailRow, last && styles.detailRowLast]}>
      <Text style={styles.detailLabel}>{label}</Text>
      {typeof value === 'string' || typeof value === 'number' ? (
        <Text style={[styles.detailValue, valueColor ? { color: valueColor } : null]}>
          {value}
        </Text>
      ) : (
        value
      )}
    </View>
  );
}

// ─── States: loading / empty / error ─────────────────────────────────────────

export function LoadingState({ message = 'Loading…' }: { message?: string }) {
  return (
    <View style={styles.stateWrap}>
      <ActivityIndicator size="large" color={palette.blue} />
      <Text style={styles.stateTitle}>{message}</Text>
    </View>
  );
}

export function EmptyState({
  icon,
  title,
  message,
  actionLabel,
  onAction,
}: {
  icon: ReactNode;
  title: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
}) {
  return (
    <View style={styles.stateWrap}>
      <View style={styles.stateIcon}>{icon}</View>
      <Text style={styles.stateTitle}>{title}</Text>
      <Text style={styles.stateMessage}>{message}</Text>
      {actionLabel && onAction ? (
        <TouchableOpacity style={styles.stateAction} onPress={onAction} activeOpacity={0.8}>
          <Text style={styles.stateActionTxt}>{actionLabel}</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

export function ErrorState({
  title = 'Something went wrong',
  message,
  onRetry,
}: {
  title?: string;
  message: string;
  onRetry?: () => void;
}) {
  return (
    <View style={styles.stateWrap}>
      <View style={[styles.stateIcon, { backgroundColor: palette.redSoft }]}>
        <RefreshCw size={26} color={palette.red} />
      </View>
      <Text style={styles.stateTitle}>{title}</Text>
      <Text style={styles.stateMessage}>{message}</Text>
      {onRetry ? (
        <TouchableOpacity style={styles.stateAction} onPress={onRetry} activeOpacity={0.8}>
          <Text style={styles.stateActionTxt}>Try again</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  pageTitleWrap: { marginBottom: spacing.lg },
  pageTitle: { fontSize: 24, fontWeight: '700', color: palette.text },
  pageSubtitle: { fontSize: 14, color: palette.textSecondary, marginTop: 2 },

  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: palette.text,
    marginBottom: spacing.md,
    marginTop: spacing.sm,
  },

  card: {
    backgroundColor: palette.card,
    borderRadius: radius.xl,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: palette.border,
    ...cardShadow,
  },

  searchRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.lg },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: palette.card,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    borderWidth: 1,
    borderColor: palette.border,
  },
  searchIcon: { marginRight: spacing.sm },
  searchInput: { flex: 1, paddingVertical: 12, fontSize: 15, color: palette.text },
  filterBtn: {
    width: 46,
    height: 46,
    borderRadius: radius.md,
    backgroundColor: palette.card,
    borderWidth: 1,
    borderColor: palette.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterBtnActive: { backgroundColor: palette.blue, borderColor: palette.blue },
  filterDot: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: palette.white,
  },

  chipRowWrap: { marginBottom: spacing.lg },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  chip: {
    paddingHorizontal: spacing.md,
    paddingVertical: 8,
    borderRadius: radius.pill,
    backgroundColor: palette.card,
    borderWidth: 1,
    borderColor: palette.border,
  },
  chipActive: { backgroundColor: palette.blue, borderColor: palette.blue },
  chipTxt: { fontSize: 13, fontWeight: '600', color: palette.textSecondary },
  chipTxtActive: { color: palette.white },

  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: radius.pill, alignSelf: 'flex-start' },
  badgeTxt: { fontSize: 11, fontWeight: '600' },

  confChip: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: radius.sm },
  confTxt: { fontSize: 11, fontWeight: '700' },

  primaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: 14,
    borderRadius: radius.md,
  },
  primaryBtnTxt: { color: palette.white, fontSize: 15, fontWeight: '600' },
  disabled: { opacity: 0.5 },

  outlineBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: 13,
    borderRadius: radius.md,
    borderWidth: 1.5,
    backgroundColor: palette.card,
  },
  outlineBtnTxt: { fontSize: 15, fontWeight: '600' },

  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: palette.divider,
  },
  settingRowLast: { borderBottomWidth: 0, paddingBottom: 0 },
  settingIcon: {
    width: 38,
    height: 38,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingBody: { flex: 1, minWidth: 0 },
  settingTitle: { fontSize: 15, fontWeight: '600', color: palette.text },
  settingSubtitle: { fontSize: 12, color: palette.textSecondary, marginTop: 2 },
  settingRightText: { fontSize: 13, color: palette.textSecondary, fontWeight: '500' },

  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: palette.divider,
  },
  detailRowLast: { borderBottomWidth: 0 },
  detailLabel: { fontSize: 13, color: palette.textSecondary, flex: 1 },
  detailValue: { fontSize: 14, fontWeight: '600', color: palette.text, textAlign: 'right', flexShrink: 1 },

  stateWrap: { alignItems: 'center', paddingVertical: 48, paddingHorizontal: spacing.xl },
  stateIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: palette.blueTint,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  stateTitle: { fontSize: 17, fontWeight: '700', color: palette.text, marginBottom: spacing.xs },
  stateMessage: {
    fontSize: 13,
    color: palette.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    maxWidth: 300,
  },
  stateAction: {
    marginTop: spacing.lg,
    paddingVertical: 11,
    paddingHorizontal: spacing.xl,
    borderRadius: radius.md,
    backgroundColor: palette.blue,
  },
  stateActionTxt: { color: palette.white, fontSize: 14, fontWeight: '600' },
});
