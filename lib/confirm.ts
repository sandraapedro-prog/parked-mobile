import { Alert, Platform } from "react-native";

type ConfirmOptions = {
  title: string;
  message?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
};

/**
 * Cross-platform confirm dialog.
 *
 * React Native's `Alert.alert` does not render on react-native-web, so any
 * destructive button that depends on it appears broken in the browser
 * preview. This helper uses `window.confirm` on web and falls back to
 * `Alert.alert` on iOS / Android. Resolves to `true` if the user confirmed.
 */
export function confirm({
  title,
  message,
  confirmLabel = "OK",
  cancelLabel = "Cancel",
  destructive = false,
}: ConfirmOptions): Promise<boolean> {
  if (Platform.OS === "web") {
    const text = message ? `${title}\n\n${message}` : title;
    // Fail-closed: if we somehow have no window.confirm available
    // (SSR / test harness / unusual host), treat that as a cancel
    // so destructive actions are never auto-approved.
    const ok =
      typeof window !== "undefined" && typeof window.confirm === "function"
        ? window.confirm(text)
        : false;
    return Promise.resolve(ok);
  }

  return new Promise((resolve) => {
    Alert.alert(title, message, [
      {
        text: cancelLabel,
        style: "cancel",
        onPress: () => resolve(false),
      },
      {
        text: confirmLabel,
        style: destructive ? "destructive" : "default",
        onPress: () => resolve(true),
      },
    ]);
  });
}
